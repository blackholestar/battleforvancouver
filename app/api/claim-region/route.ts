import {gameManager} from "@/server/GameManager";

export async function POST(request: Request) {
    const {regionId, newStatus} = await request.json();
    gameManager.claimRegion(regionId, newStatus);
    //console.log("server state:", gameManager.getGameState());
    return Response.json({
        success: true,
        newGameState: gameManager.getGameState()
    });
}