"use client";
import { Challenge, GameState } from '../shared/types';
import { useState } from "react";

type BattleProps = {
    gameState: GameState,
    stopBattle: () => void,
    startBattle: () => void
}

export function Battle({gameState, stopBattle, startBattle}: BattleProps) {


    return (
        <div className={`flex flex-col gap-4 p-4 border rounded-xl shadow-sm transition ${gameState.battleStatus ? "bg-red-100" : "bg-gray-100"}`}>
            <BattleDisplay gameState={gameState} />
            {gameState.battleStatus 
            ? <StopBattleButton stopBattle={stopBattle} />
            : gameState.availableBattles.length > 0 && <ReplaceBattleButton startBattle={startBattle} />}
            
        </div>
    )
}

type BattleDisplayProps = {
    gameState: GameState
}
function BattleDisplay({gameState}: BattleDisplayProps) {
    if (gameState.currentBattle === null) {
        return (
            <div>
                <div>There is currently no battle</div>
            </div>
        )
    } 
    else if (gameState.battleStatus === false) {
        return (
            <div>
                <div>There is currently no battle</div>
                <div className="text-sm">
                    Previous battle: {gameState.currentBattle.name}
                </div>
            </div>
        )
    }
    else {
        return (
            <>
                <div className="text-2xl font-semibold">
                    Battle: {gameState.currentBattle.name}
                </div>
                <div>
                    {gameState.currentBattle.description} ({gameState.currentBattle.id})
                </div>
            </>
        )
    }
}

type StopBattleButtonProps = {
    stopBattle: () => void
}
function StopBattleButton({ stopBattle }: StopBattleButtonProps) {
    return (
        <button onClick={() => stopBattle()} className="rounded-lg px-4 py-2 bg-red-400 hover:bg-red-500 transition">End Battle</button>
    )

}

type ReplaceBattleButtonProps = {
    startBattle: () => void
}
function ReplaceBattleButton({startBattle}: ReplaceBattleButtonProps) {
    return (
        <button onClick={() => startBattle()} className="rounded-lg px-4 py-2 bg-gray-300 hover:bg-gray-400 transition">Start New Battle</button>
    ) 
}