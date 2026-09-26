import type { Game, Player } from "./game.js";

const winningPatterns:[number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const games = new Map<string, Game>();

export function createGame(gameId: string, socketId: string): Game{
    const firstPlayer:Player = Math.random() < 0.5 ? "X" : "O";
    
    const game: Game= {
        id: gameId,
        board: Array(9).fill(null),
        players:{
            X: firstPlayer == "X" ? socketId: null,
            O: firstPlayer == "O" ? socketId: null
        },

        status: "WAITING",
        turn: firstPlayer,
        winner:null
    }

    games.set(gameId, game)
    return game;
}

export function getGame(gameId: string): Game|undefined{
    return games.get(gameId);
}

export function joinGame(gameId: string, socketId: string): Game | null {

  const game = games.get(gameId);

  console.log("JOIN REQUEST:", {
    gameId,
    socketId,
    game
  });

  if (!game) {
    console.log("GAME NOT FOUND");
    return null;
  }

  if (game.players.X && game.players.O) {
    console.log("GAME FULL:", game.players);
    return null;
  }

  if (!game.players.X) {
    game.players.X = socketId;
  } else if (!game.players.O) {
    game.players.O = socketId;
  }

  if (game.players.X && game.players.O) {
    game.status = "PLAYING";
  }

  console.log("UPDATED GAME:", game);

  return game;
}

export function makeMove(gameId: string, socketId: string, index: number): Game | null{
    const game = games.get(gameId)
    if(!game || game.status !== "PLAYING") return null;

    let player: Player | null = null;
    if(game.players.X === socketId)
        player = "X";
    else if(game.players.O === socketId)
        player = "O";

    if(!player || game.turn !== player || game.board[index] !== null) return null;
    game.board[index] = player;

        // Check winner
    for (const [a, b, c] of winningPatterns) {
        if (
        game.board[a] &&
        game.board[a] === game.board[b] &&
        game.board[a] === game.board[c]
        ) {
        game.status = "WON";
        game.winner = player;
        return game;
        }
    }

    // Check draw
    if (!game.board.includes(null)) {
        game.status = "DRAW";
        return game;
    }

    game.turn = player === "X" ? "O" : "X"; 

    return game;
}

export function resetGame(gameId: string): Game | null {
  const game = games.get(gameId);

  if (!game) return null;

  game.board = Array(9).fill(null);
  game.status = "PLAYING";
  game.winner = null;
  game.turn = Math.random() < 0.5 ? "X" : "O";

  return game;
}