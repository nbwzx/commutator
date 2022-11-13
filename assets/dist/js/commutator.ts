/*!
 * Commutator (https://github.com/nbwzx/commutator)
 * Copyright (c) 2022 Zixing Wang <zixingwang.cn@gmail.com>
 * Licensed under MIT (https://github.com/nbwzx/commutator/blob/main/LICENSE)
 */
"use strict";

const commutator = (function () {
  const orderInit = 4,
    outerBracketInit = false,
    abMaxScoreInit = 2.5,
    abMinScoreInit = 5,
    maxDepthInit = 0,
    limitInit = 0;
  const commuteInit: { [id: string]: { class: number; priority: number } } = {
    U: { class: 1, priority: 1 },
    D: { class: 1, priority: 2 },
    E: { class: 1, priority: 3 },
    R: { class: 2, priority: 1 },
    L: { class: 2, priority: 2 },
    M: { class: 2, priority: 3 },
    F: { class: 3, priority: 1 },
    B: { class: 3, priority: 2 },
    S: { class: 3, priority: 3 },
  };
  const initialReplaceInit: { [id: string]: string } = {
    r2: "R2 M2",
    "r'": "R' M",
    r: "R M'",
    l2: "L2 M2",
    "l'": "L' M'",
    l: "L M",
    f2: "F2 S2",
    "f'": "F' S'",
    f: "F S",
    b2: "B2 S2",
    "b'": "B' S",
    b: "B S'",
    u2: "U2 E2",
    "u'": "U' E",
    u: "U E'",
    d2: "D2 E2",
    "d'": "D' E'",
    d: "D E",
  };
  const finalReplaceInit: { [id: string]: string } = {
    "R2 M2": "r2",
    "R' M": "r'",
    "R M'": "r",
    "L2 M2": "l2",
    "L' M'": "l'",
    "L M": "l",
    "F2 S2": "f2",
    "F' S'": "f'",
    "F S": "f",
    "B2 S2": "b2",
    "B' S": "b'",
    "B S'": "b",
    "U2 E2": "u2",
    "U' E": "u'",
    "U E'": "u",
    "D2 E2": "d2",
    "D' E'": "d'",
    "D E": "d",
    "M2 R2": "r2",
    "M R'": "r'",
    "M' R": "r",
    "M2 L2": "l2",
    "M' L'": "l'",
    "M L": "l",
    "S2 F2": "f2",
    "S' F'": "f'",
    "S F": "f",
    "S2 B2": "b2",
    "S B'": "b'",
    "S' B": "b",
    "E2 U2": "u2",
    "E U'": "u'",
    "E' U": "u",
    "E2 D2": "d2",
    "E' D'": "d'",
    "E D": "d",
    "R M2": "r M'",
    "R' M2": "r' M",
    "M2 R": "r M'",
    "M2 R'": "r' M",
  };
  type Move = { base: string; amount: number };
  let result: string[] = [],
    order = orderInit,
    minAmount = -1,
    maxAmount = 2,
    maxAlgAmount = 0,
    outerBracket = outerBracketInit,
    abMaxScore = abMaxScoreInit,
    abMinScore = abMinScoreInit,
    maxDepth = maxDepthInit,
    limit = limitInit;
  let commute = commuteInit,
    initialReplace = initialReplaceInit,
    finalReplace = finalReplaceInit;

  function expand(input: {
    algorithm: string;
    order?: number;
    initialReplace?: { [id: string]: string };
    finalReplace?: { [id: string]: string };
    commute?: { [id: string]: { class: number; priority: number } };
  }): string {
    const algorithm: string = input.algorithm;
    order = Number(input.order ?? orderInit);
    initialReplace = input.initialReplace ?? initialReplaceInit;
    finalReplace = input.finalReplace ?? finalReplaceInit;
    commute = input.commute ?? commuteInit;
    let algValue: string = algorithm;
    algValue = algValue.replace(/[‘]/gu, "'");
    algValue = algValue.replace(/[’]/gu, "'");
    algValue = algValue.replace(/\(/gu, "");
    algValue = algValue.replace(/\)/gu, "");
    algValue = algValue.replace(/（/gu, "");
    algValue = algValue.replace(/）/gu, "");
    algValue = algValue.replace(/\s/gu, "");
    algValue = algValue.split("").join(" ");
    algValue = algValue.replace(/【/gu, "[");
    algValue = algValue.replace(/】/gu, "]");
    algValue = algValue.replace(/，/gu, ",");
    algValue = algValue.replace(/: /gu, ":");
    algValue = algValue.replace(/, /gu, ",");
    algValue = algValue.replace(/\[ /gu, "[");
    algValue = algValue.replace(/\] /gu, "]");
    algValue = algValue.replace(/ :/gu, ":");
    algValue = algValue.replace(/ ,/gu, ",");
    algValue = algValue.replace(/ \[/gu, "[");
    algValue = algValue.replace(/ \]/gu, "]");
    algValue = `[${algValue.replace(/\+/gu, "]+[")}]`;
    algValue = algValue.replace(/\]\[/gu, "]+[");
    if (algValue === "") {
      return "Empty input.";
    }
    if (order === 0) {
      preprocessing(algValue);
      order = 2 * (maxAlgAmount + 2);
    }
    // Examples:
    // • order 4 → min -1 (e.g. cube)
    // • order 5 → min -2 (e.g. Megaminx)
    // • order 3 → min -1 (e.g. Pyraminx)
    minAmount = Math.floor(order / 2) + 1 - order;
    maxAmount = Math.floor(order / 2);
    const expression: string[] = rpn(initializeExperssion(algValue));
    if (
      expression[0] === "Lack left parenthesis." ||
      expression[0] === "Lack right parenthesis."
    ) {
      return expression[0];
    }
    return simplifyfinal(preprocessing(calculate(expression)));
  }

  function isOperator(val: string): boolean {
    const operatorString = "+:,[]";
    return operatorString.indexOf(val) > -1;
  }

  function initializeExperssion(expression: string): string[] {
    const inputStack: string[] = [];
    inputStack.push(expression[0]);
    for (let i = 1; i < expression.length; i++) {
      if (isOperator(expression[i]) || isOperator(inputStack.slice(-1)[0])) {
        inputStack.push(expression[i]);
      } else {
        inputStack.push(inputStack.pop() + expression[i]);
      }
    }
    return inputStack;
  }

  function operatorLevel(operator: string): number {
    if (operator === ",") {
      return 0;
    }
    if (operator === ":") {
      return 1;
    }
    if (operator === "+") {
      return 2;
    }
    if (operator === "[") {
      return 3;
    }
    if (operator === "]") {
      return 4;
    }
    return -1;
  }

  function rpn(inputStack: string[]): string[] {
    // Reverse Polish Notation
    const outputStack: string[] = [],
      operatorStack: string[] = [];
    let match = false,
      tempOperator = "";
    while (inputStack.length > 0) {
      const sign = inputStack.shift() ?? "";
      if (!isOperator(sign)) {
        outputStack.push(sign);
      } else if (operatorLevel(sign) === 4) {
        match = false;
        while (operatorStack.length > 0) {
          tempOperator = operatorStack.pop() ?? "";
          if (tempOperator === "[") {
            match = true;
            break;
          } else {
            outputStack.push(tempOperator);
          }
        }
        if (!match) {
          return ["Lack left parenthesis."];
        }
      } else {
        while (
          operatorStack.length > 0 &&
          operatorStack.slice(-1).toString() !== "[".toString() &&
          operatorLevel(sign) <= operatorLevel(operatorStack.slice(-1)[0])
        ) {
          outputStack.push(operatorStack.pop() ?? "");
        }
        operatorStack.push(sign);
      }
    }
    while (operatorStack.length > 0) {
      tempOperator = operatorStack.pop() ?? "";
      if (tempOperator === "[") {
        return ["Lack right parenthesis."];
      }
      outputStack.push(tempOperator);
    }
    return outputStack;
  }

  function calculate(expression: string[]): string {
    let i: string = "",
      j: string = "";
    const rpnExpression: string[] = [];
    while (expression.length > 0) {
      const sign: string = expression.shift() ?? "";
      if (isOperator(sign)) {
        j = rpnExpression.pop() ?? "";
        i = rpnExpression.pop() ?? "";
        rpnExpression.push(calculateTwo(i, j, sign));
      } else {
        rpnExpression.push(sign);
      }
    }
    return rpnExpression[0];
  }

  function calculateTwo(i: string, j: string, sign: string): string {
    let arr1: Move[] = [],
      arr2: Move[] = [];
    arr1 = preprocessing(i);
    arr2 = preprocessing(j);
    switch (sign) {
      case "+":
        return simplifyfinal(arr1.concat(arr2));
      case ":":
        return simplifyfinal(arr1.concat(arr2, invert(arr1)));
      case ",":
        return simplifyfinal(arr1.concat(arr2, invert(arr1), invert(arr2)));
      default:
        return simplifyfinal(arr1.concat(arr2));
    }
  }

  function score(algValueOrigin: string): number {
    let i = "",
      j = "";
    let algValue = algValueOrigin;
    algValue = algValue.replace(/\s/gu, " ");
    algValue = algValue.replace(/\(/gu, "[");
    algValue = algValue.replace(/\)/gu, "]");
    algValue = algValue.replace(/（/gu, "[");
    algValue = algValue.replace(/）/gu, "]");
    algValue = algValue.replace(/【/gu, "[");
    algValue = algValue.replace(/】/gu, "]");
    algValue = algValue.replace(/，/gu, ",");
    algValue = `[${algValue.replace(/\+/gu, "]+[")}]`;
    algValue = algValue.replace(/\]\[/gu, "]+[");
    const expression = rpn(initializeExperssion(algValue)),
      rpnExpression: string[] = [];
    while (expression.length > 0) {
      const sign = expression.shift() ?? "";
      if (isOperator(sign)) {
        j = rpnExpression.pop() ?? "";
        i = rpnExpression.pop() ?? "";
        let inum = Number(i),
          jnum = Number(j);
        if (isNaN(inum)) {
          inum = i.split(" ").length;
        }
        if (isNaN(jnum)) {
          jnum = j.split(" ").length;
        }
        rpnExpression.push(scoreTwo(inum, jnum, sign).toString());
      } else {
        rpnExpression.push(sign);
      }
    }
    return Number(rpnExpression[0]);
  }

  function scoreTwo(i: number, j: number, sign: string): number {
    switch (sign) {
      case "+":
        return i + j;
      case ":":
        return i + j;
      case ",":
        return abMaxScore * Math.max(i, j) + abMinScore * Math.min(i, j);
      default:
        return Infinity;
    }
  }

  function sortRule(a: string, b: string): number {
    return score(a) - score(b);
  }

  function search(input: {
    algorithm: string;
    order?: number;
    initialReplace?: { [id: string]: string };
    finalReplace?: { [id: string]: string };
    commute?: { [id: string]: { class: number; priority: number } };
    outerBracket?: boolean;
    abMaxScore?: number;
    abMinScore?: number;
    maxDepth?: number;
    limit?: number;
  }): string[] {
    const algorithm = input.algorithm;
    order = Number(input.order ?? orderInit);
    outerBracket = input.outerBracket ?? outerBracketInit;
    abMaxScore = Number(input.abMaxScore ?? abMaxScoreInit);
    abMinScore = Number(input.abMinScore ?? abMinScoreInit);
    initialReplace = input.initialReplace ?? initialReplaceInit;
    finalReplace = input.finalReplace ?? finalReplaceInit;
    commute = input.commute ?? commuteInit;
    maxDepth = Number(input.maxDepth ?? maxDepthInit);
    limit = Number(input.limit ?? limitInit);
    result = [];
    if (algorithm === "") {
      return ["Empty input."];
    }
    let arr = preprocessing(algorithm);
    if (order === 0) {
      order = 2 * (maxAlgAmount + 2);
    }
    // Examples:
    // • order 4 → min -1 (e.g. cube)
    // • order 5 → min -2 (e.g. Megaminx)
    // • order 3 → min -1 (e.g. Pyraminx)
    minAmount = Math.floor(order / 2) + 1 - order;
    maxAmount = Math.floor(order / 2);
    arr = simplify(arr);
    const len = arr.length;
    if (len === 0) {
      return ["Empty input."];
    }
    let sum = 0;
    for (let i = 0; i <= len - 1; i++) {
      sum = 0;
      for (let j = 0; j <= len - 1; j++) {
        if (arr[i].base === arr[j].base) {
          sum = sum + arr[j].amount;
        }
      }
      if (sum % order !== 0) {
        return ["Not found."];
      }
    }
    let count = 0;
    const locationud: number[] = [];
    for (let i = 0; i < len - 1; i++) {
      if (arr[i].base in commute && arr[i + 1].base in commute) {
        if (commute[arr[i].base].class === commute[arr[i + 1].base].class) {
          locationud[count] = i;
          count += 1;
        }
      }
    }
    const number = 2 ** count;
    let commutatorResult = ["Not found."],
      flag = false;
    let searchDepth = 0;
    if (maxDepth === 0) {
      searchDepth = Math.floor((len - 1) / 3);
    } else {
      searchDepth = maxDepth;
    }
    for (let depth = 1; depth <= searchDepth; depth++) {
      for (let i = 0; i <= number - 1; i++) {
        const text = String(i.toString(2));
        let arrex = arr.concat();
        for (let j = 0; j < text.length; j++) {
          if (text[text.length - 1 - j] === "1") {
            arrex = swaparr(arrex, locationud[j], locationud[j] + 1);
          }
        }
        commutatorResult = commutatormain(arrex, depth, depth);
        if (commutatorResult[0] !== "Not found.") {
          flag = true;
        }
      }
      if (flag && (depth === maxDepth || maxDepth === 0)) {
        result.sort(sortRule);
        if (limit === 0) {
          return result;
        }
        return result.slice(0, limit);
      }
    }
    return ["Not found."];
  }

  function preprocessing(algValue: string): Move[] {
    let xold = algValue;
    xold = xold.replace(/\s+/giu, "");
    xold = xold.replace(/[‘]/gu, "'");
    xold = xold.replace(/[’]/gu, "'");
    if (xold === "") {
      return [];
    }
    let x = "";
    for (let i = 0; i < xold.length; i++) {
      if ((xold[i + 1] < "0" || xold[i + 1] > "9") && xold[i + 1] !== "'") {
        x = `${x + xold[i]} `;
      } else {
        x = x + xold[i];
      }
    }
    for (const i in initialReplace) {
      const re = new RegExp(i, "gu");
      const testStr = initialReplace[i].replace(/[^a-zA-Z]/gu, "").split("");
      for (const testChar of testStr) {
        if (x.indexOf(testChar) > -1) {
          x = x.replace(re, initialReplace[i]);
        }
      }
    }
    const arr1 = x.split(" ");
    const arr: Move[] = [];
    for (let i = 0; i < arr1.length; i++) {
      arr[i] = { base: arr1[i][0], amount: 0 };
      const temp = arr1[i].replace(/[^0-9]/gu, "");
      if (temp === "") {
        arr[i].amount = 1;
      } else {
        arr[i].amount = Number(temp);
      }
      if (arr[i].amount > maxAlgAmount) {
        maxAlgAmount = arr[i].amount;
      }
      if (arr1[i].indexOf("'") > -1) {
        arr[i].amount = -arr[i].amount;
      }
    }
    return arr;
  }

  function commutatorpre(
    array: Move[],
    depth: number,
    maxSubDepth: number
  ): string[] {
    let count = 0;
    const locationud: number[] = [];
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i].base in commute && array[i + 1].base in commute) {
        if (commute[array[i].base].class === commute[array[i + 1].base].class) {
          locationud[count] = i;
          count += 1;
        }
      }
    }
    const number = 2 ** count;
    let commutatorResult = ["Not found."];
    for (let i = 0; i <= number - 1; i++) {
      const text = String(i.toString(2));
      let arrex = array.concat();
      for (let j = 0; j < text.length; j++) {
        if (text[text.length - 1 - j] === "1") {
          arrex = swaparr(arrex, locationud[j], locationud[j] + 1);
        }
      }
      commutatorResult = commutatormain(arrex, depth, maxSubDepth);
      if (commutatorResult[0] !== "Not found.") {
        return commutatorResult;
      }
    }
    return ["Not found."];
  }

  function commutatormain(
    array: Move[],
    depth: number,
    maxSubDepth: number
  ): string[] {
    let arr = simplify(array),
      textOutput = "";
    const arrbak = arr.concat(),
      len = arr.length;
    if (arr.length < 3 * depth + 1) {
      return ["Not found."];
    }
    for (let d = 0; d <= (len + arr.length + 1) / 2 - 1; d++) {
      for (let drKey = 1; drKey < order; drKey++) {
        // 1, -1, 2, -2...
        const dr = ((drKey % 2) * 2 - 1) * Math.floor((drKey + 1) / 2);
        if (d === 0) {
          if (drKey > 1) {
            break;
          }
        } else {
          if (Math.abs(dr) > Math.abs(arrbak[d - 1].amount)) {
            break;
          }
          if (
            order % 2 === 1 ||
            arrbak[d - 1].amount !== Math.floor(order / 2)
          ) {
            if (
              (arrbak[d - 1].amount < 0 && dr > 0) ||
              (arrbak[d - 1].amount > 0 && dr < 0)
            ) {
              continue;
            }
          }
        }
        arr = displace(arrbak, d, dr);
        // For a b c b' a' d c' d' = a b:[c,b' a' d]
        for (let i = 1; i <= arr.length / 2 - 1; i++) {
          let minj = 0;
          if (depth === 1) {
            minj = Math.max(1, Math.ceil(arr.length / 2 - i));
          } else {
            minj = 1;
          }
          for (let j = minj; j <= arr.length / 2 - 1; j++) {
            let part1x: Move[] = [],
              part2x: Move[] = [];
            const commuteAddList1: [Move[]] = [[]],
              commuteAddList2: [Move[]] = [[]];
            if (arr[i - 1].base === arr[i + j - 1].base) {
              // For [a bx,by c bz]
              for (let ir = minAmount; ir <= maxAmount; ir++) {
                if (ir === 0) {
                  continue;
                }
                const jr = normalize(arr[i + j - 1].amount + ir);
                part1x = simplify(repeatEnd(arr.slice(0, i), ir));
                commuteAddList1.push(part1x);
                part2x = simplify(
                  invert(part1x).concat(repeatEnd(arr.slice(0, i + j), jr))
                );
                commuteAddList2.push(part2x);
              }
            } else {
              if (depth === 1 && arr[i].base !== arr[arr.length - 1].base) {
                continue;
              }
              part1x = simplify(arr.slice(0, i));
              commuteAddList1.push(part1x);
              part2x = simplify(arr.slice(i, i + j));
              commuteAddList2.push(part2x);
              let commuteCase: Move[] = [];
              if (
                arr[i - 1].base in commute &&
                arr[i + j - 1].base in commute
              ) {
                if (
                  commute[arr[i + j - 1].base].class ===
                    commute[arr[i - 1].base].class &&
                  arr[i + j - 1].base !== arr[i - 1].base
                ) {
                  // For L b R c L' b' R' c' = [L b R,c L' R]
                  commuteAddList1.push(part1x);
                  commuteCase = simplify(part2x.concat([arr[i - 1]]));
                  commuteAddList2.push(commuteCase);
                  // For L b R L c R L2 b' R2 c' = [L b R L,c R2 L']
                  if (i >= 2) {
                    if (
                      arr[i - 1].base in commute &&
                      arr[i - 2].base in commute
                    ) {
                      if (
                        commute[arr[i - 2].base].class ===
                        commute[arr[i - 1].base].class
                      ) {
                        commuteAddList1.push(part1x);
                        commuteCase = simplify(
                          part2x.concat(arr.slice(i - 2, i))
                        );
                        commuteAddList2.push(commuteCase);
                      }
                    }
                  }
                }
              }
              if (arr[i].base in commute && arr[i + j].base in commute) {
                if (
                  commute[arr[i + j].base].class ===
                    commute[arr[i].base].class &&
                  arr[i + j].base !== arr[i].base
                ) {
                  // For c R b L c' R' b' L' = [c R b R, R' L c'] = [c R L',L b R]
                  commuteCase = simplify(part1x.concat(invert([arr[i + j]])));
                  commuteAddList1.push(commuteCase);
                  commuteCase = simplify([arr[i + j]].concat(part2x));
                  commuteAddList2.push(commuteCase);
                  // For c R2 b R' L2 c' R' L' b' L' = [c R2 b L R,R2 L c'] = [c R2 L', L b R L]
                  if (arr.length >= i + j + 2) {
                    if (
                      arr[i + j].base in commute &&
                      arr[i + j + 1].base in commute
                    ) {
                      if (
                        commute[arr[i + j + 1].base].class ===
                        commute[arr[i + j].base].class
                      ) {
                        commuteCase = simplify(
                          part1x.concat(invert(arr.slice(i + j, i + j + 2)))
                        );
                        commuteAddList1.push(commuteCase);
                        commuteCase = simplify(
                          arr.slice(i + j, i + j + 2).concat(part2x)
                        );
                        commuteAddList2.push(commuteCase);
                      }
                    }
                  }
                }
              }
            }
            for (
              let commuteAddKey = 1;
              commuteAddKey < commuteAddList1.length;
              commuteAddKey++
            ) {
              part1x = commuteAddList1[commuteAddKey];
              part2x = commuteAddList2[commuteAddKey];
              const arrb = simplify(
                part2x.concat(part1x, invert(part2x), invert(part1x), arr)
              );
              let partb = "";
              if (depth > 1) {
                partb = commutatorpre(arrb, depth - 1, maxSubDepth)[0];
              } else if (arrb.length > 0) {
                continue;
              }

              if (partb !== "Not found.") {
                let part1y = part1x,
                  part2y = part2x;
                const party = simplify(part2x.concat(part1x));
                if (party.length < Math.max(part1x.length, part2x.length)) {
                  if (part1x.length <= part2x.length) {
                    // For a b c d e b' a' c' e' d' = [a b c,d e b' a'] = [a b c,d e c]
                    part1y = part1x;
                    part2y = party;
                  } else {
                    // For a b c d e b' a' d' c' e' = [a b c,d e b' a'] = [a b c d,e b' a']
                    part1y = invert(part2x);
                    part2y = party;
                  }
                }
                // For a b c b' a' d c' d' = a b:[c,b' a' d] = d:[d' a b,c]
                let part0 = simplify(repeatEnd(arrbak.slice(0, d), dr)),
                  part1 = part1y,
                  part2 = part2y;
                if (part0.length > 0 && maxSubDepth === 1) {
                  const partz = simplify(part0.concat(part2y));
                  // Avoid a b c b' a' b' c' b = b':[b a b,c], use a b:[c,b' a' b'] instead.
                  if (partz.length < part0.length - 1) {
                    part0 = partz;
                    part1 = invert(part2y);
                    part2 = part1y;
                  }
                }
                const part1Output = simplifyfinal(part1),
                  part2Output = simplifyfinal(part2),
                  part0Output = simplifyfinal(part0);
                if (part1Output === "" || part2Output === "") {
                  continue;
                }
                const text = pairToStr(
                  part0Output,
                  part1Output,
                  part2Output,
                  partb
                );
                if (textOutput === "") {
                  textOutput = text;
                }
                if (score(text) < score(textOutput)) {
                  textOutput = text;
                }
                if (depth === maxSubDepth && result.indexOf(text) === -1) {
                  result.push(text);
                }
              }
            }
          }
        }
      }
    }
    if (textOutput === "") {
      return ["Not found."];
    }
    return [textOutput];
  }

  function repeatEnd(array: Move[], attempt: number): Move[] {
    const arr = array.concat();
    if (arr.length === 0) {
      return [];
    }
    const popped = arr.pop() ?? { base: "", amount: 0 };
    if (attempt === 0) {
      return arr;
    }
    arr.push({ base: popped.base, amount: attempt });
    return arr;
  }

  function pairToStr(
    setup: string,
    commutatora: string,
    commutatorb: string,
    partb: string
  ): string {
    if (partb === "") {
      if (!outerBracket) {
        if (setup === "") {
          return `[${commutatora},${commutatorb}]`;
        }
        return `${setup}:[${commutatora},${commutatorb}]`;
      } else if (setup === "") {
        return `[${commutatora},${commutatorb}]`;
      }
      return `[${setup}:[${commutatora},${commutatorb}]]`;
    }
    if (!outerBracket) {
      if (setup === "") {
        return `[${commutatora},${commutatorb}]+${partb}`;
      }
      return `${setup}:[[${commutatora},${commutatorb}]+${partb}]`;
    } else if (setup === "") {
      return `[${commutatora},${commutatorb}]${partb}`;
    }
    return `[${setup}:[${commutatora},${commutatorb}]${partb}]`;
  }

  function displace(array: Move[], d: number, dr: number): Move[] {
    const arr = array.concat(),
      arr1 = repeatEnd(arr.slice(0, d), dr);
    return simplify(invert(arr1).concat(arr, arr1));
  }

  function invert(array: Move[]): Move[] {
    const arr: Move[] = [];
    for (let i = array.length - 1; i >= 0; i--) {
      arr.push({ base: array[i].base, amount: normalize(-array[i].amount) });
    }
    return arr;
  }

  function simplifyfinal(array: Move[]): string {
    let arr = array.concat();
    arr = simplify(arr);
    if (arr.length === 0) {
      return "";
    }
    for (let times = 0; times <= 1; times++) {
      for (let i = 0; i < arr.length - 1; i++) {
        if (!(arr[i].base in commute && arr[i + 1].base in commute)) {
          continue;
        }
        if (
          commute[arr[i].base].class === commute[arr[i + 1].base].class &&
          commute[arr[i].base].priority > commute[arr[i + 1].base].priority
        ) {
          arr = swaparr(arr, i, i + 1);
        }
      }
    }
    const arrOutput1: string[] = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].amount < 0) {
        if (arr[i].amount === -1) {
          arrOutput1[i] = `${arr[i].base}'`;
        } else {
          arrOutput1[i] = `${arr[i].base + -arr[i].amount}'`;
        }
      } else if (arr[i].amount === 1) {
        arrOutput1[i] = arr[i].base;
      } else {
        arrOutput1[i] = arr[i].base + arr[i].amount;
      }
    }
    let arrOutput = `${arrOutput1.join(" ")} `;
    for (const i in finalReplace) {
      const re = new RegExp(`${i} `, "gu");
      arrOutput = arrOutput.replace(re, `${finalReplace[i]} `);
    }
    arrOutput = arrOutput.substring(0, arrOutput.length - 1);
    return arrOutput;
  }

  function simplify(array: Move[]): Move[] {
    if (array.length === 0) {
      return [];
    }
    const arr: Move[] = [];
    for (let i = 0; i < array.length; i++) {
      const arrayAdd: Move = {
          base: array[i].base,
          amount: normalize(array[i].amount),
        },
        len = arr.length;
      if (normalize(arrayAdd.amount) === 0) {
        continue;
      }
      let hasChanged = false;
      for (let j = 1; j <= 3; j++) {
        if (arr.length >= j) {
          if (arr[len - j].base === arrayAdd.base) {
            let canCommute = true;
            if (j >= 2) {
              for (let k = 1; k <= j; k++) {
                if (!(arr[len - k].base in commute)) {
                  canCommute = false;
                  break;
                }
              }
              for (let k = 2; k <= j; k++) {
                if (
                  !(
                    arr[len - k].base in commute &&
                    arr[len - (k - 1)].base in commute
                  )
                ) {
                  canCommute = false;
                  break;
                }
                if (
                  commute[arr[len - k].base].class !==
                  commute[arr[len - (k - 1)].base].class
                ) {
                  canCommute = false;
                  break;
                }
              }
            }
            if (canCommute) {
              const x: Move = {
                base: arr[len - j].base,
                amount: normalize(arr[len - j].amount + arrayAdd.amount),
              };
              if (x.amount === 0) {
                arr.splice(-j, 1);
              } else {
                arr.splice(-j, 1, x);
              }
              hasChanged = true;
              break;
            }
          }
        }
      }
      if (!hasChanged) {
        arr[len] = arrayAdd;
      }
    }
    return arr;
  }

  function swaparr(array: Move[], index1: number, index2: number): Move[] {
    array[index1] = array.splice(index2, 1, array[index1])[0];
    return array;
  }

  function normalize(num: number): number {
    return (((num % order) + order - minAmount) % order) + minAmount;
  }

  return {
    search,
    expand,
  };
})();

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = commutator;
}