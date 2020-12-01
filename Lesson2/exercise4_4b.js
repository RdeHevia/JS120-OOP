/*
INPUT: object, property, value
OUTPUT: mutated object
RULES;
  - searches the prototype chain for a given property and assigns it a new val.
  - if property doesn't exist -> do nothing
ALGORITHM:
  1. Check if the object has the property
    - YES -> assign the value
    - NO:
      * Call the function on the prototype. Repeat until we get to the default
        object
*/

function assignProperty(object, property, value) {
  if (object.hasOwnProperty(property)) {
    object[property] = value;
  } else if (object !== Object.prototype) {
    let prototype = Object.getPrototypeOf(object);
    assignProperty(prototype, property, value);
  }
}

let fooA = { bar: 1 };
let fooB = Object.create(fooA);
let fooC = Object.create(fooB);

assignProperty(fooC, "bar", 2);
console.log(fooA.bar); // 2
console.log(fooC.bar); // 2

assignProperty(fooC, "qux", 3);
console.log(fooA.qux); // undefined
console.log(fooC.qux); // undefined
console.log(fooA.hasOwnProperty("qux")); // false
console.log(fooC.hasOwnProperty("qux")); // false