import { init } from 'next/dist/compiled/webpack/webpack';
import { Region, Challenge, GameState, StoredGame, GameActionResult} from '../shared/types';
import {initialGameState, claimRegion, setRegionLock, initializeChallenges, addChallenge, stopBattle, startBattle} from './rules';
import {supabase} from './supabase';

class GameManager{
    //private gameState: GameState;
    //private game: StoredGame;

    constructor() {}

    async createGame(): Promise<number> {
        // create new game: returns game id
        while (true) {
            const id = Math.floor(Math.random() * (99999 - 10000) + 10000);
            const gameHistory = [initializeChallenges(initialGameState)];
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
                throw new Error(`No game exists with ID ${gameId}`);
            }
            throw new Error(`Failed to load game: ${error.message}`);
        }
        
        return data as StoredGame;
    }
    async loadGameState(gameId: string): Promise<GameState> {
        // load only current game state, calls loadGame
        const game = await this.loadGame(gameId);
        return game.gameHistory[game.currentIndex];

    }

    async saveGame(game: StoredGame): Promise<void> {
        // save entire game (highest level, usually used with setNewGameState)


        const {data, error } = await supabase
            .from("GameStateTable")
            .update({
                version: game.version + 1,
                gameHistory: game.gameHistory,
                currentIndex: game.currentIndex,
            })
            .eq("id", game.id)
            .eq("version", game.version)
            .select("id)");
        if (error) {
            throw new Error(`Failed to save game: ${error.message}`);
        }

        if (data === null || data.length === 0) {
            throw new Error("Version conflict");
    }
    }


    private async setNewGameState(gameId: string, newState: GameState|string) {
        // update game with new gameState only, calls saveGame
        let response: GameActionResult;
        let game: StoredGame = await this.loadGame(gameId);

        if (typeof newState === "string" || game === null) {
            // error
            response = {
                success: false,
                newGameState: await this.loadGameState(gameId),
                error: typeof newState === "string" ? newState : "A game with this game ID does not exist",
            }
        }
        else {
            game.gameHistory = game.gameHistory.slice(0,game.currentIndex + 1);
            game.gameHistory.push(newState);
            game.currentIndex++;
            await this.saveGame(game);
            response = {
                success: true,
                newGameState: await this.loadGameState(gameId),
            }
        }
        return response;
    }


    async claimRegion(gameId: string, regionId: number, status: string) {
        return await this.setNewGameState(gameId, claimRegion(await this.loadGameState(gameId), regionId, status));
    }
    async setRegionLock(gameId: string, regionId: number, locked: boolean) {
        return await this.setNewGameState(gameId, setRegionLock(await this.loadGameState(gameId), regionId, locked));
    }
    async addChallenge(gameId: string, completedChallenge: Challenge | null) {
        return await this.setNewGameState(gameId, addChallenge(await this.loadGameState(gameId), completedChallenge));
    }
    async stopBattle(gameId: string) {
        return await this.setNewGameState(gameId, stopBattle(await this.loadGameState(gameId)));
    }
    async startBattle(gameId: string) {
        return await this.setNewGameState(gameId, startBattle(await this.loadGameState(gameId)));
    }
    /*getGameState() {
        // *change
        return (this.game.gameHistory[this.game.currentIndex]);
    }*/
    async resetGame(gameId: string) {
        return await this.setNewGameState(gameId, initializeChallenges(initialGameState));
    }
    async undo(gameId: string) {
        let game: StoredGame = await this.loadGame(gameId);

        if (game.currentIndex > 0) {
            game.currentIndex--;
        }
        await this.saveGame(game);
        //return this.loadGame(gameId);
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