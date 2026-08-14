import { init } from 'next/dist/compiled/webpack/webpack';
import { Region, Challenge, GameState} from '../shared/types';
import {initialGameState, claimRegion, setRegionLock, initializeChallenges, addChallenge, setBattleStatus, replaceBattle} from './rules';

class GameManager{
    private gameState: GameState;

    constructor() {
        this.gameState = initializeChallenges(initialGameState);
    }

    claimRegion(regionId: number, status: string) {
        this.gameState = claimRegion(this.gameState, regionId, status);
    }
    setRegionLock(regionId: number, locked: boolean) {
        this.gameState = setRegionLock(this.gameState, regionId, locked);
    }
    addChallenge(completedChallenge: Challenge | null) {
        this.gameState = addChallenge(this.gameState, completedChallenge);
    }
    setBattleStatus(battleStatus: boolean) {
        this.gameState = setBattleStatus(this.gameState, battleStatus);
    }
    replaceBattle() {
        this.gameState = replaceBattle(this.gameState);
    }
    getGameState() {
        return this.gameState;
    }
    resetGame() {
        this.gameState = initializeChallenges(initialGameState);
    }
    
}
export const gameManager = new GameManager();