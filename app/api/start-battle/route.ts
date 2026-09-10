import {gameManager} from "@/server/GameManager";

export async function POST() {
    const response = gameManager.startBattle();
    if (!response.success) {
        return Response.json(response, {status: 409});
    }
    return Response.json(response);
}