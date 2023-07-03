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

/*----- cached elements  -----*/
// divs in board
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
    renderBoard()
    renderMessege()
}

function renderBoard() {
    // Select indivdual square in board array
    board.forEach((colArr, colIdx) => {
        colArr.forEach((elVal, rowIdx) => {

            // Return if value is 0 (empty space)
            if (elVal === 0) return

            // Select that div using its id
            const cellId = `c${colIdx}r${rowIdx}`
            const cellEl = document.getElementById(cellId)

            // create and style checkers piece div
            let checkerPiece = document.createElement('div')
            checkerPiece.style.backgroundColor = COLORS[elVal]

            // append to that square
            cellEl.append(checkerPiece)
        })
    })
}

function renderMessege() {
    console.log()
}

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

function initialClick(colIdx, rowIdx) {
    const func = function(event) {
        event.stopPropagation()
        event.target.removeEventListener('click', func)
        let moves = possibleMoves(colIdx, rowIdx)
        console.log(moves)
        event.target.addEventListener('click', chooseMove)
    }
    return func
}

function chooseMove(event) {
    event.stopPropagation();
    console.log("second click")
    event.target.removeEventListener('click', chooseMove)

    event.target.addEventListener('click', initialClick)
}

function possibleMoves(colIdx, rowIdx) {
    const currentPlayer = board[colIdx][rowIdx]
    const moves = {}
  
    if (currentPlayer === 1) {
      // Top left move
      const topLeftCol = colIdx - 1
      const topLeftRow = rowIdx + 1
      if (isValidPosition(topLeftCol, topLeftRow)) {
        moves.leftMove = board[topLeftCol][topLeftRow]
      }
  
      // Top right move
      const topRightCol = colIdx + 1
      const topRightRow = rowIdx + 1
      if (isValidPosition(topRightCol, topRightRow)) {
        moves.rightMove = board[topRightCol][topRightRow]
      }
    } else if (currentPlayer === -1) {
      // Bottom left move
      const bottomLeftCol = colIdx - 1
      const bottomLeftRow = rowIdx - 1
      if (isValidPosition(bottomLeftCol, bottomLeftRow)) {
        moves.leftMove = board[bottomLeftCol][bottomLeftRow]
      }
  
      // Bottom right move
      const bottomRightCol = colIdx + 1
      const bottomRightRow = rowIdx - 1
      if (isValidPosition(bottomRightCol, bottomRightRow)) {
        moves.rightMove = board[bottomRightCol][bottomRightRow]
      }
    }
  
    return moves;
  }

function isValidPosition(col, row) {
    return col >= 0 && col < board.length && row >= 0 && row < board[col].length
  }