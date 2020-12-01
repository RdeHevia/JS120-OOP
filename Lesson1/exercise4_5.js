/*
addPayment:
INPUT: an object or an array of objects
OUTPUT: payment objects added to the invoice object
ALGORITHM:
  1. Determine if the input is an object or an array of objects
  2. If the input is an object -> create an array of 1 single object
  3. Iterate over all the payment objects. For each payment object
    - add it to the invoice object
*/


// eslint-disable-next-line max-lines-per-function
function createInvoice(services = {}) {
  return {
    phone: services.phone || 3000,
    internet: services.internet || 5500,
    payments: [],
    total() {
      return this.phone + this.internet;
    },

    addPayments(oneOrMultiplePayments) {
      if (!Array.isArray(oneOrMultiplePayments)) {
        oneOrMultiplePayments = [oneOrMultiplePayments];
      }
      this.payments.push(...oneOrMultiplePayments);
    },

    paymentTotal() {
      return this.payments.reduce((sum, payment)  => sum + payment.total(), 0);
    },

    amountDue() {
      return this.total() - this.paymentTotal();
    }
  };
}

function invoiceTotal(invoices) {
  let total = 0;

  for (let index = 0; index < invoices.length; index += 1) {
    total += invoices[index].total();
  }

  return total;
}

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

let invoice = createInvoice({
  phone: 1200,
  internet: 4000,
});

let payment1 = createPayment({ amount: 2000 });
let payment2 = createPayment({
  phone: 1000,
  internet: 1200
});

let payment3 = createPayment({ phone: 1000 });

invoice.addPayments(payment1);
invoice.addPayments([payment2, payment3]);
// console.log(invoice);
console.log(invoice.amountDue());       // this should return 0

// let invoices = [];
// invoices.push(createInvoice());
// invoices.push(createInvoice({ internet: 6500 }));
// invoices.push(createInvoice({ phone: 2000 }));
// invoices.push(createInvoice({
//   phone: 1000,
//   internet: 4500,
// }));

// console.log(invoiceTotal(invoices)); // 31000

// let payments = [];
// payments.push(createPayment());
// payments.push(createPayment({
//   internet: 6500,
// }));

// payments.push(createPayment({
//   phone: 2000,
// }));

// payments.push(createPayment({
//   phone: 1000,
//   internet: 4500,
// }));

// payments.push(createPayment({
//   amount: 10000,
// }));

// console.log(paymentTotal(payments));      // => 24000