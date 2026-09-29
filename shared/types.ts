
export type Region = {
    id: number,
    name: string,
    status: string,
    locked: boolean
}
export type Challenge = {
    id: number,
    name: string,
    description: string
}
export type GameState = {
    regions: Region[];
    redScore: number;
    blueScore: number;
    availableChallenges: Challenge[];
    completedChallenges: Challenge[];
    currentChallenges: Challenge[];
    battleStatus: boolean;
    availableBattles: Challenge[];
    currentBattle: Challenge|null;
    concurrentChallenges: number;
    lastAction: string;
}

export type StoredRegion = {
    id: number;
    status: string;
    locked: boolean;
}

export type StoredGameState = {
    regions: StoredRegion[];
    redScore: number;
    blueScore: number;
    availableChallenges: number[];
    completedChallenges: number[];
    currentChallenges: number[];
    battleStatus: boolean;
    availableBattles: number[];
    currentBattle: number | null;
    concurrentChallenges: number;
    lastAction: string;
}

export type StoredGame = {
    id: number; //game id
    gameHistory: StoredGameState[];
    currentIndex: number;
    version: number;
}

export type GameActionResult = 
| {
    success: true;
    newGameState: GameState;
}
| {
    success: false;
    newGameState: GameState|null;
    error: string;
}