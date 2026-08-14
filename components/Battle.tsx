"use client";
import { Challenge, GameState } from '../shared/types';
import { useState } from "react";

type BattleProps = {
    gameState: GameState,
    setBattleStatus: (newStatus: boolean) => void,
    replaceBattle: () => void
}

export function Battle({gameState, setBattleStatus, replaceBattle}: BattleProps) {
    
    function RestartBattle() {
        setBattleStatus(true);
        replaceBattle();
    }

    return (
        <div className={`flex flex-col gap-4 p-4 border rounded-xl shadow-sm transition ${gameState.battleStatus ? "bg-red-100" : "bg-gray-100"}`}>
            <BattleDisplay gameState={gameState} />
            {gameState.battleStatus 
            ? <StopBattleButton setBattleStatus={setBattleStatus} />
            : gameState.availableBattles.length > 0 && <ReplaceBattleButton RestartBattle={RestartBattle} />}
            
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
    setBattleStatus: (newStatus: boolean) => void
}
function StopBattleButton({ setBattleStatus }: StopBattleButtonProps) {
    return (
        <button onClick={() => setBattleStatus(false)} className="rounded-lg px-4 py-2 bg-red-400 hover:bg-red-500 transition">End Battle</button>
    )

}

type ReplaceBattleButtonProps = {
    RestartBattle: () => void
}
function ReplaceBattleButton({RestartBattle}: ReplaceBattleButtonProps) {
    return (
        <button onClick={() => RestartBattle()} className="rounded-lg px-4 py-2 bg-gray-300 hover:bg-gray-400 transition">Start New Battle</button>
    ) 
}