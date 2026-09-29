import { battles, challenges, regions } from './data';
import type { Challenge, GameState, StoredGameState, StoredRegion } from '../shared/types';

const regionById = new Map(regions.map(region => [region.id, region]));
const challengeById = new Map(challenges.map(challenge => [challenge.id, challenge]));
const battleById = new Map(battles.map(battle => [battle.id, battle]));

function challengeIds(list: Challenge[]): number[] {
    return list.map(challenge => challenge.id);
}

function hydrateChallenges(ids: number[], catalog: Map<number, Challenge>, kind: string): Challenge[] {
    return ids.map(id => {
        const challenge = catalog.get(id);
        if (!challenge) {
            throw new Error(`Unknown ${kind} id ${id}`);
        }
        return challenge;
    });
}

export function compactGameState(state: GameState): StoredGameState {
    return {
        regions: state.regions.map((region): StoredRegion => ({
            id: region.id,
            status: region.status,
            locked: region.locked,
        })),
        redScore: state.redScore,
        blueScore: state.blueScore,
        availableChallenges: challengeIds(state.availableChallenges),
        completedChallenges: challengeIds(state.completedChallenges),
        currentChallenges: challengeIds(state.currentChallenges),
        battleStatus: state.battleStatus,
        availableBattles: challengeIds(state.availableBattles),
        currentBattle: state.currentBattle?.id ?? null,
        concurrentChallenges: state.concurrentChallenges,
        lastAction: state.lastAction,
    };
}

export function hydrateGameState(stored: StoredGameState): GameState {
    return {
        regions: stored.regions.map(storedRegion => {
            const catalogRegion = regionById.get(storedRegion.id);
            if (!catalogRegion) {
                throw new Error(`Unknown region id ${storedRegion.id}`);
            }
            return {
                id: storedRegion.id,
                name: catalogRegion.name,
                status: storedRegion.status,
                locked: storedRegion.locked,
            };
        }),
        redScore: stored.redScore,
        blueScore: stored.blueScore,
        availableChallenges: hydrateChallenges(stored.availableChallenges, challengeById, 'challenge'),
        completedChallenges: hydrateChallenges(stored.completedChallenges, challengeById, 'challenge'),
        currentChallenges: hydrateChallenges(stored.currentChallenges, challengeById, 'challenge'),
        battleStatus: stored.battleStatus,
        availableBattles: hydrateChallenges(stored.availableBattles, battleById, 'battle'),
        currentBattle: stored.currentBattle === null
            ? null
            : hydrateChallenges([stored.currentBattle], battleById, 'battle')[0],
        concurrentChallenges: stored.concurrentChallenges,
        lastAction: stored.lastAction,
    };
}
