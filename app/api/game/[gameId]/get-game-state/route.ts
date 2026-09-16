import {gameManager} from "@/server/GameManager";
export async function GET(request: Request, { params }: { params: Promise<{ gameId: string }> }) {
    try {
        const { gameId } = await params;
        let newGameState = await gameManager.loadGameState(gameId);
        //console.log("newGameState:", newGameState);
        //console.log("typeof:", typeof newGameState);
        return Response.json({
            newGameState: newGameState
        });
    } catch (error) {
        console.log(error);
        return Response.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
