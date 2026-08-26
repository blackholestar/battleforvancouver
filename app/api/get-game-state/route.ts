import {gameManager} from "@/server/GameManager";
export async function GET() {
    let newGameState = gameManager.getGameState();
    return Response.json({
        newGameState: newGameState
    });
}
