/*----- constants -----*/
const COLORS = {
    '0': "transparent",
    '1': "static/black-piece.png",
    '-1': "static/red-piece.png",
    '2': "static/black-king.png",
    '-2': "static/red-king.png"
}

const PLAYERS = {
    '1': "black",
    '-1': "red"
}

/*----- state variables -----*/
let board
let turn
let winner
let currentPlayer
let opponent
let visited
let initialRender
let currentCol
let currentRow
let OPTIONS

/*----- cached elements  -----*/
const boardPieces = [...document.querySelectorAll(`main > div`)]
const playAgainBtn = document.querySelector('button')
const messegeEl = document.querySelector('h3')

/*----- event listeners -----*/
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
    checkWinnerByElimination()
    checkWinnerCornering()
    renderBoard()
    removeAllEventListners()
    renderClickEvents()
    renderMessege()
    displayBtn()
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
                if (elVal === 0) {
                    checkerPiece.style.backgroundColor = COLORS[elVal]
                } else {
                    checkerPiece.style.backgroundImage = `url(${COLORS[elVal]})`
                }

                // append to that square
                cellEl.append(checkerPiece)
            }
            if ((colIdx + rowIdx) % 2 === 0) {
                cellEl.style.backgroundColor = "rgb(69, 54, 48)"
                cellEl.classList.remove('choice')
            } else {
                cellEl.style.backgroundColor = "rgb(155, 126, 75)"
            }
            // update the game pieces current collor to match board array
            if (elVal === 0) {
                cellEl.childNodes[0].style.backgroundColor = COLORS[elVal]
                // when clicked play again btn
                cellEl.childNodes[0].style.backgroundImage = `none`
            } else {
                cellEl.childNodes[0].style.backgroundImage = `url(${COLORS[elVal]})`
            }
        })
    })
    initialRender = true
}

function renderMessege() {
    if (winner !== null) {
        messegeEl.innerHTML = `<a style="color: ${PLAYERS[winner]}">${PLAYERS[winner]}</a> PLAYER WINS`
        return
    }
    messegeEl.innerHTML = `<a style="color: ${PLAYERS[turn]}">${PLAYERS[turn]}</a> PLAYER'S TURN`
}

function displayBtn() {
    if (winner === null) {
        playAgainBtn.style.display = "none"
    } else {
        playAgainBtn.style.display = "block"
    }
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

    currentPlayer = board[currentCol][currentRow]
    visited = {}

    let moves = possibleMoves(false, currentCol, currentRow)

    showPossibleMoves(moves)
}

function possibleMoves(bool, colIdx, rowIdx) {
    opponent = findOpponent(currentPlayer)
    let moves = []
    let topLeft = {}, topRight = {}, bottomLeft = {}, bottomRight  = {}
    let validMove
    
    if (currentPlayer === 1 || currentPlayer === 2 || currentPlayer === -2) {
      // Top left move
        validMove = true
        topLeft = checkTopLeft(validMove, bool, colIdx, rowIdx)
      // Top right move
        validMove = true
        topRight = checkTopRight(validMove, bool, colIdx, rowIdx)
    }
     if (currentPlayer === -1 || currentPlayer === 2 || currentPlayer === -2) {
      // Bottom left move
        validMove = true
        bottomLeft = checkBottomLeft(validMove, bool, colIdx, rowIdx)
      // Bottom right move
        validMove = true
        bottomRight = checkBottomRight(validMove, bool, colIdx, rowIdx)
    }
  
    moves = moves.concat(topLeft, topRight, bottomLeft, bottomRight)
    // trim empty objects from array of objects
    moves = moves.flat(2)
    
    let filteredList = moves.filter((obj) => Object.keys(obj).length !== 0)
    // console.log(filteredList)
    return filteredList
  }

function checkTopLeft(validMove, bool, colIdx, rowIdx) {

    let moves = [{}]
    const topLeftCol = colIdx - 1
    const topLeftRow = rowIdx + 1

    if (isValidPosition(topLeftCol, topLeftRow)) {

        let move = board[topLeftCol][topLeftRow]

        if (!visited[topLeftCol] || !visited[topLeftCol][topLeftRow]) {
            visited[topLeftCol] = visited[topLeftCol] || {}
            visited[topLeftCol][topLeftRow] = true

            if (move === 0) {

                if (bool && validMove) return moves
                
                moves[0].leftMove = move
                moves[0].moveId = `c${topLeftCol}r${topLeftRow}`
                moves[0].startPosition = `c${colIdx}r${rowIdx}`
                moves[0].positionBefore = `c${colIdx + 1}r${rowIdx - 1}`

                if (!validMove) {

                    let otherMoves = possibleMoves(true, topLeftCol, topLeftRow)
                    moves.push(...otherMoves)

                }
            } else if (opponent.includes(move) && validMove) {

                validMove = false
                let recursiveCheck = checkTopLeft(validMove, false, topLeftCol, topLeftRow)
                moves.push(...recursiveCheck)

            }
        }
    }
    return moves
}

function checkTopRight(validMove, bool, colIdx, rowIdx) {

    let moves = [{}]
    const topRightCol = colIdx + 1
    const topRightRow = rowIdx + 1

    // check if move is within board boarders
    if (isValidPosition(topRightCol, topRightRow)) {

        let move = board[topRightCol][topRightRow]

        // check if move has already been checked
        if (!visited[topRightCol] || !visited[topRightCol][topRightRow]) {
            // if not updated visited squares
            visited[topRightCol] = visited[topRightCol] || {}
            visited[topRightCol][topRightRow] = true

            // if space is a 0
            if (move === 0) {
                
                // check if second time in possiveMoves function
                //  if so return
                if (bool && validMove) return moves
                // update obj with info
                moves[0].rightMove = move
                moves[0].moveId = `c${topRightCol}r${topRightRow}`
                moves[0].startPosition = `c${colIdx}r${rowIdx}`
                moves[0].positionBefore = `c${colIdx - 1}r${rowIdx - 1}`
                // if second time in check... function go thru 
                // the entire possibleMoves function
                if (!validMove) {
                    // if passed enemy piece and found empty space. run again
                    let otherMoves = possibleMoves(true, topRightCol, topRightRow)
                    // push any moves made
                    moves.push(...otherMoves)
                    // validMove = false
                }
                // if next piece is an enemy piece and move is valid
            } else if (opponent.includes(move) && validMove) {
                // update validMove variable so next iteration will stop
                // if another enemy piece
                validMove = false
                // check next position
                let recursiveCheck = checkTopRight(validMove, false, topRightCol, topRightRow)
                // add to moves array
                moves.push(...recursiveCheck)
            }
        }
    }
    return moves
}

function checkBottomLeft(validMove, bool, colIdx, rowIdx) {

    let moves = [{}]
    const bottomLeftCol = colIdx - 1
    const bottomLeftRow = rowIdx - 1

    if (isValidPosition(bottomLeftCol, bottomLeftRow)) {
        let move = board[bottomLeftCol][bottomLeftRow]

        if (!visited[bottomLeftCol] || !visited[bottomLeftCol][bottomLeftRow]) {
            visited[bottomLeftCol] = visited[bottomLeftCol] || {}
            visited[bottomLeftCol][bottomLeftRow] = true

            if (move === 0) {

                if (bool && validMove) return moves

                moves[0].leftMove = move
                moves[0].moveId = `c${bottomLeftCol}r${bottomLeftRow}`
                moves[0].startPosition = `c${colIdx}r${rowIdx}`
                moves[0].positionBefore = `c${colIdx + 1}r${rowIdx + 1}`

                if (!validMove) {

                    let otherMoves = possibleMoves(true, bottomLeftCol, bottomLeftRow)
                    moves.push(...otherMoves)
                    
                }
            } else if (opponent.includes(move) && validMove) {

                validMove = false
                let recursiveCheck = checkBottomLeft(validMove, false, bottomLeftCol, bottomLeftRow)
                moves.push(...recursiveCheck)
            }
        }
    }
    return moves
}

function checkBottomRight(validMove, bool, colIdx, rowIdx) {

    let moves = [{}]
    const bottomRightCol = colIdx + 1
    const bottomRightRow = rowIdx - 1

    if (isValidPosition(bottomRightCol, bottomRightRow)) {
        let move = board[bottomRightCol][bottomRightRow]
        if (!visited[bottomRightCol] || !visited[bottomRightCol][bottomRightRow]) {
            visited[bottomRightCol] = visited[bottomRightCol] || {}
            visited[bottomRightCol][bottomRightRow] = true

            if (move === 0) {

                if (bool && validMove) return moves

                moves[0].rightMove = move
                moves[0].moveId = `c${bottomRightCol}r${bottomRightRow}`
                moves[0].startPosition = `c${colIdx}r${rowIdx}`
                moves[0].positionBefore = `c${colIdx - 1}r${rowIdx + 1}`

                if (!validMove) {

                    let otherMoves = possibleMoves(true, bottomRightCol, bottomRightRow)
                    moves.push(...otherMoves)

                }
            } else if (opponent.includes(move) && validMove) {

                validMove = false
                let recursiveCheck = checkBottomRight(validMove, false, bottomRightCol, bottomRightRow)
                moves.push(...recursiveCheck)
            }
        }
    }
    return moves
}

function isValidPosition(col, row) {
    return col >= 0 && col < board.length && row >= 0 && row < board.length;
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
    OPTIONS = possibleMoves
    possibleMoves.forEach(moves => {
        let divId = moves["moveId"]
        // console.log(divId)
        if (divId != undefined) {
            let availableMoveEl = boardPieces.find(el => el.id === divId)
            availableMoveEl.setAttribute('class', 'choice')
            availableMoveEl.addEventListener('click', finalGuess)
            availableMoveEl.childNodes[0].addEventListener('click', event => finalGuess(event))
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

    // console.log(pieceVal)
    let piecesToRemove = findPiecesToRemove(finalCol, finalRow)
    // console.log(piecesToRemove)
    board[currentCol][currentRow] = 0
    let parentEl = boardPieces.find(div => div.id === `c${currentCol}r${currentRow}`)
    parentEl.childNodes[0].style.backgroundImage = "none"
    board[finalCol][finalRow] = pieceVal


    turn *= -1

    removeJumpedPieces(piecesToRemove)
    removeAllEventListners()
    render()

}
// remove the current final guess listners
function removeFinalGuess() {
    boardPieces.forEach(el => {
        el.removeEventListener('click', finalGuess)
    })
}

// remove every single event listner
function removeAllEventListners() {
    boardPieces.forEach(el => {
        el.removeEventListener('click', finalGuess)
        el.childNodes[0].removeEventListener('click', initialClick)
    })
}

// if piece got to opposite end change value to 2 or -2 (kings)
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

// check if every single piece is one of the two
function checkWinnerByElimination() {
    if (board.every(row => row.every(piece => piece === 1 || piece === 2 || piece === 0))) winner = 1
    if (board.every(row => row.every(piece => piece === -1 || piece === -2 || piece === 0))) winner = -1
}

function checkWinnerCornering() {
    // if first render return
    if (!initialRender) return

    let remainingEnemies = []
    // iterate through board array and get positions and values of
    // every enemy piece and add object to array
    board.forEach((colArr, colIdx) => {
        colArr.forEach((elVal, rowIdx) => {
            if (opponent.includes(elVal)) {
                let piece = {
                    "id": elVal,
                    "col": colIdx,
                    "row": rowIdx,
                }
                remainingEnemies.push(piece)
            }
        })
    })


    let moveOptions = false
    // iterate through remainingEnemies
    for (let move of remainingEnemies) {
        // update global variable
        currentPlayer = move.id
        visited = {}
        // iterate through possible movies with enemy piece
        let moves = possibleMoves(false, move.col, move.row)

        // if eneemy can make any moves change bool and exit loop
        if (moves.length > 0) {
            moveOptions = true
            break
        }
    }
    // if no moves update winner
    if (!moveOptions) winner = (turn * -1)
}

function findPiecesToRemove(finalCol, finalRow) {
    let piecesId = []

    // find object that has the final move information
    let choice = OPTIONS.find(move => {
        return move["moveId"] === `c${finalCol}r${finalRow}`
    })
    // if current it position is also final position exit
    if (finalCol === currentCol && finalRow === currentRow) {
        return piecesId
        // if only moving one space return
    } else if (choice["startPosition"] === `c${currentCol}r${currentRow}`) {
        return piecesId
    } else {

        // piece right before final is an enemy piece
        let enemypiece = choice.startPosition

        // add it
        piecesId.push(enemypiece)

        // slice id to get col and row
        let lastMoveId = getColAndRow(choice.positionBefore)

        // go back an iteration until find "current col and row"
        let otherPiece = findPiecesToRemove(lastMoveId.col, lastMoveId.row)
        // add each item to array
        piecesId.push(...otherPiece)
        return piecesId

    }
}

function removeJumpedPieces(eliminatedPieces) {
    eliminatedPieces.forEach(piece => {
        let id = getColAndRow(piece)
        board[id.col][id.row] = 0
        let parentEl = boardPieces.find(div => div.id === `c${id.col}r${id.row}`)
        parentEl.childNodes[0].style.backgroundImage = "none"
    })
}

function getColAndRow(id) {
    col = parseInt(id.slice(1, 2))
    row = parseInt(id.slice(3, 4))
    return {col, row}
}