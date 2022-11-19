"use strict";

const comm = require("../assets/dist/js/commutator.ts");
let res1: string[] = [],
  res2 = "";
console.time("Test 1");
console.log("The commutator of a b4 c b a' b2' c' b3' in different orders.");
for (let orderInput = 0; orderInput <= 10; orderInput++) {
  res2 = comm.search({
    algorithm: "a b4 c b a' b2' c' b3'",
    order: orderInput,
    outerBracket: false,
  })[0];
  console.log("order = ", orderInput, ", commutator = ", res2);
}
console.timeEnd("Test 1");
console.time("Test 2");
console.log("The expand of a b4 c b a' b2' c' b3' in different orders.");
for (let orderInput = 0; orderInput <= 10; orderInput++) {
  res2 = comm.expand({
    algorithm: "[a b,b3 c b2]",
    order: orderInput,
    initialReplace: {},
    finalReplace: {},
    commute: {},
  });
  console.log("order = ", orderInput, ", expand = ", res2);
}
console.timeEnd("Test 2");
console.time("Test 3");
console.log("Single commutator:");
console.log("The commutator of U' R U R2 D' R2 U' R' U R2 D R2 in order 4.");
res1 = comm.search({
  algorithm: "U' R U R2 D' R2 U' R' U R2 D R2",
  order: 4,
  outerBracket: true,
  limit: 3,
});
console.log(res1);
console.timeEnd("Test 3");
console.log("Combination of commutators:");
console.time("Test 4");
console.log(
  "The combination of commutators of R U' S U2 S R' S2 R U' R' in order 4."
);
res1 = comm.search({
  algorithm: "R U' S U2 S R' S2 R U' R'",
  order: 4,
  outerBracket: true,
  limit: 3,
});
console.log(res1);
console.timeEnd("Test 4");
