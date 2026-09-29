"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {useParams} from 'next/navigation';

import type {Region, Challenge, GameState} from '@/shared/types';

import {MapPage} from '@/components/Map';
import {ChallengePage} from '@/components/ChallengeGrid';
import {Battle} from '@/components/Battle';

export default function Page() {
  const params = useParams();
  const gameId = params.gameId as string;

  const [gameState, setGameState] = useState<GameState|null>(null);
  // what page is currently displayed (map, challenges, rules (future))
  const [currentPage, setCurrentPage] = useState<string>("map"); 

  const refreshRate = 2000; // refreshes gameState every x ms
  // get gamestate initially
  useEffect(() => {
    fetch(`/api/game/${gameId}/get-game-state`)
      .then(response => response.json())
      .then(data => {
        setGameState(data.newGameState);
        console.log(data);
        if (data.error === "No game exists with this ID") {
          alert(`No game exists with this game ID (${gameId})`);
        }
      });
  },[]);

  // get gamestate every x seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch(`/api/game/${gameId}/get-game-state`);
      const data = await response.json();

      setGameState(data.newGameState);
    }, refreshRate);

    return () => clearInterval(interval);
  }, []);


  async function claimRegion(regionId: number, newStatus: string) {
    const response = await fetch(`/api/game/${gameId}/claim-region`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        regionId,
        newStatus
      })
    });
    const data = await response.json();

    console.log("response", data);
    console.log("newGameState", data.newGameState);
    setGameState(data.newGameState);
    
  }

  async function setRegionLock(regionId: number, locked: boolean) {
    const response = await fetch(`/api/game/${gameId}/set-region-lock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        regionId,
        locked
      })
    });
    const data = await response.json();
    setGameState(data.newGameState);
    
  }

  async function addChallenge(completedChallenge: Challenge | null) {
    const response = await fetch(`/api/game/${gameId}/add-challenge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        challengeId: completedChallenge?.id ?? null
      })
    });
    const data = await response.json();

    console.log(data);
    setGameState(data.newGameState);
    
  }

  async function stopBattle() {
    const response = await fetch(`/api/game/${gameId}/stop-battle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    setGameState(data.newGameState);
    
  }

  async function startBattle() {
    const response = await fetch(`/api/game/${gameId}/start-battle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    setGameState(data.newGameState);
    
  }

  async function resetGame() {
    const response = await fetch(`/api/game/${gameId}/reset-game`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    setGameState(data.newGameState);
    
  }
  
  async function undo() {
    const response = await fetch(`/api/game/${gameId}/undo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    setGameState(data.newGameState);
  }

  async function redo() {
    const response = await fetch(`/api/game/${gameId}/redo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    setGameState(data.newGameState);
  }

  if (gameState === null || gameState === undefined) {
    return (<Loading />);
  } else {
    return (
    <div className="w-full min-h-screen bg-gray-50 p-6 w-full max-w-4xl mx-auto space-y-3">
      <div>
        <p className="text-right">ID: {gameId}</p>
        <div className="text-3xl font-bold text-center">Battle for Vancouver</div>
      </div>
      <Score redScore={gameState.redScore} blueScore={gameState.blueScore} />
      <Battle gameState={gameState} stopBattle={stopBattle} startBattle={startBattle} />
      <SetPageButton currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="bg-white rounded-2xl shadow-sm border p-4">
        {currentPage === "map"
          ? <MapPage gameState={gameState} onClaimRegion={claimRegion} onSetRegionLock={setRegionLock} />
          : <ChallengePage gameState={gameState} addChallenge={addChallenge} />
        }
      </div>
      <UndoRedo lastAction={gameState.lastAction} undo={undo} redo={redo} />
      <ResetGame resetGame={resetGame} />
    </div>
    );
  }
}

type SetPageButtonProps = {
  currentPage: string,
  setCurrentPage: (newPage: string) => void
}

function SetPageButton({currentPage, setCurrentPage}: SetPageButtonProps) {
  return (<div className="flex gap-4">
    <button 
      onClick={() => setCurrentPage("map")}
      className={`px-4 py-2 rounded-lg transition ${
        currentPage === "map" 
          ? "bg-blue-500 text-white"
          : "bg-gray-200 hover:bg-gray-300"
    }`
    }>Map</button>
    <button 
      onClick={() => setCurrentPage("challenges")}
      className={`px-4 py-2 rounded-lg transition ${
        currentPage === "challenges" 
          ? "bg-blue-500 text-white"
          : "bg-gray-200 hover:bg-gray-300"
    }`
    }>Challenges</button>
  </div>
  )
  
}

type ScoreProps = {
  redScore: number,
  blueScore: number
}

function Score({redScore, blueScore}: ScoreProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 flex justify-around text-2xl font-semibold">
        <span className="text-red-500">
          🔴 {redScore}
        </span> | <span className="text-blue-500">
          {blueScore} 🔵
        </span>
      </div>
  )
}

type UndoRedoProps = {
  lastAction: string,
  undo: () => void,
  redo: () => void,
}

function UndoRedo({lastAction, undo, redo}: UndoRedoProps) {
  return (
    <div className="flex flex-col bg-white rounded-xl border p-4 space-y-2 text-lg font-semibold">
      <div>
        Last action: {lastAction}
      </div>
      <div className="flex space-x-4">
        <button onClick={() => undo()} className="px-4 py-2 rounded-lg bg-blue-200 hover:bg-blue-300 transition">
          ⎌↶ Undo
        </button>
        <button onClick={() => redo()} className="px-4 py-2 rounded-lg bg-blue-200 hover:bg-blue-300 transition">
          Redo ↷
        </button>
      </div>
    </div>
  )
}

function Loading() {
  return (
    <div className="flex justify-center items-center p-4 size-full bg-blue-950 text-gray-300 text-5xl hover:text-white hover:bg-green-950">Loading...</div>
  )
}

type ResetGameProps = {
  resetGame: () => void
}
function ResetGame({resetGame}: ResetGameProps) {
  return (
    <button onClick={() => resetGame()} className="border border-0.5 text-sm bg-red-500 hover:bg-red-600 text-bold">Reset Game</button>
  )
}
