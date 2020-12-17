let readline = require('readline-sync');

const print = {
  numberOfHyphens: 50,

  prompt (string) {
    console.log(`=> ${string}`);
  },

  emptyLines (numberOfEmptyLines = 1) {
    console.log('\n'.repeat(numberOfEmptyLines));
  },

  separator () {
    console.log('-'.repeat(this.numberOfHyphens));
  },

  sectionSeparator () {
    this.emptyLines();
    console.log('-'.repeat(this.numberOfHyphens));
    this.emptyLines();
  },
};

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

    print.sectionSeparator();
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

  isCenterSquareAvailable() {
    let unusedSquares = this.unusedSquares();
    let CENTER_SQUARE_IDENTIFIER = "5";
    return unusedSquares.includes(CENTER_SQUARE_IDENTIFIER);
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
  static IDENTIFIER = 'human';

  constructor() {
    super(Square.HUMAN_MARKER);
  }
}

class Computer extends Player {
  static IDENTIFIER = 'computer';

  constructor() {
    super(Square.COMPUTER_MARKER);
  }
}

class Score {
  constructor() {
    this.reset();
  }

  display() {
    print.sectionSeparator();

    console.log('SCORE (HUMAN : COMPUTER)');
    console.log(`${this.human} : ${this.computer}`);

    print.sectionSeparator();
  }

  reset() {
    this[Human.IDENTIFIER] = 0;
    this[Computer.IDENTIFIER] = 0;
  }

  add1Point(player) {
    if (!this.hasOwnProperty(player)) return;
    this[player] += 1;
  }
}

class TTTGame {

  static NUMBER_OF_POINTS_TO_WIN_MATCH = 3;

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
    this.score = new Score();

    this.player1 = this.human;
    this.player2 = this.computer;
  }

  play() {
    this.displayWelcomeMessage();
    this.promptToContinue('Press ENTER to start the game...');
    while (true) {
      this.playMatch();
      if (!this.playAgain()) break;
      this.score.reset();
    }

    this.displayGoodbyeMessage();
  }

  playMatch() {
    while (true) {
      this.playOneGame();
      this.promptToContinue();

      this.swapPlayers();
      this.board.reset();

      if (this.someoneWonTheMatch()) {
        this.displayInterface('match over');
        break;
      }
    }
  }

  playOneGame() {
    this.displayInterface();

    while (true) {
      this.playerMoves(this.player1);
      if (this.gameOver()) break;
      this.displayInterface();


      this.playerMoves(this.player2);
      if (this.gameOver()) break;
      this.displayInterface();

    }
    this.updateScore();

    this.displayInterface('game over');
  }

  playAgain() {
    const VALID_CHOICES = {y: true, n: false};
    print.prompt('Do you want to play again? Yes (y) or no (n)?');
    let choice = readline.question().toLowerCase();

    if (!VALID_CHOICES.hasOwnProperty(choice)) {
      console.log('Invalid choice. please choose again.');
      return this.playAgain();
    }
    return VALID_CHOICES[choice];

  }

  promptToContinue(message = 'Press ENTER to continue.') {
    print.prompt(message);
    readline.question();
  }

  displayInterface(gameStage = 'in progress') {
    switch (gameStage) {
      case 'in progress':
        this.displayHeader();
        this.score.display();
        this.board.display();
        break;

      case 'game over':
        this.displayInterface();
        this.displayResults();
        break;

      case 'match over':
        console.clear();
        this.displayHeader();
        this.score.display();
        this.displayMatchWinner();
    }
  }

  displayHeader() {
    console.clear();
    print.sectionSeparator();

    console.log(`TIC TAC TOE`);
  }

  displayWelcomeMessage() {
    console.clear();
    print.sectionSeparator();
    console.log('WELCOME TO TIC TAC TOE!');
    print.emptyLines();
    this.displayScoreToWinMatch();
    print.emptyLines();
    this.displayMarkerAssigment();
    print.sectionSeparator();
  }

  displayScoreToWinMatch() {
    console.log(
      'Whoever is first to win ' +
      TTTGame.NUMBER_OF_POINTS_TO_WIN_MATCH +
      ' games wins the match!'
    );
  }

  displayMarkerAssigment() {
    console.log(`You use: ${Square.HUMAN_MARKER}`);
    console.log(`Computer uses: ${Square.COMPUTER_MARKER}`);
  }

  displayGoodbyeMessage() {
    console.clear();
    print.sectionSeparator();

    console.log('Thanks for playing Tic Tac Toe! Goodbye!');

    print.sectionSeparator();
  }

  displayResults() {
    if (this.isWinner(this.human)) {
      console.log(`You won! Congratulations!`);
    } else if (this.isWinner(this.computer)) {
      console.log(`I won! I won! Take that, human!`);
    } else {
      console.log(`A tie game. How boring.`);
    }

    print.sectionSeparator();
  }

  displayMatchWinner() {
    if (this.isMatchWinner(this.human)) {
      console.log(`You won the match! Congratulations!`);
    } else {
      console.log(`I won the match! Take that, human!`);
    }

    print.sectionSeparator();

  }

  playerMoves(player) {
    if (player === this.human) {
      this.humanMoves();
    } else {
      this.computerMoves();
    }
  }

  humanMoves() {
    let choice;

    while (true) {
      let validChoices = this.board.unusedSquares();

      const PROMPT_MSG = `Choose a square (${TTTGame.joinOr(validChoices)}): `;
      print.prompt(PROMPT_MSG);
      choice = readline.question();

      if (validChoices.includes(choice)) break;

      console.log(`Sorry, that's not a valid choice.`);
      console.log('');
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  computerMoves() {
    let validChoices = this.board.unusedSquares();
    let choice;

    if (this.someoneCouldWinOnNextMove()) {
      choice = (
        this.offensiveComputerMove() ||
        this.defensiveComputerMove()
      );
    } else if (this.board.isCenterSquareAvailable()) {
      choice = this.pickCenterSquare();
    } else {
      do {
        choice = Math.floor((9 * Math.random()) + 1).toString();
      } while (!validChoices.includes(choice));
    }

    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  offensiveComputerMove() {
    return this.findWinningMoveOf(this.computer);
  }

  defensiveComputerMove() {
    return this.findWinningMoveOf(this.human);
  }

  pickCenterSquare() {
    const CENTER_SQUARE_IDENTIFIER = "5";
    return CENTER_SQUARE_IDENTIFIER;
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

  swapPlayers() {
    [this.player1, this.player2] = [this.player2, this.player1];
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

  someoneWonTheMatch() {
    return this.isMatchWinner(this.human) || this.isMatchWinner(this.computer);
  }

  isMatchWinner(player) {
    const PLAYER_IDENTIFIER = player.constructor.IDENTIFIER;

    return (
      this.score[PLAYER_IDENTIFIER] === TTTGame.NUMBER_OF_POINTS_TO_WIN_MATCH
    );
  }

  updateScore() {
    if (this.isWinner(this.human)) {
      this.score.add1Point('human');
    } else if (this.isWinner(this.computer)) {
      this.score.add1Point('computer');
    }
  }
}

let game = new TTTGame();
game.play();