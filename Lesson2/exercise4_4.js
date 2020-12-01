/*
INPUT: object, propertyName, value
OUTPUT: assigns the value to the property to the prototype chain objects 
(1st prototype object with the property found)
RULES:
  - if property doesn't exist in any prtotype object -> don't return anything
EXAMPLE:

object1 {eg: 3} -> object2 -> object3
(object3, eg, 6):
object3 -> not found
object2 -> not found
object1 -> found it! eg = 6

ALGORITHM:
1. Check if the object has the property. YES -> assign new value. NO -> step 2
2. Get the prototype of object.
3. Check if the prototype has the property. YES-> assign new value. NO->step 4
4. Repeat 2 and 3 until the prototype is null
*/

function assignProperty(object, property, value) {
  let prototype = Object.getPrototypeOf(object);
  if (prototype === null) {
    return;
  } else if (prototype.hasOwnProperty(property)) {
    prototype[property] = value;
  } else {
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
