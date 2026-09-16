import {gameManager} from "@/server/GameManager";

export async function POST(request: Request) {
    const response = await gameManager.createGame();
    if (response === -1) {
        return Response.json(response, {status: 409});
    }
    return Response.json(response);
}