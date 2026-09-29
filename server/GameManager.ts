import { GameState, StoredGame, GameActionResult} from '../shared/types';
import {initialGameState, claimRegion, setRegionLock, initializeChallenges, addChallenge, stopBattle, startBattle} from './rules';
import { compactGameState, hydrateGameState } from './gameStateCodec';
import {supabase} from './supabase';

class GameManager{
    constructor() {}

    async createGame(): Promise<number> {
        // create new game: returns game id
        while (true) {
            const id = Math.floor(Math.random() * (99999 - 10000) + 10000);
            const gameHistory = [compactGameState(initializeChallenges(initialGameState))];
            const { data, error } = await supabase
                .from("GameStateTable")
                .insert({
                    id: id,
                    version: 0,
                    gameHistory: gameHistory,
                    currentIndex: 0,
                })
                .select()
                .single();
            console.log(data,id,error);
            if (!error) {
                return id;
            }
            if (error.code !== "23505") {
                throw new Error(`Failed to create new game ${error}${id}`);
                return -1;
            }

        }
    }
    
    async loadGame(gameId: string): Promise<StoredGame> {
        // load entire game (highest level)
        const {data, error} = await supabase
            .from("GameStateTable")
            .select("id, version, gameHistory, currentIndex")
            .eq("id", gameId)
            .single();
        if (error) {
            if (error.code === "PGRST116") {
                // no game exists with this id
                throw new Error(`No game exists with this ID`);
            }
            throw new Error(`Failed to load game: ${error.message}`);
        }
        
        return data as StoredGame;
    }
    async loadGameState(gameId: string): Promise<GameState> {
        const game = await this.loadGame(gameId);
        return hydrateGameState(game.gameHistory[game.currentIndex]);
    }

    async saveGame(game: StoredGame): Promise<void> {
        const {data, error } = await supabase
            .from("GameStateTable")
            .update({
                version: game.version + 1,
                gameHistory: game.gameHistory,
                currentIndex: game.currentIndex,
            })
            .eq("id", game.id)
            .eq("version", game.version)
            .select("id");
        if (error) {
            throw new Error(`Failed to save game: ${error.message}`);
        }

        if (data === null || data.length === 0) {
            throw new Error("Version conflict");
        }
    }


    private async applyAction(
        gameId: string,
        apply: (state: GameState) => GameState | string
    ): Promise<GameActionResult> {
        const game = await this.loadGame(gameId);
        const currentState = hydrateGameState(game.gameHistory[game.currentIndex]);
        const newState = apply(currentState);

        if (typeof newState === "string") {
            return {
                success: false,
                newGameState: currentState,
                error: newState,
            };
        }

        game.gameHistory = game.gameHistory.slice(0, game.currentIndex + 1);
        game.gameHistory.push(compactGameState(newState));
        game.currentIndex++;

        try {
            await this.saveGame(game);
        } catch (error) {
            if (!(error instanceof Error) || error.message !== "Version conflict") {
                throw error;
            }

            return {
                success: false,
                newGameState: await this.loadGameState(gameId),
                error: "Game changed before this action could be saved.",
            };
        }

        return {
            success: true,
            newGameState: newState,
        };
    }


    async claimRegion(gameId: string, regionId: number, status: string) {
        return await this.applyAction(gameId, (state) => claimRegion(state, regionId, status));
    }
    async setRegionLock(gameId: string, regionId: number, locked: boolean) {
        return await this.applyAction(gameId, (state) => setRegionLock(state, regionId, locked));
    }
    async addChallenge(gameId: string, challengeId: number | null) {
        return await this.applyAction(gameId, (state) => {
            if (challengeId === null) {
                return addChallenge(state, null);
            }
            const completedChallenge = state.currentChallenges.find(
                challenge => challenge.id === challengeId
            );
            if (!completedChallenge) {
                return `This challenge is not active (${challengeId})`;
            }
            return addChallenge(state, completedChallenge);
        });
    }
    async stopBattle(gameId: string) {
        return await this.applyAction(gameId, (state) => stopBattle(state));
    }
    async startBattle(gameId: string) {
        return await this.applyAction(gameId, (state) => startBattle(state));
    }
    async resetGame(gameId: string) {
        return await this.applyAction(gameId, () => initializeChallenges(initialGameState));
    }
    async undo(gameId: string) {
        let game: StoredGame = await this.loadGame(gameId);

        if (game.currentIndex > 0) {
            game.currentIndex--;
        }
        await this.saveGame(game);
    }
    async redo(gameId: string) {
        let game: StoredGame = await this.loadGame(gameId);

        if (game.currentIndex + 1 < game.gameHistory.length) {
            game.currentIndex++;
        }
        await this.saveGame(game);
        
    }
    
}
export const gameManager = new GameManager();
