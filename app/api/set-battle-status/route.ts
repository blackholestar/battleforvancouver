import {gameManager} from "@/server/GameManager";

export async function POST(request: Request) {
    const {battleStatus} = await request.json();
    gameManager.setBattleStatus(battleStatus);
    return Response.json({
        success: true,
        newGameState: gameManager.getGameState()
    });
}