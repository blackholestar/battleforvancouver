"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

import type {Region, Challenge, GameState} from '../shared/types';


import {MapPage} from '../components/Map';
import {ChallengePage} from '../components/ChallengeGrid';
import {Battle} from '../components/Battle';

export default function Master() {
  return <Page />;
}

function Page() {
  

  const [gameState, setGameState] = useState<GameState|null>(null);
  // what page is currently displayed (map, challenges, rules (future))
  const [currentPage, setCurrentPage] = useState<string>("map"); 

  // get gamestate initially
  useEffect(() => {
    fetch("/api/get-game-state")
      .then(response => response.json())
      .then(data => {
        setGameState(data.newGameState);
      });
  },[]);
  // get gamestate every x seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch("/api/get-game-state");
      const data = await response.json();

      setGameState(data.newGameState);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function claimRegion(regionId: number, newStatus: string) {
    const response = await fetch("/api/claim-region", {
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
    const response = await fetch("/api/set-region-lock", {
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
    const response = await fetch("/api/add-challenge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        completedChallenge
      })
    });
    const data = await response.json();

    console.log(data);
    setGameState(data.newGameState);
    
  }

  async function setBattleStatus(battleStatus: boolean) {
    const response = await fetch("/api/set-battle-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        battleStatus
      })
    });
    const data = await response.json();
    setGameState(data.newGameState);
    
  }

  async function replaceBattle() {
    const response = await fetch("/api/replace-battle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    setGameState(data.newGameState);
    
  }

  async function resetGame() {
    const response = await fetch("/api/reset-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    setGameState(data.newGameState);
    
  }
  
  async function undo() {
    const response = await fetch("/api/undo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    setGameState(data.newGameState);
  }

  async function redo() {
    const response = await fetch("/api/redo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    setGameState(data.newGameState);
  }

  if (gameState === null) {
    return (<Loading />);
  } else {
    return (
    <div className="w-full min-h-screen bg-gray-50 p-6 w-full max-w-4xl mx-auto space-y-3">
      <div className="text-3xl font-bold text-center">Battle for Vancouver</div>
      <Score redScore={gameState.redScore} blueScore={gameState.blueScore} />
      <Battle gameState={gameState} setBattleStatus={setBattleStatus} replaceBattle={replaceBattle} />
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



function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
