import {gameManager} from "@/server/GameManager";

export async function POST(request: Request) {
    const {completedChallenge} = await request.json();
    gameManager.addChallenge(completedChallenge);
    return Response.json({
        success: true,
        newGameState: gameManager.getGameState()
    });
}