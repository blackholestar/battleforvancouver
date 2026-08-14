import {gameManager} from "@/server/GameManager";
export async function GET() {
    return Response.json({
        newGameState: gameManager.getGameState()
    });
}
