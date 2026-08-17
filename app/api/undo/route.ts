import {gameManager} from "@/server/GameManager";

export async function POST() {
    gameManager.undo();
    return Response.json({
        success: true,
        newGameState: gameManager.getGameState()
    });
}