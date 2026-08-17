// rules - functions for modifying the game state
import { Region, Challenge, GameState } from '../shared/types';
import {regions, challenges, battles} from './data';

export const initialGameState: GameState = {
    regions: regions,
    redScore: 0,
    blueScore: 0,
    availableChallenges: challenges,
    completedChallenges: [],
    currentChallenges: [],
    battleStatus: false,
    availableBattles: battles,
    currentBattle: null,
    concurrentChallenges: 6,
    gameHistory: [],
    lastAction: "None"
  }


export function claimRegion(gameState: GameState, regionId: number, newStatus: string) : GameState {
    // calculate new scores then update region status
    let lastStatus = gameState.regions[regionId].status;
    let newRedScore = gameState.redScore;
    let newBlueScore = gameState.blueScore;
    if (lastStatus === "red") {
        newRedScore--;
    }
    else if (lastStatus === "blue") {
        newBlueScore--;
    }
    if (newStatus === "red") {
        newRedScore++;
    }
    else if (newStatus === "blue") {
        newBlueScore++;
    }

    return {
        ...gameState,
        redScore: newRedScore,
        blueScore: newBlueScore,
        regions: gameState.regions.map(region => region.id === regionId
            ? { ...region, status: newStatus }
            : region
        ),
        lastAction: `Claimed region ${gameState.regions[regionId].name} for ${newStatus}`
        

    }
}
export function setRegionLock(gameState: GameState, regionId: number, locked: boolean): GameState {
    return {
        ...gameState,
        regions: gameState.regions.map(region => region.id === regionId
            ? {...region, locked: locked}
            : region
        ),
        lastAction: `${locked ? "Locked" : "Unlocked"} region ${gameState.regions[regionId].name}`
    }
}


export function initializeChallenges(gameState: GameState): GameState {
    //  run addchallenge repeatedly to initialize; returns Challenge[]
    let newGameState = gameState;
    for (let i = 0; i < gameState.concurrentChallenges; i++) {
        newGameState = addChallenge(newGameState, null);
    }
    return newGameState;
}


export function addChallenge(gameState: GameState, completedChallenge: Challenge | null): GameState {
    // Replaces challenge with new random one, or just adds a challenge (if null)

    // determine new challenge
    const newChallenge = gameState.availableChallenges[Math.floor(Math.random() * gameState.availableChallenges.length)];
    // remove new challenge from available
    const newAvailableChallenges = gameState.availableChallenges.filter(challenge => challenge.id !== newChallenge?.id);
    // add new challenge to current
    let newCurrentChallenges = newChallenge === undefined
    ? gameState.currentChallenges
    : [...gameState.currentChallenges,
            newChallenge];
    
    // remove completed challenge from current
    if (completedChallenge !== null) {
        newCurrentChallenges = newCurrentChallenges.filter(challenge => challenge.id !== completedChallenge.id);
    }

    // add completed challenge to completed list (if not null)
    const newCompletedChallenges = 
        completedChallenge === null 
        ? gameState.completedChallenges
        : [...gameState.completedChallenges, completedChallenge];

    return {
        ...gameState,
        availableChallenges: newAvailableChallenges,
        currentChallenges: newCurrentChallenges,
        completedChallenges: newCompletedChallenges,
        lastAction: completedChallenge === null
            ? "Reset game"
            : `Completed challenge ${completedChallenge.name} and added challenge ${newChallenge.name}`

    }

}
export function setBattleStatus(gameState: GameState, battleStatus: boolean): GameState {
    return ({
        ...gameState,
        battleStatus: battleStatus,
        lastAction: `${battleStatus ? "Started" : "Ended"} battle ${gameState.currentBattle !== null && gameState.currentBattle.name}`
    })
}
export function replaceBattle(gameState: GameState): GameState {
    // replace current battle, remove from available, and set battle status to true
    if (gameState.availableBattles.length === 0) {
        return (gameState);
    }
    // determine new battle
    const newBattle = gameState.availableBattles[Math.floor(Math.random() * gameState.availableBattles.length)];
    // remove from available battles
    const newAvailableBattles = gameState.availableBattles.filter(battle => battle.id !== newBattle.id);

    return ({
        ...gameState,
        currentBattle: newBattle,
        battleStatus: true,
        availableBattles: newAvailableBattles,
        lastAction: `Started battle ${newBattle.name}`
    })

}

