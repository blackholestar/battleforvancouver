import {Region, Challenge} from './types';
import {regions, challenges, battles} from './data';


export class Game {
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
    
    constructor () {
        this.regions = regions;
        this.redScore = 0;
        this.blueScore = 0;
        this.availableChallenges = challenges;
        this.completedChallenges = [];
        this.currentChallenges = []; // replace with this.initializeChallenges
        this.battleStatus = false;
        this.availableBattles = battles;
        this.currentBattle = null;
        this.concurrentChallenges = 3;
        this.initializeChallenges();
    };
    


    claimRegion(regionId: number, newStatus: string) {
        // calculate new scores then update region status
        if (this.regions[regionId].status === "red") {
            this.redScore--;
        }
        else if (this.regions[regionId].status === "blue") {
            this.blueScore--;
        }
        if (newStatus === "red") {
            this.redScore++;
        }
        else if (newStatus === "blue") {
            this.blueScore++;
        }
        
        this.regions[regionId].status = newStatus;
    }
    setRegionLock(regionId: number, locked: boolean) {
        this.regions[regionId].locked = locked;
    }

    private addChallenge() {
        // add a random challenge and remove from available
        let newChallenge = this.availableChallenges[Math.floor(Math.random() * this.availableChallenges.length)];
        this.currentChallenges.push(newChallenge);
        this.availableChallenges = this.removeChallenge(newChallenge, this.availableChallenges);
    }
    private removeChallenge(removedChallenge: Challenge, challengeList: Challenge[]) {
        // internal only, remove challenge from list inputted
        let newChallengeList = challengeList.filter(challenge => challenge.id !== removedChallenge.id);
        return newChallengeList;
    }
    private initializeChallenges() {
        // internal only; run addchallenge repeatedly to initialize
        for (let i=0; i<this.concurrentChallenges; i++) {
            this.addChallenge();
        }
    }


    completeChallenge(completedChallenge: Challenge) {
        // remove challenge from current, add to completed, and add new challenge
        this.completedChallenges.push(completedChallenge);
        this.currentChallenges = this.removeChallenge(completedChallenge, this.currentChallenges);
        this.addChallenge();
    }
    setBattle(battleStatus: boolean) {
        this.battleStatus = battleStatus;
    }
    replaceBattle() {
        // replace current battle and remove from available
        let newBattle = this.availableBattles[Math.floor(Math.random() * this.availableBattles.length)];
        this.currentBattle = newBattle;
        this.availableBattles = this.availableBattles.filter(battle => battle.id !== newBattle.id);
    }

    
    
    
};
