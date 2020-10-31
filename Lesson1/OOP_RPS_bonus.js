/* eslint-disable max-lines-per-function */
/*
PROBLEM:
- RPS is a 2 player game
- Each player chooses one of 3 possible moves: rock, paper, scissors
- The winner is chosen by comparing their moves with the following rules:
  - rock wins agains scissors
  - scissors wing against paper
  - paper wins against rock
KEY WORDS:
  - words: *human, *computer, *move(RPSSL), *score, *history, game
  - verbs: *choose, update, change strategy, display, find
ORGANIZATION:
  human:
    - move
    - choose()
    - winner?
  computer:
    - move
    - choose()
    - winner?
    - change strategy
  score:
    - human
    - computer
    - update
  history of past moves:
    - human
    - computer
  game:
    - display winner, score, move history...
    - find winner?
ALGORITHM:
  1. Welcome message
  2. Human chooses
  3. Computer chooses
  4. Compare choices
  5. Display winner
  6. Update score
  7. Repeat 1 to 6 until score = 5
displayWinner:
  1. Find winner
  2. Update score
  3. display the winner
findWinner RPSSL
  1. Define the rules (relationships between RPSSL)
  2. If move1 includes move2 -> player1 wins
  3. If move2 includes move1 -> player2 wins
  4. Else -> tie
chooseComputer:
  1. Define the weights
  2. Generate a random number btw 0 and 1.
  3. For each weight:
    - Calculate the sum of weights from 0 to that weight.
    - If the random number is less or equal than the weight -> return that choice
*/
let readline = require('readline-sync');

const print = {
  prompt (string) {
    console.log(`=> ${string}`);
  },

  emptyLines (numberOfEmptyLines) {
    console.log('\n'.repeat(numberOfEmptyLines));
  },
  separator () {
    const NUMBER_OF_HYPHENS = 50;
    console.log('-'.repeat(NUMBER_OF_HYPHENS));
  },

  sectionSeparator () {
    const NUMBER_OF_HYPHENS = 50;

    this.emptyLines(1);
    console.log('-'.repeat(NUMBER_OF_HYPHENS));
    this.emptyLines(1);
  }
};

function createHuman() {
  let playerObject = createPlayer();
  let humanObject = {
    choose() {
      let choice;
      let availableChoices = createRules().choices;
      while (true) {
        print.prompt('Please choose rock, paper, scissors, spock or lizard:');
        print.emptyLines(1);
        choice = readline.question();
        print.emptyLines(1);
        if (availableChoices.includes(choice)) {
          break;
        }
        console.log('Sorry, invalid choice. Choose again');
        print.emptyLines(1);
      }
      this.move = choice;
    }
  };
  return Object.assign(playerObject, humanObject);
}

function createComputer() {
  let playerObject = createPlayer();
  let computerObject = {
    weights: [0.2, 0.2, 0.2, 0.2, 0.2],

    choose() {
      const availableChoices = createRules().choices;
      let randomNumber = Math.random();

      for (let idx = 0; idx < this.weights.length; idx += 1) {
        let sumOfWeights = this.weights
          .slice(0, idx + 1)
          .reduce((sum, weight) => sum + weight);
        if (randomNumber <= sumOfWeights) {
          this.move = availableChoices[idx];
          break;
        }
      }
    },
  };
  return Object.assign(playerObject, computerObject);
}

function createPlayer() {
  return {
    move: null,
    moveHistory: [],
    score: 0,
    winner: false,
  };
}

function createRules() {
  return {
    choices: ['rock', 'paper', 'scissors', 'spock', 'lizard'],

    winningCombinations: {
      rock: ['lizard', 'scissors'],
      paper: ['rock', 'spock'],
      scissors: ['paper', 'lizard'],
      spock: ['scissors', 'rock'],
      lizard: ['spock','paper']
    }
  };
}

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  rules: createRules(),

  displayWelcomeMessage() {
    console.clear();
    print.sectionSeparator();
    console.log('Welcome to Rock, Paper, Scissors!');
    print.sectionSeparator();
  },

  displayGoodbyeMessage() {
    console.log('Thanks for playing Rock, Paper, Scissors. Goodbye!');
  },

  findWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;
    let winningCominations = this.rules.winningCombinations;

    if (winningCominations[humanMove].includes(computerMove)) {
      this.human.winner = true;
      this.computer.winner = false;
    } else if (winningCominations[computerMove].includes(humanMove)) {
      this.human.winner = false;
      this.computer.winner = true;
    } else {
      this.human.winner = false;
      this.computer.winner = false;
    }
  },

  updateScore() {
    if (this.human.winner) {
      this.human.score += 1;
    } else if (this.computer.winner) {
      this.computer.score += 1;
    }
  },

  updateMoveHistory() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;
    this.human.moveHistory.push(humanMove);
    this.computer.moveHistory.push(computerMove);
  },
  updateComputerWeights() {
    let humanMoveHistory = this.human.moveHistory;
    let lastMoveIndex = humanMoveHistory.length - 1;
    if (humanMoveHistory[lastMoveIndex] === humanMoveHistory[lastMoveIndex - 1]) {
      // Implementation pending
      // Change weights data structure to an object: {rock: 0.2, paper: 0.2,...}
      // add this function to the computer object: 
      // this.computer.updatesStrategy(humanMoveHistory) 
      //Helper function of updatesStrategy: updateWeightsBasedOnHumanPastMoves (humanMoveHistory)
    }
  },
  displayMoveHistory() {
    console.log('PAST MOVES:');
    print.emptyLines(1);
    console.log(`YOU: ${this.human.moveHistory.join(', ')}`);
    console.log(`COMPUTER: ${this.computer.moveHistory.join(', ')}`);
    print.sectionSeparator();
  },

  displayScore() {
    console.log(`SCORE (HUMAN : COMPUTER)`);
    console.log(`${this.human.score} : ${this.computer.score}`);
    print.sectionSeparator();
  },

  displayWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    console.clear();
    print.sectionSeparator();
    console.log(`You chose: ${humanMove}`);
    console.log(`The computer chose: ${computerMove}`);
    print.emptyLines(1);

    if (this.human.winner) {
      console.log('You win!');
    } else if (this.computer.winner) {
      console.log('Computer wins!');
    } else {
      console.log(`It's a tie.`);
    }
    print.sectionSeparator();
  },

  playAgain() {
    console.log('Would you like to play again? (y/n)');
    let answer = readline.question();
    return answer.toLowerCase()[0] === 'y';
  },

  nextRound() {
    print.prompt(`Are you ready for the next round? Press any key to continue`);
    readline.question();
    console.clear();
  },
  matchEnded() {
    const NUMBER_OF_ROUNDS = 5;
    if ((this.human.score === NUMBER_OF_ROUNDS) ||
        (this.computer.score === NUMBER_OF_ROUNDS)) {
      return true;
    } else {
      return false;
    }
  },

  displayMatchWinner() {
    if (this.human.score > this.computer.score) {
      console.log(`You won the match!`);
    } else {
      console.log(`The computer won the match.`);
    }
  },

  bestOf5() {
    while (true) {
      this.displayMoveHistory();
      this.human.choose();
      this.computer.choose();
      this.findWinner();
      this.displayWinner();
      this.updateScore();
      this.displayScore();
      this.updateMoveHistory();
      if (this.matchEnded()) {
        this.displayMatchWinner();
        break;
      }
      this.nextRound();
    }
  },

  play() {
    this.displayWelcomeMessage();
    while (true) {
      this.bestOf5();
      if (!this.playAgain()) break;
    }

    this.displayGoodbyeMessage();
  },
};


let compu = createComputer();
compu.choose();
console.log(compu);
// RPSGame.play();