import {gameManager} from "@/server/GameManager";

export async function POST() {
    gameManager.resetGame();
    return Response.json({
        success: true,
        newGameState: gameManager.getGameState()
    });
}