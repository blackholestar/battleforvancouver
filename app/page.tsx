"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
    const router = useRouter();
    const [gameId, setGameId] = useState("");

    async function createGame() {
        const response = await fetch("/api/game/create-game", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
        });
        const data = await response.json();
        router.push(`/game/${data}`);
  }

  async function loadGame(gameId: string) {
    router.push(`/game/${gameId}`);
  }

    return (
        <main>
            <h1>Battle for Vancouver</h1>

            <button className="border b-2 rounded-md bg-blue-200 hover:bg-blue-300 transition" onClick={() => createGame()}>
                Create Game
            </button>

            <div>
                <input 
                    type="text"
                    className="border b-2 rounded-md bg-gray-100"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    placeholder="Game Id"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            loadGame(gameId);
                        }
                    }}
                />
                <button onClick={() => loadGame(gameId)}>Load Game</button>
            </div>
        </main>
    );
}