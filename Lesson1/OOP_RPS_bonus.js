/* eslint-disable max-statements */
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
  1) human:
    - move
    - choose()
    - winner?
  2) computer:
    Collaborators: 4)
    - move
    - choose()
    - winner?
    - change strategy()
  3) score:
    - human
    - computer
    - update()
  4 )history of past moves:
    - human
    - computer
  5) game:
    - Collaborators: 1) 2) 3) 4)
    - display winner, score, move history... ()
    - find winner()?
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
  2. Transform the weight object into a nested
  2. Generate a random number btw 0 and 1.
  3. For each weight:
    - Calculate the sum of weights from 0 to that weight.
    - If the random number is less or equal than the weight ->return that choice
changeStrategy:
  1. Based solely in the human frequency of movements, calculate the weights
    that maximizes computer's chances of winning.
  2. Calculate the weighted average between: a) the current weights and
    b) the weights based on human history of movements
  3. Assign the result to the computer weights
calcWeightsBasedOnMoveFrequency:
  1. Import winning combinations
  2. For each move:
    2.1. replace the array of winning combinations with the move frequency
    2.2. calculate the average between the two values
  3. The result is an object with RPSSL as properties and the weights as values
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
  },
};

function createHuman() {
  let player = createPlayer();

  let humanObject = {
    choose() {
      let choice;
      let availableChoices = createRules().choices;
      console.log('YOUR TURN:');
      print.emptyLines(1);
      while (true) {
        print.prompt(
          'Please choose (r)ock, (p)aper, (s)cissors, (sp)ock or (l)izard ' +
          'and press ENTER:'
        );

        print.emptyLines(1);
        choice = readline.question().toLowerCase();
        print.emptyLines(1);

        if (availableChoices.hasOwnProperty(choice)) {
          break;
        }
        console.clear();
        console.log('Sorry, invalid choice. Choose again');
        print.emptyLines(1);
      }
      this.move = availableChoices[choice];
    }
  };

  return Object.assign(player, humanObject);
}

function createComputer() {
  let player = createPlayer();

  let computer = {
    frequencyOfMovesPerUnit: {},
    weights: {
      rock: 0.2,
      paper: 0.2,
      scissors: 0.2,
      spock: 0.2,
      lizard: 0.2
    },

    gameMetrics: {},
    winningCombinations: createRules().winningCombinations,

    choose() {
      let availableChoices = Object.values(createRules().choices);
      let randomNumber = Math.random();
      let sumOfWeights = 0;

      for (let idx = 0; idx < availableChoices.length; idx += 1) {
        let choice = availableChoices[idx];
        sumOfWeights += this.weights[choice];

        if (randomNumber <= sumOfWeights) {
          this.move = choice;
          break;
        }
      }
    },

    changeStrategy() {
      let weightsJustBasedOnHumanPastMoves =
        this.calcWeightsBasedOnMoveFrequency();

      this.updateWeights(weightsJustBasedOnHumanPastMoves);
    },

    calcWeightsBasedOnMoveFrequency() {
      let humanFrequencyOfMovesPerUnit =
        this.gameMetrics.frequencyOfMovesPerUnit.human;
      let weightsJustBasedOnHumanPastMoves = {};
      let winningCombinations = this.winningCombinations;

      for (let move in winningCombinations) {
        let winningMove1 = winningCombinations[move][0];
        let winningMove2 = winningCombinations[move][1];

        let weight1 = humanFrequencyOfMovesPerUnit[winningMove1];
        let weight2 = humanFrequencyOfMovesPerUnit[winningMove2];

        weightsJustBasedOnHumanPastMoves[move] =
          this.weightedAverage(weight1, weight2);
      }
      return weightsJustBasedOnHumanPastMoves;
    },

    weightedAverage(number1, number2, weightingFactors = [1, 1]) {
      let [weightingFactor1, weightingFactor2] = weightingFactors;

      return (
        ((weightingFactor1 * number1) + (weightingFactor2 * number2)) /
        (weightingFactor1 + weightingFactor2)
      );
    },

    updateWeights(weightsJustBasedOnHumanPastMoves) {
      let weights = this.weights;
      let numberOfMoves = this.gameMetrics.numberOfRounds;

      let averageWeightingFactors =
        this.calcAverageWeightingFactors(numberOfMoves);

      for (let move in weights) {
        weights[move] = this.weightedAverage(
          weights[move],
          weightsJustBasedOnHumanPastMoves[move],
          averageWeightingFactors
        );
      }
    },

    calcAverageWeightingFactors(numberOfMoves) {
      let weightingFactorForCurrentWeights;
      let weightingFactorForWeightsBasedOnHumanPastMoves;
      const LIMIT = 5;

      if (numberOfMoves <= LIMIT) {
        weightingFactorForWeightsBasedOnHumanPastMoves =
          (LIMIT * numberOfMoves) - LIMIT;

        weightingFactorForCurrentWeights =
          100 - weightingFactorForWeightsBasedOnHumanPastMoves;
      } else {
        weightingFactorForCurrentWeights = 80;
        weightingFactorForWeightsBasedOnHumanPastMoves = 20;
      }

      return ([
        weightingFactorForCurrentWeights,
        weightingFactorForWeightsBasedOnHumanPastMoves
      ]);
    },
    studyGameMetrics(metrics) {
      this.gameMetrics = metrics;
    },
    seeFrequencyOfMovesPerUnit(frequencyOfMovesPerUnit) {
      this.frequencyOfMovesPerUnit = frequencyOfMovesPerUnit;
    }
  };
  return Object.assign(player, computer);
}

function createPlayer() {
  return {
    move: null,
  };
}

function createRules() {
  return {
    choices: {
      r: 'rock',
      p: 'paper',
      s: 'scissors',
      sp: 'spock',
      l: 'lizard'
    },

    winningCombinations: {
      rock: ['lizard', 'scissors'],
      paper: ['rock', 'spock'],
      scissors: ['paper', 'lizard'],
      spock: ['scissors', 'rock'],
      lizard: ['spock','paper']
    }
  };
}

function createGameMetrics() {
  return {
    lastMove: {
      human: null,
      computer: null
    },

    historyOfMoves: {
      human: [],
      computer: []
    },

    frequencyOfMoves: {
      human: {
        rock: 0,
        paper: 0,
        scissors: 0,
        spock: 0,
        lizard: 0
      },
      computer: {
        rock: 0,
        paper: 0,
        scissors: 0,
        spock: 0,
        lizard: 0
      }
    },

    frequencyOfMovesPerUnit: {
      human: {},
      computer: {},
    },

    numberOfRounds: 0,

    winner: null,

    score: {
      human: 0,
      computer: 0,
    },

    rules: createRules(),

    calculateNumberOfRounds() {
      this.numberOfRounds = this.historyOfMoves.human.length;
    },

    calculateFrequencyOfMoves() {
      this.calculateFrequencyOfMovesOfAPlayer('human');
      this.calculateFrequencyOfMovesOfAPlayer('computer');
    },

    calculateFrequencyOfMovesOfAPlayer(player) {
      let frequencyOfMoves = this.frequencyOfMoves[player];
      let lastMove = this.historyOfMoves[player].slice().pop();

      frequencyOfMoves[lastMove] += 1;
    },

    calculateFrequencyOfMovesPerUnit() {
      this.calculateFrequencyOfMovesPerUnitOfAPlayer('human');
      this.calculateFrequencyOfMovesPerUnitOfAPlayer('computer');
    },

    calculateFrequencyOfMovesPerUnitOfAPlayer(player) {
      let numberOfMoves = this.numberOfRounds;

      let frequencyOfMoves = this.frequencyOfMoves[player];
      let frequencyOfMovesPerUnit = this.frequencyOfMovesPerUnit[player];

      for (let move in frequencyOfMoves) {
        frequencyOfMovesPerUnit[move] = frequencyOfMoves[move] / numberOfMoves;
      }
    },

    updateMoveHistory(humanMove, computerMove) {
      this.lastMove.human = humanMove;
      this.lastMove.computer = computerMove;

      this.historyOfMoves.human.push(humanMove);
      this.historyOfMoves.computer.push(computerMove);
    },

    displayMoveHistory() {
      let humanHistoryOfMoves = this.historyOfMoves.human;
      let computerHistoryOfMoves = this.historyOfMoves.computer;

      console.log('PAST MOVES:');

      print.emptyLines(1);

      console.log(`YOU: ${humanHistoryOfMoves.join(', ')}`);
      console.log(`COMPUTER: ${computerHistoryOfMoves.join(', ')}`);

      print.emptyLines(5);
      print.sectionSeparator();
    },

    findWinner() {
      let humanMove = this.lastMove.human;
      let computerMove = this.lastMove.computer;
      let winningCombinations = this.rules.winningCombinations;

      if (winningCombinations[humanMove].includes(computerMove)) {
        this.winner = 'human';
      } else if (winningCombinations[computerMove].includes(humanMove)) {
        this.winner = 'computer';
      } else {
        this.winner = 'tie';
      }
    },

    displayWinner() {
      let humanMove = this.lastMove.human;
      let computerMove = this.lastMove.computer;

      console.log('ROUND WINNER:');
      print.emptyLines(1);

      console.log(`YOU: ${humanMove}`);
      console.log(`COMPUTER: ${computerMove}`);

      print.emptyLines(1);

      if (this.winner === 'human') {
        console.log(
          `${humanMove.toUpperCase()} wins against ${computerMove.toUpperCase()}.`
        );
        print.emptyLines(1);
        console.log('YOU win!');
      } else if (this.winner === 'computer') {
        console.log(
          `${computerMove.toUpperCase()} wins against ${humanMove.toUpperCase()}.`
        );
        print.emptyLines(1);
        console.log('The COMPUTER wins!');
      } else {
        console.log('You both chose the same.');
        print.emptyLines(1);
        console.log(`It's a TIE`);
      }

      print.sectionSeparator();
    },

    updateScore() {
      if (this.winner === 'human') {
        this.score.human += 1;
      } else if (this.winner === 'computer') {
        this.score.computer += 1;
      }
    },

    displayScore() {
      console.log(`SCORE (HUMAN : COMPUTER)`);
      console.log(`${this.score.human} : ${this.score.computer}`);

      print.sectionSeparator();
    },

    resetScore() {
      this.score.human = 0;
      this.score.computer = 0;
    },

    matchEnded() {
      const NUMBER_OF_ROUNDS = 5;

      if ((this.score.human === NUMBER_OF_ROUNDS) ||
          (this.score.computer === NUMBER_OF_ROUNDS)) {
        return true;
      } else {
        return false;
      }
    },

    displayMatchWinner() {
      console.log('MATCH WINNER:');
      print.emptyLines(1);

      if (this.score.human > this.score.computer) {
        console.log(`YOU won the match! :)`);
      } else {
        console.log(`The COMPUTER won the match. You lost. :(`);
      }
      print.sectionSeparator();
    },
  };
}

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  rules: createRules(),
  metrics: createGameMetrics(),

  displayWelcomeMessage() {
    console.clear();
    print.sectionSeparator();

    console.log('Welcome to ROCK, PAPER, SCISSORS, SPOCK, LIZARD!');
    print.emptyLines(1);
    console.log(`Whoever is first to win 5 games wins the match!`);
    print.sectionSeparator();

    console.log('Are you ready? Press ENTER to continue');
    readline.question();
  },

  displayGoodbyeMessage() {
    console.log('Thanks for playing Rock, Paper, Scissors. Goodbye!');
  },
  displayHeader() {
    console.clear();
    print.emptyLines(1);
    console.log('ROCK  |  PAPER  |  SCISSORS  |  SPOCK  |  LIZARD');
    print.sectionSeparator();
  },

  playAgain() {
    const VALID_CHOICES = ['y', 'yes','n', 'no'];
    console.log('Would you like to play again? (y/n)');
    print.emptyLines(1);
    let answer = readline.question().toLowerCase();

    if (!VALID_CHOICES.includes(answer)) {
      console.clear();
      console.log('Invalid choice. Choose again.');
      print.emptyLines(1);
      return this.playAgain();
    }
    return answer[0] === 'y';
  },

  nextRound() {
    print.prompt(`Are you ready for the next round? Press any key to continue`);
    readline.question();
  },

  playMatch() {
    while (true) {
      this.displayHeader();
      this.metrics.displayMoveHistory();
      this.metrics.displayScore();

      this.human.choose();
      this.computer.choose();

      this.metrics.updateMoveHistory(this.human.move, this.computer.move);

      this.metrics.findWinner();
      this.displayHeader();
      this.metrics.displayWinner();
      this.metrics.updateScore();
      this.metrics.displayScore();

      this.metrics.calculateNumberOfRounds();
      this.metrics.calculateFrequencyOfMoves();
      this.metrics.calculateFrequencyOfMovesPerUnit();

      this.computer.studyGameMetrics(this.metrics);
      this.computer.changeStrategy();

      if (this.metrics.matchEnded()) {
        this.metrics.displayMatchWinner();
        this.metrics.resetScore();
        break;
      }
      this.nextRound();
    }
  },

  play() {
    this.displayWelcomeMessage();
    while (true) {
      this.playMatch();
      if (!this.playAgain()) break;
    }

    this.displayGoodbyeMessage();
  },
};

RPSGame.play();


