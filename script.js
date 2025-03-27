document.addEventListener("DOMContentLoaded", function () {
    let board = document.getElementById("board");
    let messageBox = document.getElementById("message");
    let selectedPiece = null;
    let selectedSquare = null;
    let isWhite = false;

    // Chess symbols (♔ ♕ ♖ ♗ ♘ ♙) & (♚ ♛ ♜ ♝ ♞ ♟)
    let puzzlePosition = {
        "e8": "♚", // Black King
        "h7": "♕", // White Queen
        "e6": "♔"  // White King
    };

    let squares = {};
    let correctMoves = ["h8", "e7"]; // Two checkmate moves

    function isValidMove(piece, from, to) {
        let fileFrom = from.charCodeAt(0);
        let rankFrom = parseInt(from[1]);
        let fileTo = to.charCodeAt(0);
        let rankTo = parseInt(to[1]);

        let fileDiff = Math.abs(fileTo - fileFrom);
        let rankDiff = Math.abs(rankTo - rankFrom);

        // Prevent kings from moving next to each other
        if (piece === "♔") {
            let blackKingPos = Object.keys(puzzlePosition).find(pos => puzzlePosition[pos] === "♚");
            if (blackKingPos) {
                let bkFile = blackKingPos.charCodeAt(0);
                let bkRank = parseInt(blackKingPos[1]);

                if (Math.abs(fileTo - bkFile) <= 1 && Math.abs(rankTo - bkRank) <= 1) {
                    return false; // White king cannot move next to the black king
                }
            }
        }

        switch (piece) {
            case "♔": // White King
            case "♚": // Black King
                return fileDiff <= 1 && rankDiff <= 1; // King moves 1 square in any direction

            case "♕": // White Queen
                return fileDiff === rankDiff || fileFrom === fileTo || rankFrom === rankTo; // Diagonal or straight

            default:
                return false;
        }
    }

    function displayMessage(msg, color) {
        messageBox.innerText = msg;
        messageBox.style.color = color;
    }

    for (let row = 8; row >= 1; row--) {
        for (let col = 0; col < 8; col++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add(isWhite ? "white" : "black");

            let file = String.fromCharCode(97 + col);
            let position = file + row;
            square.dataset.position = position;
            squares[position] = square;

            if (puzzlePosition[position]) {
                square.innerText = puzzlePosition[position];

                let isWhitePiece = "♔♕♖♗♘♙".includes(puzzlePosition[position]);
                square.classList.add(isWhitePiece ? "white-piece" : "black-piece");
            }

            square.addEventListener("click", function () {
                if (square.classList.contains("black-piece")) {
                    return; // Do nothing if clicking a black piece
                }

                if (!selectedPiece && square.innerText !== "") {
                    selectedPiece = square.innerText;
                    selectedSquare = square;
                    square.classList.add("highlight");
                } else if (selectedPiece) {
                    let fromPos = selectedSquare.dataset.position;
                    let toPos = square.dataset.position;

                    if (isValidMove(selectedPiece, fromPos, toPos) && square.innerText === "") {
                        square.innerText = selectedPiece;
                        square.classList.add(selectedSquare.classList.contains("white-piece") ? "white-piece" : "black-piece");
                        selectedSquare.innerText = "";
                        selectedSquare.classList.remove("white-piece", "black-piece", "highlight");

                        if (correctMoves.includes(toPos)) {
                            displayMessage("Checkmate! Well done! 🎉", "green");
                        } else {
                            displayMessage("Wrong move! Resetting puzzle...", "red");
                            setTimeout(() => location.reload(), 1000); // Reset after 1 sec
                        }
                    } else {
                        displayMessage("Invalid move! Resetting puzzle...", "red");
                        setTimeout(() => location.reload(), 1000); // Reset after 1 sec
                    }

                    selectedPiece = null;
                    selectedSquare = null;
                }
            });

            board.appendChild(square);
            isWhite = !isWhite;
        }
        isWhite = !isWhite;
    }

    document.getElementById("reset").addEventListener("click", function () {
        location.reload();
    });
});
