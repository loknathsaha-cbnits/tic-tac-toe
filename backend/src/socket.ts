import { Socket, type Server } from "socket.io";
import { createGame, getGame, joinGame, makeMove, resetGame } from "./gameManager.js";


export function registerSocketHandlers(io: Server){
    io.on("connection", (socket:Socket)=>{
        console.log("Player connected: ", socket.id);

        socket.on("createGame", (gameId: string)=>{
            const game = createGame(gameId, socket.id);
            socket.join(gameId);
            socket.emit("gameState", game);
        });

        socket.on("joinGame", (gameId: string) => {
            const game = joinGame(gameId, socket.id);

            if (!game) {
                socket.emit("error", "Unable to join game");
                return;
            }

            socket.join(gameId);

            io.to(gameId).emit("gameState", game);
        });


        socket.on("makeMove", ({ gameId, index }: { gameId: string; index: number }) => {

        const game = makeMove(gameId, socket.id, index);

        if (!game) {
          socket.emit("error", "Invalid move");
          return;
        }

        io.to(gameId).emit("gameState", game);
      }
    );

    socket.on("resetGame", (gameId: string) => {
      const game = resetGame(gameId);

      if (!game) return;

      io.to(gameId).emit("gameState", game);
    });

    socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);
    });
    });
}