export type Player = "X" | "O";
export type GameStatus = "WAITING" | "PLAYING" | "WON" | "DRAW";

export type Game = {
    id: string,
    board: (Player | null)[],
    
    players: {
        X: string | null,
        O: string | null
    }

    status: GameStatus,
    turn: Player,
    winner: Player | null
}