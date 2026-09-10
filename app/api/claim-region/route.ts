import {gameManager} from "@/server/GameManager";

export async function POST(request: Request) {
    const {regionId, newStatus} = await request.json();
    const response = gameManager.claimRegion(regionId, newStatus);
    //console.log("server state:", gameManager.getGameState());
    if (!response.success) {
        return Response.json(response, {status: 409});
    }
    return Response.json(response);
}