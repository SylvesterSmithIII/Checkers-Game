/*----- constants -----*/
const COLORS = {
    '0': "transparent",
    '1': "black",
    '-1': "red",
    '2': "grey",
    '-2': "darkred"
}
/*----- state variables -----*/
let board
let turn
let winner
let currentPlayer
let opponent
let validMove
let initialRender
let currentCol
let currentRow

/*----- cached elements  -----*/
const boardPieces = [...document.querySelectorAll(`main > div`)]
const playAgainBtn = document.querySelector('button')
const messegeEl = document.querySelector('h3')
// display for player turn

/*----- event listeners -----*/
// click on baord
playAgainBtn.addEventListener('click', init)
/*----- functions -----*/
initialRender = false
init()

function init() {
    board = [
        [1, 0, 1, 0, 0, 0, -1, 0], // bottom col
        [0, 1, 0, 0, 0, -1, 0, -1],
        [1, 0, 1, 0, 0, 0, -1, 0],
        [0, 1, 0, 0, 0, -1, 0, -1],
        [1, 0, 1, 0, 0, 0, -1, 0],
        [0, 1, 0, 0, 0, -1, 0, -1],
        [1, 0, 1, 0, 0, 0, -1, 0],
        [0, 1, 0, 0, 0, -1, 0, -1], // top col
    ]
    turn = 1
    winner = null
    render()
}

function render() {
    checkForKing()
    renderBoard()
    removeAllEventListners()
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

            // Reset background to transparent
            cellEl.style.backgroundColor = COLORS[0]

            // create the game pieces once!
            if (!initialRender) {
                // create and style checkers piece div
                let checkerPiece = document.createElement('div')
                checkerPiece.style.backgroundColor = COLORS[elVal]

                // append to that square
                cellEl.append(checkerPiece)
            }

            // update the game pieces current collor to match board array
            cellEl.childNodes[0].style.backgroundColor = COLORS[elVal]
        })
    })
    initialRender = true
}

function renderMessege() {
    messegeEl.innerHTML = `${COLORS[turn]}'S TURN`
}

function renderClickEvents() {
    board.forEach((colArr, colIdx) => {
        colArr.forEach((elVal, rowIdx) => {
            if (elVal === turn || elVal === (turn * 2)) {
                const cellId = `c${colIdx}r${rowIdx}`
                // add event listners to the checker pieces
                const cellEl = document.querySelector(`#${cellId} > div`)
                cellEl.addEventListener('click', initialClick)
            }
        })
    })
}

function initialClick(event) {

    event.stopPropagation()

    parentEl = event.target.parentNode

    currentCol = parseInt(parentEl.id.slice(1, 2))
    currentRow = parseInt(parentEl.id.slice(3, 4))

    renderBoard()

    let moves = possibleMoves(currentCol, currentRow)
    showPossibleMoves(moves)
}

function possibleMoves(colIdx, rowIdx) {
    currentPlayer = board[colIdx][rowIdx]
    opponent = findOpponent(currentPlayer)
    let moves = []
    let topLeft = {}, topRight = {}, bottomLeft = {}, bottomRight  = {}
    
    if (currentPlayer === 1 || currentPlayer === 2 || currentPlayer === -2) {
      // Top left move
        validMove = true
        topLeft = checkTopLeft(colIdx, rowIdx)
      // Top right move
        validMove = true
        topRight = checkTopRight(colIdx, rowIdx)
    }
     if (currentPlayer === -1 || currentPlayer === 2 || currentPlayer === -2) {
      // Bottom left move
        validMove = true
        bottomLeft = checkBottomLeft(colIdx, rowIdx)
      // Bottom right move
        validMove = true
        bottomRight = checkBottomRight(colIdx, rowIdx)
    }
  
    moves = moves.concat(topLeft, topRight, bottomLeft, bottomRight)
    // trim empty objects from array of objects
    moves = moves.flat(2)
    console.log(moves)
    let filteredList = moves.filter((obj) => Object.keys(obj).length !== 0);
    return filteredList
  }

function checkTopLeft(colIdx, rowIdx) {
    let moves = [{}]
    const topLeftCol = colIdx - 1
    const topLeftRow = rowIdx + 1
    if (isValidPosition(topLeftCol, topLeftRow)) {
        let move = board[topLeftCol][topLeftRow]
        if (move === 0) {
            moves[0].leftMove = move
            moves[0].moveId = `c${topLeftCol}r${topLeftRow}`
            if (!validMove) {
                let otherMoves = possibleMoves(topLeftCol, topLeftRow)
                moves.append([...moves, otherMoves])
            }
            return moves
        } else if (opponent.includes(move) && validMove) {
            validMove = false
            moves[0] = checkTopLeft(topLeftCol, topLeftRow)
        }
    }
    return moves
}

function checkTopRight(colIdx, rowIdx) {
    let moves = [{}]
    const topRightCol = colIdx + 1
    const topRightRow = rowIdx + 1
    if (isValidPosition(topRightCol, topRightRow)) {
        let move = board[topRightCol][topRightRow]
        if (move === 0) {
            moves[0].rightMove = move
            moves[0].moveId = `c${topRightCol}r${topRightRow}`
            if (!validMove) {
                let otherMoves = possibleMoves(topRightCol, topRightRow)
                moves.append([...moves, ...otherMoves])
            }
            return moves
        } else if (opponent.includes(move) && validMove) {
            validMove = false
            moves[0] = checkTopRight(topRightCol, topRightRow)
        }
    }
    return moves
}

function checkBottomLeft(colIdx, rowIdx) {
    let moves = [{}]
    const bottomLeftCol = colIdx - 1
    const bottomLeftRow = rowIdx - 1
    if (isValidPosition(bottomLeftCol, bottomLeftRow)) {
        let move = board[bottomLeftCol][bottomLeftRow]
        if (move === 0) {
            moves[0].leftMove = move
            moves[0].moveId = `c${bottomLeftCol}r${bottomLeftRow}`
            if (!validMove) {
                let otherMoves = possibleMoves(bottomLeftCol, bottomLeftRow)
                moves = [...moves, ...otherMoves]
            }
            return moves
        } else if (opponent.includes(move) && validMove) {
            validMove = false
            moves[0] = checkBottomLeft(bottomLeftCol, bottomLeftRow)
        }
    }
    return moves
}

function checkBottomRight(colIdx, rowIdx) {
    let moves = [{}]
    const bottomRightCol = colIdx + 1
    const bottomRightRow = rowIdx - 1
    if (isValidPosition(bottomRightCol, bottomRightRow)) {
        let move = board[bottomRightCol][bottomRightRow]
        if (move === 0) {
            moves[0].rightMove = move
            moves[0].moveId = `c${bottomRightCol}r${bottomRightRow}`
            if (!validMove) {
                let otherMoves = possibleMoves(bottomRightCol, bottomRightRow)
                moves = [...moves, ...otherMoves]
            }
            return moves
        } else if (opponent.includes(move) && validMove) {
            validMove = false
            moves[0] = checkBottomRight(bottomRightCol, bottomRightRow)
        }
    }
    return moves
}

function isValidPosition(col, row) {
    return col >= 0 && col < board.length && row >= 0 && row < board.length
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
    removeFinalGuess()
    possibleMoves.forEach(moves => {
        let divId = moves["moveId"]
        // console.log(divId)
        if (divId != undefined) {
            let availableMoveEl = boardPieces.find(el => el.id === divId)
            availableMoveEl.style.backgroundColor = "gray"
            availableMoveEl.addEventListener('click', finalGuess)
            availableMoveEl.childNodes[0].addEventListener('click', finalGuess)
        }
    })
}

function finalGuess(event) {
    event.stopPropagation()
    if (event.target.id === "") {
        event.target.parentNode.click()
        return
    }
    let pieceVal = board[currentCol][currentRow]
    let el = event.target

    let finalCol = parseInt(el.id.slice(1, 2))
    let finalRow = parseInt(el.id.slice(3, 4))

    console.log(pieceVal)

    board[currentCol][currentRow] = 0
    board[finalCol][finalRow] = pieceVal


    turn *= -1
    removeAllEventListners()
    render()

}

function removeFinalGuess() {
    boardPieces.forEach(el => {
        el.removeEventListener('click', finalGuess)
    })
}

function removeAllEventListners() {
    boardPieces.forEach(el => {
        el.removeEventListener('click', finalGuess)
        el.childNodes[0].removeEventListener('click', initialClick)
    })
}

function checkForKing() {
    board.forEach((colArr, colIdx) => {
        colArr.forEach((elVal, rowIdx) => {
            if (elVal === 1 && rowIdx === 7) {
                board[colIdx][rowIdx] = 2
            } 
            if (elVal === -1 && rowIdx === 0) {
                board[colIdx][rowIdx] = -2
            }
        })
    })
}

function checkWinnerByElimination() {
    if (board.every(row => row.every(piece => piece === 1 || piece === 2))) winner = 1
    if (board.every(row => row.every(piece => piece === -1 || piece === -2))) winner = -1
}