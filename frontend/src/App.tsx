import { useEffect, useState } from "react";
import { io } from "socket.io-client";

type Player = "X" | "O" | null;

type Game = {
  id: string;
  board: Player[];
  players: {
    X: string | null;
    O: string | null;
  };
  turn: "X" | "O";
  status: "WAITING" | "PLAYING" | "WON" | "DRAW";
  winner: "X" | "O" | null;
};

const socket = io("https://both-booking-neighbors-wildlife.trycloudflare.com");

const App = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [gameId, setGameId] = useState("");

  useEffect(() => {
    socket.on("gameState", (game: Game) => {
      setGame(game);
    });

    return () => {
      socket.off("gameState");
    };
  }, []);

  function createGame() {
    socket.emit("createGame", gameId);
  }

  function joinGame() {
    socket.emit("joinGame", gameId);
  }

  function handleMark(index: number) {
    if (!game || game.status !== "PLAYING") return;

    socket.emit("makeMove", {
      gameId: game.id,
      index,
    });
  }

  function handleReset() {
    if (!game) return;

    socket.emit("resetGame", game.id);
  }

  return (
    <div className="flex flex-col gap-5 items-center justify-center min-h-screen">

      <h1 className="text-3xl font-bold">
        ON MY CROSS
      </h1>

      {!game && (
        <div className="flex gap-2">
          <input
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            placeholder="Game ID"
            className="border p-2"
          />

          <button
            onClick={createGame}
            className="border p-2"
          >
            Create
          </button>

          <button
            onClick={joinGame}
            className="border p-2"
          >
            Join
          </button>
        </div>
      )}

      {game && (
        <>
          {game.status === "WAITING" && (
            <h2>Waiting for another player...</h2>
          )}

          {game.status === "PLAYING" && (
            <h2>Turn: {game.turn}</h2>
          )}

          {game.status === "WON" && (
            <h2>{game.winner} WON THE GAME</h2>
          )}

          {game.status === "DRAW" && (
            <h2>GAME DRAWN</h2>
          )}

          <div className="grid grid-cols-3">
            {game.board.map((cell, index) => (
              <button
                key={index}
                disabled={game.status !== "PLAYING" || cell !== null}
                className="border-2 border-amber-300 h-24 w-24 font-bold text-black text-3xl"
                onClick={() => handleMark(index)}
              >
                {cell}
              </button>
            ))}
          </div>

          {(game.status === "WON" || game.status === "DRAW") && (
            <button
              onClick={handleReset}
              className="border-2 border-gray-500 rounded-lg p-2"
            >
              RESET
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default App;