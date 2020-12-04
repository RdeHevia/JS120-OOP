let readline = require('readline-sync');

class Square {
  static UNUSED_SQUARE = ' ';
  static HUMAN_MARKER = 'X';
  static COMPUTER_MARKER = 'O';

  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }

  toString() {
    return this.marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }

  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  }
}

class Board {
  constructor() {
    this.reset();
  }

  reset() {
    this.squares = {};
    for (let squareNumber = 1; squareNumber <= 9; squareNumber += 1) {
      this.squares[squareNumber] = new Square();
    }
  }

  copy() {
    // new feature to create trialBoard???
    // for (square in this.squares) {
      // Object.assign({},square) ... something like this
  }
  display() {
    console.log("");
    console.log("     |     |");
    console.log(`  ${this.squares["1"]}  |  ${this.squares["2"]}  |  ${this.squares["3"]}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["4"]}  |  ${this.squares["5"]}  |  ${this.squares["6"]}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["7"]}  |  ${this.squares["8"]}  |  ${this.squares["9"]}`);
    console.log("     |     |");
    console.log("");
  }

  displayWithClear() {
    console.clear();
    console.log('');
    console.log('');
    this.display();
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }

  unMarkSquareAt(key) {
    this.markSquareAt(key, Square.UNUSED_SQUARE);
  }
  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused());
  }

  isFull() {
    return this.unusedSquares().length === 0;
  }

  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });

    return markers.length;
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
  }
}

class TTTGame {

  static POSSIBLE_WINNING_ROWS = [
    [ "1", "2", "3" ],            // top row of board
    [ "4", "5", "6" ],            // center row of board
    [ "7", "8", "9" ],            // bottom row of board
    [ "1", "4", "7" ],            // left column of board
    [ "2", "5", "8" ],            // middle column of board
    [ "3", "6", "9" ],            // right column of board
    [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
    [ "3", "5", "7" ],            // diagonal: bottom-left to top-right
  ]

  static joinOr(array, intermediateSeparator = ', ', lastSeparator = 'or') {
    if (array.length <= 1) {
      return array.toString();
    } else {
      let elementsButLast = array.slice(0,array.length - 1);
      let lastElement = array[array.length - 1];
      lastSeparator = ' ' + lastSeparator + ' ';
      return elementsButLast.join(intermediateSeparator)
        + lastSeparator
        + lastElement.toString();
    }
  }

  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
  }

  play() {
    this.displayWelcomeMessage();

    while (true) {
      this.playOneGame();
      if (!this.playAgain()) break;
      this.board.reset();
    }

    this.displayGoodbyeMessage();
  }

  playOneGame() {
    this.board.display();

    while (true) {
      this.humanMoves();
      if (this.gameOver()) break;

      this.computerMoves();
      if (this.gameOver()) break;

      this.board.displayWithClear();
    }
    this.board.displayWithClear();
    this.displayResults();
  }

  displayWelcomeMessage() {
    console.clear();
    console.log('Welcome to Tic Tac Toe!');
    console.log('');
  }

  displayGoodbyeMessage() {
    console.log('Thanks for playing Tic Tac Toe! Goodbye!');
  }

  displayResults() {
    if (this.isWinner(this.human)) {
      console.log(`You won! Congratulations!`);
    } else if (this.isWinner(this.computer)) {
      console.log(`I won! I won! Take that, human!`);
    } else {
      console.log(`A tie game. How boring.`);
    }
  }

  humanMoves() {
    let choice;

    while (true) {
      let validChoices = this.board.unusedSquares();

      const prompt = `Choose a square (${TTTGame.joinOr(validChoices)}): `;
      choice = readline.question(prompt);

      if (validChoices.includes(choice)) break;

      console.log(`Sorry, that's not a valid choice.`);
      console.log('');
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  computerMoves() {
    let validChoices = this.board.unusedSquares();
    let choice;
    // if (this.canWin(this.human) || this.canWin(this.computer)) {
    //   choice = this.winningMoveOf(this.human) || this.winningMoveOf(this.computer);
    // }
    if (this.someoneCouldWinOnNextMove()) {
      choice = (
        this.findWinningMoveOf(this.computer) || 
        this.findWinningMoveOf(this.human)
      );
    } else if (this.isCenterSquareAvailable()) {
      const CENTER_SQUARE_IDENTIFIER = "5";
      choice = CENTER_SQUARE_IDENTIFIER;
    } else {
    // if (this.findWinningMoveOf(this.human)) {
    //   choice = this.findWinningMoveOf(this.human);
    //   // console.log(choice);
    // } else {
      do {
        choice = Math.floor((9 * Math.random()) + 1).toString();
      } while (!validChoices.includes(choice));
    }
    // console.log(choice);
    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  someoneCouldWinOnNextMove() {
    return this.findWinningMoveOf(this.computer)
      || this.findWinningMoveOf(this.human);
  }

  findWinningMoveOf(player) {
    let unusedSquares = this.board.unusedSquares();
    let winningSquareNumber = null;

    for (let idx = 0; idx < unusedSquares.length; idx += 1) {
      let squareNumber = unusedSquares[idx];
      this.board.markSquareAt(squareNumber, player.getMarker());

      if (this.made3InARow(player,this.board)) {
        winningSquareNumber = squareNumber;
        this.board.unMarkSquareAt(squareNumber);
        break;
      }
      this.board.unMarkSquareAt(squareNumber);
    }
    return winningSquareNumber;
  }

  isCenterSquareAvailable() {
    let unusedSquares = this.board.unusedSquares();
    let CENTER_SQUARE_IDENTIFIER = "5";
    return unusedSquares.includes(CENTER_SQUARE_IDENTIFIER);
  }

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  }

  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }

  isWinner(player) {
    return this.made3InARow(player);
  }

  made3InARow(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }

  playAgain() {
    const VALID_CHOICES = {y: true, n: false};
    console.log('Do you want to play again? Yes (y) or no (n)?');
    let choice = readline.question();

    if (!VALID_CHOICES.hasOwnProperty(choice)) {
      console.log('Invalid choice. please choose again.');
      return this.playAgain();
    }
    return VALID_CHOICES[choice];

  }
}

let game = new TTTGame();
game.play();