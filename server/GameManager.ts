import { init } from 'next/dist/compiled/webpack/webpack';
import { Region, Challenge, GameState} from '../shared/types';
import {initialGameState, claimRegion, setRegionLock, initializeChallenges, addChallenge, setBattleStatus, replaceBattle} from './rules';

class GameManager{
    //private gameState: GameState;
    private gameHistory: GameState[];
    private currentIndex: number;

    constructor() {
        //this.gameState = initializeChallenges(initialGameState);
        this.gameHistory = [initializeChallenges(initialGameState)];
        this.currentIndex = 0;
    }

    private setNewGameState(newState: GameState) {
        this.gameHistory = this.gameHistory.slice(0,this.currentIndex + 1);
        this.gameHistory.push(newState);
        //this.gameState = newState;
        this.currentIndex++;
    }
    private currentGameState() {
        return (this.gameHistory[this.currentIndex]);
    }

    claimRegion(regionId: number, status: string) {
        this.setNewGameState(claimRegion(this.currentGameState(), regionId, status));
    }
    setRegionLock(regionId: number, locked: boolean) {
        this.setNewGameState(setRegionLock(this.currentGameState(), regionId, locked));
    }
    addChallenge(completedChallenge: Challenge | null) {
        this.setNewGameState(addChallenge(this.currentGameState(), completedChallenge));
    }
    setBattleStatus(battleStatus: boolean) {
        this.setNewGameState(setBattleStatus(this.currentGameState(), battleStatus));
    }
    replaceBattle() {
        this.setNewGameState(replaceBattle(this.currentGameState()));
    }
    getGameState() {
        return (this.gameHistory[this.currentIndex]);
    }
    resetGame() {
        this.setNewGameState(initializeChallenges(initialGameState));
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