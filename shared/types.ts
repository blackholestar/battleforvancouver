
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
}
