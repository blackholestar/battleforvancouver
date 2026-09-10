import { init } from 'next/dist/compiled/webpack/webpack';
import { Region, Challenge, GameState, GameActionResult} from '../shared/types';
import {initialGameState, claimRegion, setRegionLock, initializeChallenges, addChallenge, stopBattle, startBattle} from './rules';

class GameManager{
    //private gameState: GameState;
    private gameHistory: GameState[];
    private currentIndex: number;

    constructor() {
        //this.gameState = initializeChallenges(initialGameState);
        this.gameHistory = [initializeChallenges(initialGameState)];
        this.currentIndex = 0;
    }

    private setNewGameState(newState: GameState|string) {
        // return value is true/false for success
        let response: GameActionResult;

        if (typeof newState === "string") {
            // error
            response = {
                success: false,
                newGameState: this.getGameState(),
                error: newState,
            }
        }
        else {
            this.gameHistory = this.gameHistory.slice(0,this.currentIndex + 1);
            this.gameHistory.push(newState);
            this.currentIndex++;
            response = {
                success: true,
                newGameState: this.getGameState(),
            }
        }
        return response;
    }


    claimRegion(regionId: number, status: string) {
        return this.setNewGameState(claimRegion(this.getGameState(), regionId, status));
    }
    setRegionLock(regionId: number, locked: boolean) {
        return this.setNewGameState(setRegionLock(this.getGameState(), regionId, locked));
    }
    addChallenge(completedChallenge: Challenge | null) {
        return this.setNewGameState(addChallenge(this.getGameState(), completedChallenge));
    }
    stopBattle() {
        return this.setNewGameState(stopBattle(this.getGameState()));
    }
    startBattle() {
        return this.setNewGameState(startBattle(this.getGameState()));
    }
    getGameState() {
        return (this.gameHistory[this.currentIndex]);
    }
    resetGame() {
        return this.setNewGameState(initializeChallenges(initialGameState));
    }
    undo() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        }
    }
    redo() {
        if (this.currentIndex + 1 < this.gameHistory.length) {
            this.currentIndex++;
        }
    }
    
}
export const gameManager = new GameManager();