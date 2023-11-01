import {useState} from 'react';

function Square({value , onSquareClick, highlight}){
  return (
    <button 
      className={`square ${highlight}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

export function Board({xIsNext, squares, onPlay, currentMove}) {
  const win = calculateWinner(squares) && calculateWinner(squares).mark;
  const highlight = calculateWinner(squares) && calculateWinner(squares).list ;
  let status;

  if(win){
    status = 'winner : ' + win;
  }
  else if(currentMove === 9){
    status = 'draw!!!!';
  } 
  else{
    status = 'turn : ' + (xIsNext ? 'x' : 'o');
  }

  function handleClick(i){
    if(squares[i] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();
    if(xIsNext){
      nextSquares[i] = 'x';  
    }
    else{
      nextSquares[i] = 'o';
    }

    onPlay(nextSquares);
  }

  
  let board = [];
  for(let i = 0; i < squares.length; i += 3){
    let row = (
      <div className='board-row' key={i}>
        {squares.slice(i,i+3).map((square,index) => {
          const id = index+i;
          let needHighlight = null;
          if(highlight){
            needHighlight = highlight.includes(id);
          }
          return <Square value={square} onSquareClick={() => handleClick(id)}  key={id}  highlight={needHighlight ? "highlight" : ""}/> ;
        })}
      </div>
    );
    board.push(row);
  }

  return (
    <>
      <div className='status'>{status}</div>
      {board}
    </>
  );
}

function MovesHistory({History, currentMove, jumpTo}){
  const [moveOrder, setMoveOrder] = useState(false);

  const moves = History.map((squares,move) => {
    let description;
    const row = Math.round(move / 3 + 0.5);
    const col = move % 3;
    
    if(move > 0){
      description = `Go to move # ${move} row=${row} col=${col}` ;
    }
    else{
      description = 'Go to game start';
    }
    
    if(move !== currentMove){
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
    else{
      return <div key={move}>{`you are at move ${move}`}</div>;
    }
  })

  if(moveOrder) moves.reverse();

  return(
    <ul>
      {moves}
      <li>
        <button onClick={() => setMoveOrder(!moveOrder)}>toggle</button>
      </li>
    </ul>
  );
}

export default function Game(){
  const [History, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = History[currentMove];

  function handlePlay(nextSquares){ 
    const nextHistory = [ ...History.slice(0,currentMove+1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(currentMove + 1);
  }

  function jumpTo(move){
    setCurrentMove(move);
  }

  return(
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares}  onPlay={handlePlay} currentMove={currentMove}/>
      </div>
      <div className="game-info">
        <MovesHistory History={History} currentMove={currentMove} jumpTo={jumpTo}/>
      </div>
    </div>
  );
  
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {mark : squares[a], list : [a,b,c]};
    }
  }
  return null;
}


