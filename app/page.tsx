"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();
    
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

    return (
        <main>
            <h1>Battle for Vancouver</h1>

            <button onClick={() => createGame()}>
                Create Game
            </button>
        </main>
    );
}