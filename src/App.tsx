// Варіант 2
import { useState } from "react";

type Player = "X" | "O";

interface SquareProps {
    value: Player;
    onSquareClick: () => void;
}
function Square({ value, onSquareClick }: SquareProps) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

interface BoardProps {
    xIsNext: boolean;
    squares: Player[];
    onPlay: (nextSquares: Player[]) => void;
}
function Board({ xIsNext, squares, onPlay }: BoardProps) {
    function handleClick(i: number) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    return (
        <>
            <div className="status">{status}</div>
            <div>
                {Array(3)
                    .fill(null)
                    .map((_rowValue, rowIndex) => (
                        <div className="board-row" key={rowIndex}>
                            {Array(3)
                                .fill(null)
                                .map((_colValue, colIndex) => {
                                    const index = rowIndex * 3 + colIndex;
                                    return (
                                        <Square
                                            key={index}
                                            value={squares[index]}
                                            onSquareClick={() =>
                                                handleClick(index)
                                            }
                                        />
                                    );
                                })}
                        </div>
                    ))}
            </div>
        </>
    );
}

export default function Game() {
    const [xIsNext, setXIsNext] = useState<boolean>(true);
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState<number>(0);
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares: Player[]) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        setXIsNext(!xIsNext);
    }

    function jumpTo(nextMove: number) {
        setCurrentMove(nextMove);
        setXIsNext(nextMove % 2 === 0);
    }

    const moves = history.map((_squares, move) => {
        let description;
        if (move > 0) {
            description = "Go to move #" + move;
        } else {
            description = "Go to game start";
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    xIsNext={xIsNext}
                    squares={currentSquares}
                    onPlay={handlePlay}
                />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares: Player[]) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return squares[a];
        }
    }
    return null;
}
