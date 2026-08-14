"use client";
import { Challenge, GameState } from '../shared/types';
import { useState } from "react";

type ChallengePageProps = {
    gameState: GameState,
    addChallenge: (completedChallenge: Challenge|null) => void
}
export function ChallengePage({gameState, addChallenge}: ChallengePageProps) {
    return (
        <div className="max-w-4xl mx-auto py-4 space-y-6">

            <h1 className="text-3xl font-bold">
                Challenges
            </h1>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">
                    Current Challenges
                </h2>

                <CurrentChallengeList
                    challengeList={gameState.currentChallenges}
                    addChallenge={addChallenge}
                />
            </section>


            <section className="space-y-3">
                <h2 className="text-xl font-semibold">
                    Completed Challenges
                </h2>

                <CompletedChallengeList
                    challengeList={gameState.completedChallenges}
                />
            </section>

        </div>

    )

}

type CurrentChallengeListProps = {
    challengeList: Challenge[];
    addChallenge: ((completedChallenge: Challenge | null) => void)
}
function CurrentChallengeList({challengeList, addChallenge}: CurrentChallengeListProps) {
    return (
        <div className="grid gap-3">
            {challengeList.map(challenge =>
                <ChallengeInstance
                    key={challenge.id}
                    challenge={challenge}
                    addChallenge={addChallenge}
                />
            )}
        </div>
    );
}
type CompletedChallengeListProps = {
    challengeList: Challenge[];
}
function CompletedChallengeList({challengeList}: CompletedChallengeListProps) {
    return (
        <div className="grid grid-cols-3 gap-3">
            {challengeList.map(challenge =>
                <div
                    key={challenge.id}
                    className="
                        bg-gray-100
                        rounded-md
                        px-3
                        py-2
                        text-gray-700
                        hover:bg-gray-200 transiiton

                    "
                >
                    {challenge.name} ({challenge.id})
                </div>
            )}
        </div>
    );
}

type ChallengeInstanceProps = {
    challenge: Challenge,
    addChallenge: (completedChallenge: Challenge | null) => void

}
function ChallengeInstance({challenge, addChallenge}: ChallengeInstanceProps) {
    return (
        <div
            className="
                bg-white
                border
                rounded-xl
                shadow-sm
                p-4
                space-y-2
                hover:bg-gray-100 transition
            "
        >
            <h3 className="text-lg font-semibold">
                {challenge.name}
            </h3>

            <p className="text-gray-600">
                {challenge.description} ({challenge.id})
            </p>

            <button
                className="
                    bg-green-600
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    hover:bg-green-700
                    transition
                "
                onClick={() => addChallenge(challenge)}
            >
                Complete
            </button>
        </div>
    )
}