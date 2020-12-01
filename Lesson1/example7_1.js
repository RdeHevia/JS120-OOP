/* eslint-disable max-lines-per-function */
/*
INPUT: (make, fuelLevel, engine) (string, number, boolean)
OUTPUT: car (object)
  attributes:
    - make
    - fuelLevel
    - engineOn
  methods:
    startEngine
    dive
    stopEngine
    refuel
*/

function createCar(make, fuelLevel, engineOn) {
  let car = {
    make: make,
    fuelLevel: fuelLevel,
    engineOn: engineOn,

    startEngine() {
      this.engineOn = true;
    },

    drive() {
      this.fuelLevel -= 0.1;
    },

    stopEngine() {
      this.engineOn = false;
    },

    refuel (percent) {
      if ((this.fuelLevel + (percent / 100)) <= 1) {
        this.fuelLevel += (percent / 100);
      } else {
        this.fuelLevel = 1;
      }
    }
  };

  return car;
}

let car = createCar('Jaguar', 0.4, false);

console.log(car);
car.startEngine();
console.log(car);