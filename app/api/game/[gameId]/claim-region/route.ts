import {gameManager} from "@/server/GameManager";

export async function POST(request: Request, { params }: { params: Promise<{ gameId: string }> }) {
    const {regionId, newStatus} = await request.json();
    const { gameId } = await params;
    const response = await gameManager.claimRegion(gameId, regionId, newStatus);
    //console.log("server state:", gameManager.getGameState());
    if (!response.success) {
        return Response.json(response, {status: 409});
    }
    return Response.json(response);
}