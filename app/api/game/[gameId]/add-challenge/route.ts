import {gameManager} from "@/server/GameManager";

export async function POST(request: Request, { params }: { params: Promise<{ gameId: string }> }) {
    const {completedChallenge} = await request.json();
    const { gameId } = await params;
    const response = await gameManager.addChallenge(gameId, completedChallenge);
    if (!response.success) {
        return Response.json(response, {status: 409});
    }
    return Response.json(response);
}