1. Initialize the game board
    -Create an 8x8 grid for the game board
    -Place the pieces on the board (12 pieces on each sidee of the board)

2. Set the current player to 1
    -Players are 1, and -1.
    -Empty spaces are null or 0
    -King Pieces are 2 and -2

3. --Game Play-- Repeat until game finished
    -Display game board
    -Display who's turn it is
    -Player select a piece to move
    -Validate that it is the current players piece
        -if valid-
            -Display possible moves
            -Select one of the possible moves
        -else-
            -Do not display any possible moves
    -Move the piece and update the board
        -if moved and captured opponents piece remove them from the board
        -Check if the current piece reached end of the board and change to a King Piece
        -Check for a winner-
            -if all oppenents pieces are captured or cannot make another move
    -If no winner, switch players

4. Display the winner and end game

5. Display a play again button