/*----- constants -----*/
const COLORS = {
    '0': "transparent",
    '1': "black",
    '-1': "red",
}

/*----- state variables -----*/
let board
let turn
let winner
let currentPlayer
let opponent
let validMove
let initialRender

/*----- cached elements  -----*/
const boardPieces = [...document.querySelectorAll(`main > div`)]
const playAgainBtn = document.querySelector('button')
// display for player turn

/*----- event listeners -----*/
// click on baord
playAgainBtn.addEventListener('click', init)
/*----- functions -----*/
init()
function init() {
    board = [
        [1, 0, 1, 0, 0, 0, -1, 0], // bottom col
        [0, 1, 0, -1, 0, 0, 0, -1],
        [1, 0, 1, 0, -1, 0, -1, 0],
        [0, 1, 0, -1, 0, -1, 0, -1],
        [1, 0, 1, 0, 0, 0, -1, 0],
        [0, 1, 0, 0, 0, -1, 0, -1],
        [1, 0, 1, 0, 0, 0, -1, 0],
        [0, 1, 0, -1, 0, -1, 0, -1], // top col
    ]
    turn = 1
    winner = null
    initialRender = false
    render()
}

function render() {
    renderBoard()
    renderClickEvents()
    renderMessege()
}

function renderBoard() {
    // Select indivdual square in board array
    board.forEach((colArr, colIdx) => {
        colArr.forEach((elVal, rowIdx) => {

            // Select that div using its id
            const cellId = `c${colIdx}r${rowIdx}`
            const cellEl = boardPieces.find(el => el.id === cellId)

            // Return if value is 0 (empty space)
            if (elVal === 0) {
                cellEl.style.backgroundColor = COLORS[elVal]
                return
            }


            if (!initialRender) {
                // create and style checkers piece div
                let checkerPiece = document.createElement('div')
                checkerPiece.style.backgroundColor = COLORS[elVal]

                // append to that square
                cellEl.append(checkerPiece)
            }
        })
    })
    initialRender = true
}

function renderMessege() {
    console.log()
}

function renderClickEvents() {
    board.forEach((colArr, colIdx) => {
        colArr.forEach((elVal, rowIdx) => {
            if (elVal === turn) {
                const cellId = `c${colIdx}r${rowIdx}`
                // add event listners to the checker pieces
                const cellEl = document.querySelector(`#${cellId} > div`)
                const firstClick = initialClick(colIdx, rowIdx)
                cellEl.addEventListener('click', firstClick)
            }
        })
    })
}

function initialClick(colIdx, rowIdx) {
    const func = function(event) {
        event.stopPropagation()
        renderBoard()
        // event.target.removeEventListener('click', func)
        let moves = possibleMoves(colIdx, rowIdx)
        console.log(moves)
        showPossibleMoves(moves)
        // event.target.addEventListener('click', chooseMove)
    }
    return func
}

// function chooseMove(event) {
//     event.stopPropagation();
//     console.log("second click")
//     event.target.removeEventListener('click', chooseMove)

//     event.target.addEventListener('click', initialClick)
// }

function possibleMoves(colIdx, rowIdx) {
    currentPlayer = board[colIdx][rowIdx]
    opponent = findOpponent(currentPlayer)
    let moves, topLeft, topRight, bottomLeft, bottomRight  = {}
    
    if (currentPlayer === 1 || currentPlayer === 2 || currentPlayer === -2) {
      // Top left move
        validMove = true
        topLeft = checkTopLeft(colIdx, rowIdx)
      // Top right move
      validMove = true
        topRight = checkTopRight(colIdx, rowIdx)
    } else if (currentPlayer === -1 || currentPlayer === 2 || currentPlayer === -2) {
      // Bottom left move
        validMove = true
        bottomLeft = checkBottomLeft(colIdx, rowIdx)
      // Bottom right move
        validMove = true
        bottomRight = checkBottomRight(colIdx, rowIdx)
    }
  
    moves = [{...topLeft}, {...topRight}, {...bottomLeft}, {...bottomRight}]
    // trim empty objects from array of objects
    const filteredList = moves.filter((obj) => Object.keys(obj).length !== 0);
    return filteredList
  }

function checkTopLeft(colIdx, rowIdx) {
    let moves = {}
    const topLeftCol = colIdx - 1
    const topLeftRow = rowIdx + 1
    if (isValidPosition(topLeftCol, topLeftRow)) {
        let move = board[topLeftCol][topLeftRow]
        if (move === 0) {
            moves.leftMove = move
            moves.moveId = `c${topLeftCol}r${topLeftRow}`
            return moves
        } else if (opponent.includes(move) && validMove) {
            validMove = false
            moves = checkTopLeft(topLeftCol, topLeftRow)
        }
    }
    return moves
}

function checkTopRight(colIdx, rowIdx) {
    let moves = {}
    const topRightCol = colIdx + 1
    const topRightRow = rowIdx + 1
    if (isValidPosition(topRightCol, topRightRow)) {
        let move = board[topRightCol][topRightRow]
        if (move === 0) {
            moves.rightMove = move
            moves.moveId = `c${topRightCol}r${topRightRow}`
            return moves
        } else if (opponent.includes(move) && validMove) {
            validMove = false
            moves = checkTopRight(topRightCol, topRightRow)
        }
    }
    return moves
}

function checkBottomLeft(colIdx, rowIdx) {
    let moves = {}
    const bottomLeftCol = colIdx - 1
    const bottomLeftRow = rowIdx - 1
    if (isValidPosition(bottomLeftCol, bottomLeftRow)) {
        let move = board[topLeftCol][topLeftRow]
        if (move === 0) {
            moves.leftMove = move
            moves.moveId = `c${bottomLeftCol}r${bottomLeftRow}`
            return moves
        } else if (opponent.includes(move) && validMove) {
            validMove = false
            moves = checkBottomLeft(bottomLeftCol, bottomLeftRow)
        }
    }
    return moves
}

function checkBottomRight(colIdx, rowIdx) {
    let moves = {}
    const bottomRightCol = colIdx + 1
    const bottomRightRow = rowIdx - 1
    if (isValidPosition(bottomRightCol, bottomRightRow)) {
        let move = board[topLeftCol][topLeftRow]
        if (move === 0) {
            moves.rightMove = move
            moves.moveId = `c${bottomRightCol}r${bottomRightRow}`
            return moves
        } else if (opponent.includes(move) && validMove) {
            validMove = false
            moves = checkBottomRight(bottomRightCol, bottomRightRow)
        }
    }
    return moves
}

function isValidPosition(col, row) {
    return col >= 0 && col < board.length && row >= 0 && row < board[col].length
  }

function findOpponent(player) {
    opponent = []
    if (player > 0) {
        return opponent = [-1, -2]
    } else {
        return opponent = [1, 2]
    }
}

function showPossibleMoves(possibleMoves) {

    possibleMoves.forEach(moves => {
        const divId = moves["moveId"]
        console.log(divId)
        let availableMoveEl = boardPieces.find(el => el.id === divId)
        availableMoveEl.style.backgroundColor = "gray"
        availableMoveEl.addEventListener('click', finalGuess)
    })
}

function finalGuess() {
    
}
