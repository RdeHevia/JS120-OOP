let ninjaA;

{
  const Ninja = function() {
    this.swung = false;
  };

  ninjaA = new Ninja();
}

let ninjaB = new ninjaA.constructor();

console.log(ninjaA.constructor === ninjaB.constructor); // => true