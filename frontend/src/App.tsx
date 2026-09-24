import { useState } from "react"
import { winningPatterns } from "./data/pattern";

type Player = "X" | "O" | null;

const App = () => {

  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [isOver, setIsOver] = useState<boolean>(false);
  const [isDrawn, setIsDrawn] = useState<boolean>(false);
  const [winner, setWinner] = useState<"X" | "O" | null>(null);

  function handleMark(index: number){

    if(board[index] != null || isOver) return;
    console.log("Clicked -> turn is: ", turn, "and cell id is -> ", index);
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    for(const [a, b, c] of winningPatterns){
      if(newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]){
        setWinner(newBoard[a]);
        setIsOver(true);
        return;
      }
    }

    const hasEmptyCell:boolean = newBoard.includes(null);
    if(!hasEmptyCell) {
      setIsDrawn(true);
      return;
    }

    setTurn(turn === "X" ? "O" : "X");
  }
  
  function handleReset(){
    setIsOver(false);
    setTurn("X");
    setWinner(null);
    setIsDrawn(false);
    setBoard(Array(9).fill(null));
  }

  return (
    <>
    <div className='flex flex-col gap-5 items-center justify-center min-h-screen '>
      <div className='text-3xl font-bold font-serif text-olive-800'>ON MY CROSS</div>
      {isOver ? (<h1>{winner} WON THE GAME</h1>) : (null)}
      {isDrawn ? (<h1>GAME DRAWN</h1>):(null)}
      <div className='grid grid-cols-3'>
        {board.map((cell, index) => (
          <button key={index} 
                  className='hover:bg-gray-100 border-2 border-amber-300 h-24 w-24 font-bold text-black text-3xl text-center hover:cursor-pointer' 
                  onClick={() => {handleMark(index)}}>
            {cell}
          </button>
        ))}
      </div>
      {isOver || isDrawn ? (<button onClick={() => handleReset()} className="bg-gray-200 text-black border-2 border-gray-500 rounded-lg p-1 hover:cursor-pointer hover:bg-gray-100">RESET</button>) : (null)}
    </div>
    </>
  )
}

export default App