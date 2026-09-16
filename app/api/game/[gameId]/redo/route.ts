import {gameManager} from "@/server/GameManager";

export async function POST(request: Request, { params }: { params: Promise<{ gameId: string }> }) {
    const { gameId } = await params;
    try {        
        await gameManager.redo(gameId);
        return Response.json({
            success: true,
            newGameState: await gameManager.loadGameState(gameId)
        });
    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            newGameState: await gameManager.loadGameState(gameId),
            error: error,
        })
    }
}
