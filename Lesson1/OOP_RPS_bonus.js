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
  - words: player, move (rock, paper scissors), rule, score
  - verbs: choose, compare, update
ORGANIZATION:
  - player:
    * score
    * choose
  - move
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

*/
let readline = require('readline-sync');

function createHuman() {
  let playerObject = createPlayer();
  let humanObject = {
    choose() {
      let choice;

      while (true) {
        console.log('Please choose rock, paper, or scissors:');
        choice = readline.question();
        if (['rock', 'paper', 'scissors'].includes(choice)) break;
        console.log('Sorry, invalid choice.');
      }
      this.move = choice;
    }
  };
  return Object.assign(playerObject, humanObject);
}

function createComputer() {
  let playerObject = createPlayer();
  let computerObject = {
    choose() {
      const choices = ['rock', 'paper', 'scissors'];
      let randomIndex = Math.floor(Math.random() * choices.length);
      this.move = choices[randomIndex];
    }
  };
  return Object.assign(playerObject, computerObject);
}

function createPlayer() {
  return {
    move: null,
    score: 0,
    winner: false,
  };
}

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),

  displayWelcomeMessage() {
    console.log('Welcome to Rock, Paper, Scissors!');
  },

  displayGoodbyeMessage() {
    console.log('Thanks for playing Rock, Paper, Scissors. Goodbye!');
  },

  findWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    if ((humanMove === 'rock' && computerMove === 'scissors') ||
        (humanMove === 'paper' && computerMove === 'rock') ||
        (humanMove === 'scissors' && computerMove === 'paper')) {
      this.human.winner = true;
      this.computer.winner = false;
    } else if ((humanMove === 'rock' && computerMove === 'paper') ||
              (humanMove === 'paper' && computerMove === 'scissors') ||
              (humanMove === 'scissors' && computerMove === 'rock')) {
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

  displayScore() {
    this.updateScore();
    console.log(`${this.human.score} : ${this.computer.score}`);
  },
  displayWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    console.log(`You chose: ${humanMove}`);
    console.log(`The computer chose: ${computerMove}`);

    this.findWinner();

    if (this.human.winner) {
      console.log('You win!');
    } else if (this.computer.winner) {
      console.log('Computer wins!');
    } else {
      console.log(`It's a tie`);
    }
  },

  playAgain() {
    console.log('Would you like to play again? (y/n)');
    let answer = readline.question();
    return answer.toLowerCase()[0] === 'y';
  },

  play() {
    this.displayWelcomeMessage();
    while (true) {
      this.bestOf5();
      if (!this.playAgain()) break;
    }

    this.displayGoodbyeMessage();
  },

  bestOf5() {
    while (true) {
      this.human.choose();
      this.computer.choose();
      this.displayWinner();
      this.displayScore();
      if (this.matchEnded()) {
        this.displayMatchWinner();
        break;
      }
    }
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
  }
};

RPSGame.play();