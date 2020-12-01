/*
INPUT: object
OUTPUT: payment object
  - if amount is not present in the argument: total() = phone + internet
  - if the amount property is present: total() = amount
payment structure:
  - internet: X
  - phone: X
  - amount: X
  total()
ALGORITHM:
  internet: services.internet || 0
*/

function createPayment(services = {}) {
  return {
    phone: services.phone || 0,
    internet: services.internet || 0,
    amount: services.amount,
    total() {
      if (!this.amount) {
        return this.phone + this.internet;
      } else {
        return this.amount;
      }
    }
  };
}


function paymentTotal(payments) {
  return payments.reduce((sum, payment)  => sum + payment.total(), 0);
}

let payments = [];
payments.push(createPayment());
payments.push(createPayment({
  internet: 6500,
}));

payments.push(createPayment({
  phone: 2000,
}));

payments.push(createPayment({
  phone: 1000,
  internet: 4500,
}));

payments.push(createPayment({
  amount: 10000,
}));

console.log(paymentTotal(payments));      // => 24000