import {gameManager} from "@/server/GameManager";

export async function POST(request: Request) {
    const {regionId, locked} = await request.json();
    gameManager.setRegionLock(regionId, locked);
    return Response.json({
        success: true,
        newGameState: gameManager.getGameState()
    });
}