"use strict";

let countResult = 0,
    result = [],
    order = 0,
    minAmount = 0,
    maxAmount = 0,
    maxAlgAmount = 0;

function expand() {
    let algValue = String(document.getElementById("alg").value);
    algValue = algValue.replace(/\(/gu, "[");
    algValue = algValue.replace(/\)/gu, "]");
    algValue = algValue.replace(/（/gu, "[");
    algValue = algValue.replace(/）/gu, "]");
    algValue = algValue.replace(/【/gu, "[");
    algValue = algValue.replace(/】/gu, "]");
    algValue = algValue.replace(/，/gu, ",");
    algValue = algValue.replace(/\]\[/gu, "]+[");
    preprocessing(algValue);
    order = Number(document.getElementById("order").value);
    if (order === 0) {
        order = 2 * (maxAlgAmount + 2);
    }
    // See https://github.com/cubing/cubing.js/blob/main/src/cubing/alg/traversal.ts
    // Examples:
    // • order 4 → min -1 (e.g. cube)
    // • order 5 → min -2 (e.g. Megaminx)
    // • order 3 → min -1 (e.g. Pyraminx)
    minAmount = Math.floor(order / 2) + 1 - order;
    maxAmount = Math.floor(order / 2);
    if (algValue.toString().length === 0) {
        document.getElementById("out").innerHTML = "Empty input.";
        return;
    }
    const expression = rpn(initializeExperssion(algValue));
    let expandOut = "";
    if (expression === "Lack left parenthesis." || expression === "Lack right parenthesis.") {
        document.getElementById("out").innerHTML = expression;
    } else {
        expandOut = simplifyfinal(preprocessing(calculate(expression)));
        document.getElementById("out").innerHTML = expandOut;
    }
}

function isOperator(val) {
    const operatorString = "+:,[]";
    return operatorString.indexOf(val) > -1;
}

function initializeExperssion(expressionOrigin) {
    const expression = expressionOrigin.replace(/\s/gu, " "),
        inputStack = [];
    inputStack.push(expression[0]);
    for (let i = 1; i < expression.length; i++) {
        if (isOperator(expression[i]) || isOperator(inputStack.slice(-1))) {
            inputStack.push(expression[i]);
        } else {
            inputStack.push(inputStack.pop() + expression[i]);
        }
    }
    return inputStack;
}

function operatorLevel(operator) {
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
    return null;
}

function rpn(inputStack) {
    // Reverse Polish Notation
    const outputStack = [],
        operatorStack = [];
    let match = false,
        tempOperator = "";
    while (inputStack.length > 0) {
        const sign = inputStack.shift();
        if (!isOperator(sign)) {
            outputStack.push(sign);
        } else if (operatorLevel(sign) === 4) {
            match = false;
            while (operatorStack.length > 0) {
                tempOperator = operatorStack.pop();
                if (tempOperator === "[") {
                    match = true;
                    break;
                } else {
                    outputStack.push(tempOperator);
                }
            }
            if (match === false) {
                return "Lack left parenthesis.";
            }
        } else {
            while (operatorStack.length > 0 && operatorStack.slice(-1).toString() !== "[".toString() && operatorLevel(sign) <= operatorLevel(operatorStack.slice(-1))) {
                outputStack.push(operatorStack.pop());
            }
            operatorStack.push(sign);
        }
    }
    while (operatorStack.length > 0) {
        tempOperator = operatorStack.pop();
        if (tempOperator === "[") {
            return "Lack right parenthesis.";
        }
        outputStack.push(tempOperator);
    }
    return outputStack;
}

function calculate(expression) {
    let i = 0,
        j = 0;
    const rpnExpression = [];
    while (expression.length > 0) {
        const sign = expression.shift();
        if (isOperator(sign)) {
            j = rpnExpression.pop();
            i = rpnExpression.pop();
            rpnExpression.push(calculateTwo(i, j, sign));
        } else {
            rpnExpression.push(sign);
        }
    }
    return rpnExpression[0];
}

function calculateTwo(i, j, sign) {
    let arr1 = [],
        arr2 = [];
    if (typeof i !== "undefined") {
        arr1 = preprocessing(i);
    }
    if (typeof j !== "undefined") {
        arr2 = preprocessing(j);
    }
    switch (sign) {
    case "+":
        return simplifyfinal(arr1.concat(arr2));
    case ":":
        return simplifyfinal(arr1.concat(arr2, invert(arr1)));
    case ",":
        return simplifyfinal(arr1.concat(arr2, invert(arr1), invert(arr2)));
    default:
        return false;
    }
}

function free() {
    const date1 = new Date(),
        algValue = String(document.getElementById("alg").value);
    order = Number(document.getElementById("order").value);
    document.getElementById("out").innerHTML = "";
    document.getElementById("out").innerHTML = commutator(algValue);
    const date2 = new Date(),
        date3 = (date2.getTime() - date1.getTime()) / 1000;
    if (result.length === 0) {
        document.getElementById("out").innerHTML = `${countResult} results (${date3} seconds) \n ${document.getElementById("out").innerHTML}\n `;
    } else {
        document.getElementById("out").innerHTML = `${countResult} results (${date3} seconds) \n `;
        result.sort(sortRule);
        for (let i = 0; i < result.length; i++) {
            document.getElementById("out").innerHTML = `${document.getElementById("out").innerHTML + result[i]}\n `;
        }
    }
}

function score(algValueOrigin) {
    let i = 0,
        j = 0;
    let algValue = algValueOrigin.replace(/\(/gu, "[");
    algValue = algValue.replace(/\)/gu, "]");
    algValue = algValue.replace(/（/gu, "[");
    algValue = algValue.replace(/）/gu, "]");
    algValue = algValue.replace(/【/gu, "[");
    algValue = algValue.replace(/】/gu, "]");
    algValue = algValue.replace(/，/gu, ",");
    algValue = algValue.replace(/\]\[/gu, "]+[");
    const expression = rpn(initializeExperssion(algValue)),
        rpnExpression = [];
    while (expression.length > 0) {
        const sign = expression.shift();
        if (isOperator(sign)) {
            j = rpnExpression.pop();
            i = rpnExpression.pop();
            if (isNaN(i) === true) {
                i = i.split(" ").length;
            }
            if (isNaN(j) === true) {
                j = j.split(" ").length;
            }
            rpnExpression.push(scoreTwo(i, j, sign));
        } else {
            rpnExpression.push(sign);
        }
    }
    return rpnExpression[0];
}

function scoreTwo(i, j, sign) {
    const cScore = 1;
    let abMaxScore = 2.5,
        abMinScore = 5;
    if (document.getElementById("settingsSortScorea").value !== "") {
        abMaxScore = document.getElementById("settingsSortScorea").value;
    }
    if (document.getElementById("settingsSortScoreb").value !== "") {
        abMinScore = document.getElementById("settingsSortScoreb").value;
    }
    switch (sign) {
    case "+":
        return i + j;
    case ":":
        return cScore * i + j;
    case ",":
        return abMaxScore * Math.max(i, j) + abMinScore * Math.min(i, j);
    default:
        return false;
    }
}

function sortRule(a, b) {
    return score(a) - score(b);
}

function commutator(x) {
    countResult = 0;
    result = [];
    if (x.length === 0) {
        return "Empty input.";
    }
    let arr = preprocessing(x);
    if (order === 0) {
        order = 2 * (maxAlgAmount + 2);
    }
    // See https://github.com/cubing/cubing.js/blob/main/src/cubing/alg/traversal.ts
    // Examples:
    // • order 4 → min -1 (e.g. cube)
    // • order 5 → min -2 (e.g. Megaminx)
    // • order 3 → min -1 (e.g. Pyraminx)
    minAmount = Math.floor(order / 2) + 1 - order;
    arr = simplify(arr);
    const len = arr.length;
    if (len === 0) {
        return "Empty input.";
    }
    let sum = 0;
    for (let i = 0; i <= len - 1; i++) {
        sum = 0;
        for (let j = 0; j <= len - 1; j++) {
            if (arr[i][0] === arr[j][0]) {
                sum = sum + arr[j][1];
            }
        }
        if (sum % order !== 0) {
            document.getElementById("out").innerHTML = "Not found.";
            return "Not found.";
        }
    }
    for (let i = 1; i <= (len - 1) / 3; i++) {
        const commutatorResult = commutatormain(arr, i, i);
        if (commutatorResult !== "Not found.") {
            return commutatorResult;
        }
    }
    return "Not found.";
}

function preprocessing(algValue) {
    let xold = algValue.trim();
    xold = xold.replace(/\s+/igu, "");
    xold = xold.replace(/[‘]/gu, "'");
    xold = xold.replace(/[’]/gu, "'");
    if (xold.length === 0) {
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
    const arr1 = x.split(" ");
    const arr = [];
    for (let i = 0; i < arr1.length; i++) {
        arr[i] = [];
        arr[i][0] = arr1[i][0];
        let temp = arr1[i].replace(/[^0-9]/ug, "");
        if (temp === "") {
            temp = 1;
        }
        arr[i][1] = Number(temp);
        if (arr[i][1] > maxAlgAmount) {
            maxAlgAmount = arr[i][1];
        }
        if (arr1[i].indexOf("'") > -1) {
            arr[i][1] = -arr[i][1];
        }
    }
    return arr;
}

function commutatormain(array, depth, maxdepth) {
    let arr1 = simplify(array),
        text1 = "",
        text0 = "";
    const arrbak = arr1.concat(),
        len = arr1.length;
    if (arr1.length < 3 * depth + 1) {
        return "Not found.";
    }
    for (let d = 0; d <= (len + arr1.length + 1) / 2 - 1; d++) {
        for (let drKey = 1; drKey < order; drKey++) {
            // 1, -1, 2, -2...
            const dr = (drKey % 2 * 2 - 1) * Math.floor((drKey + 1) / 2);
            if (d === 0) {
                if (drKey > 1) {
                    break;
                }
            } else {
                if (Math.abs(dr) > Math.abs(arrbak[d - 1][1])) {
                    break;
                }
                if (order % 2 === 1 || arrbak[d - 1][1] !== Math.floor(order / 2)) {
                    if (arrbak[d - 1][1] < 0 && dr > 0 || arrbak[d - 1][1] > 0 && dr < 0) {
                        continue;
                    }
                }
            }
            arr1 = displace(arrbak, d, dr);
            // For a b c b' a' d c' d' = a b:[c,b' a' d]
            for (let i = 1; i <= arr1.length / 2 - 1; i++) {
                let minj = 0;
                if (depth === 1) {
                    minj = Math.max(1, Math.ceil(arr1.length / 2 - i));
                } else {
                    minj = 1;
                }
                for (let j = minj; j <= arr1.length / 2 - 1; j++) {
                    let part1x = [],
                        part2x = [];
                    const commuteAddList1 = [],
                        commuteAddList2 = [];
                    if (arr1[i - 1][0] === arr1[i + j - 1][0]) {
                        // For [a bx,by c bz]
                        for (let ir = minAmount; ir <= maxAmount; ir++) {
                            if (ir === 0) {
                                continue;
                            }
                            const jr = normalize(arr1[i + j - 1][1] + ir);
                            part1x = simplify(repeatEnd(arr1.slice(0, i), ir));
                            commuteAddList1.push(part1x);
                            part2x = simplify(invert(part1x).concat(repeatEnd(arr1.slice(0, i + j), jr)));
                            commuteAddList2.push(part2x);
                        }
                    } else {
                        if (depth === 1 && arr1[i][0] !== arr1[arr1.length - 1][0]) {
                            continue;
                        }
                        part1x = simplify(arr1.slice(0, i));
                        commuteAddList1.push(part1x);
                        part2x = simplify(arr1.slice(i, i + j));
                        commuteAddList2.push(part2x);
                    }
                    for (const commuteAddKey in commuteAddList1) {
                        part1x = commuteAddList1[commuteAddKey];
                        part2x = commuteAddList2[commuteAddKey];
                        const arrb = simplify(part2x.concat(part1x, invert(part2x), invert(part1x), arr1));
                        let partb = "";
                        if (depth > 1) {
                            partb = commutatormain(arrb, depth - 1, maxdepth);
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
                            if (part0.length > 0 && maxdepth === 1) {
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
                            if (depth === 1) {
                                text1 = singleOutput(part0Output, part1Output, part2Output);
                            } else {
                                text1 = multiOutput(part0Output, part1Output, part2Output, partb);
                            }
                            if (text0 === "") {
                                text0 = text1;
                            }
                            if (score(text1) < score(text0)) {
                                text0 = text1;
                            }
                            if (depth === maxdepth && result.indexOf(text1) === -1) {
                                countResult += 1;
                                result.push(text1);
                            }
                        }
                    }
                }
            }
        }
    }
    if (text0 === "") {
        return "Not found.";
    }
    return text0;
}

function repeatEnd(array, attempt) {
    const arr = array.concat();
    if (arr.length === 0) {
        return [];
    }
    const popped = arr.pop();
    if (attempt === 0) {
        return arr;
    }
    arr.push([popped[0], attempt]);
    return arr;
}

function multiOutput(setup, commutatora, commutatorb, partb) {
    if (document.getElementById("settingsOuterBracket").checked === false) {
        if (setup === "") {
            return `[${commutatora},${commutatorb}]+${partb}`;
        }
        return `${setup}:[[${commutatora},${commutatorb}]+${partb}]`;
    } else if (setup === "") {
        return `[${commutatora},${commutatorb}]${partb}`;
    }
    return `[${setup}:[${commutatora},${commutatorb}]${partb}]`;
}

function singleOutput(setup, commutatora, commutatorb) {
    if (document.getElementById("settingsOuterBracket").checked === false) {
        if (setup === "") {
            return `[${commutatora},${commutatorb}]`;
        }
        return `${setup}:[${commutatora},${commutatorb}]`;
    } else if (setup === "") {
        return `[${commutatora},${commutatorb}]`;
    }
    return `[${setup}:[${commutatora},${commutatorb}]]`;
}

function displace(array, d, dr) {
    const arr = array.concat(),
        arr1 = repeatEnd(arr.slice(0, d), dr);
    return simplify(invert(arr1).concat(arr, arr1));
}

function invert(array) {
    const arr = [];
    for (let i = array.length - 1; i >= 0; i--) {
        arr.push([array[i][0], normalize(-array[i][1])]);
    }
    return arr;
}

function simplifyfinal(array) {
    let arr = array.concat();
    arr = simplify(arr);
    if (arr.length === 0) {
        return "";
    }
    const arrOutput = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][1] < 0) {
            if (arr[i][1] === -1) {
                arrOutput[i] = `${arr[i][0]}'`;
            } else {
                arrOutput[i] = `${arr[i][0] + -arr[i][1]}'`;
            }
        } else if (arr[i][1] === 1) {
            arrOutput[i] = arr[i][0];
        } else {
            arrOutput[i] = arr[i][0] + arr[i][1];
        }
    }
    return arrOutput.join(" ");
}

function simplify(array) {
    if (array.length === 0) {
        return [];
    }
    const arr = [];
    for (let i = 0; i < array.length; i++) {
        const arrayAdd = [array[i][0], normalize(array[i][1])],
            len = arr.length;
        if (arrayAdd[1] === 0) {
            continue;
        }
        if (len >= 1) {
            if (arr[len - 1][0] === arrayAdd[0]) {
                const x = [arr[len - 1][0], normalize(arr[len - 1][1] + arrayAdd[1])];
                if (x[1] === 0) {
                    arr.pop();
                } else {
                    arr[len - 1] = x;
                }
                continue;
            }
        }
        arr.push(arrayAdd);
    }
    return arr;
}

function normalize(num) {
    return (num % order + order - minAmount) % order + minAmount;
}

document.getElementById("free").addEventListener("click", free);
document.getElementById("expand").addEventListener("click", expand);