import {gameManager} from "@/server/GameManager";

export async function POST(request: Request) {
    const {completedChallenge} = await request.json();
    const response = gameManager.addChallenge(completedChallenge);
    if (!response.success) {
        return Response.json(response, {status: 409});
    }
    return Response.json(response);
}