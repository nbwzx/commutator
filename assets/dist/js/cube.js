"use strict";

let countResult = 0,
    result = [];

function expand() {
    let algValue = String(document.getElementById("alg").value);
    if (algValue.toString().length === 0) {
        document.getElementById("out").innerHTML = "Empty input.";
        return;
    }
    algValue = algValue.replace(/\(/gu, "[");
    algValue = algValue.replace(/\)/gu, "]");
    algValue = algValue.replace(/（/gu, "[");
    algValue = algValue.replace(/）/gu, "]");
    algValue = algValue.replace(/【/gu, "[");
    algValue = algValue.replace(/】/gu, "]");
    algValue = algValue.replace(/，/gu, ",");
    algValue = decodeString(algValue);
    algValue = algValue.replace(/\]\[/gu, "]+[");
    const expression = rpn(initializeExperssion(algValue));
    let expandOut = "";
    if (expression === "Lack left parenthesis." || expression === "Lack right parenthesis.") {
        document.getElementById("out").innerHTML = expression;
    } else {
        expandOut = simplifyfinal(preprocessing(calculate(expression)));
        document.getElementById("out").innerHTML = expandOut;
        document.getElementById("player").setAttribute("alg", expandOut);
    }
}

function decodeString(str) {
    const reg = /\[([^[\]]+)*\](\d+)/gu;
    let decode = "";
    do {
        decode = str.replace(reg, ($0, $1, $2) => `[${$1}]`.repeat($2));
    } while (decode.match(reg));
    return decode;
}

function isOperator(val) {
    const operatorString = "+:,[]";
    return operatorString.indexOf(val) > -1;
}

function initializeExperssion(expressionOrigin) {
    const expression = expressionOrigin.replace(/\s/gu, ""),
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
        return simplifyfinal(arr1.concat(arr2, inverse(arr1)));
    case ",":
        return simplifyfinal(arr1.concat(arr2, inverse(arr1), inverse(arr2)));
    default:
        return false;
    }
}

function cube() {
    const date1 = new Date(),
        algValue = String(document.getElementById("alg").value);
    countResult = 0;
    result = [];
    document.getElementById("player").setAttribute("alg", algValue);
    document.getElementById("out").innerHTML = "";
    document.getElementById("out").innerHTML = commutator(algValue);
    const date2 = new Date(),
        date3 = (date2.getTime() - date1.getTime()) / 1000;
    if (result.length === 0) {
        document.getElementById("out").innerHTML = `${countResult} results (${date3} seconds) \n ${document.getElementById("out").innerHTML}\n `;
    } else {
        document.getElementById("out").innerHTML = `${countResult} results (${date3} seconds) \n `;
        for (let i = 0; i < result.length; i++) {
            document.getElementById("out").innerHTML = `${document.getElementById("out").innerHTML + result[i]}\n `;
        }
    }
}

function commutator(x) {
    const order = 4;
    if (x.length === 0) {
        return "Empty input.";
    }
    const arr1 = preprocessing(x),
        len1 = arr1.length;
    if (len1 === 0) {
        return "Empty input.";
    }
    for (let i = 0; i < len1 - 1; i++) {
        if (arr1[i].length > 2) {
            return "Invalid input.";
        }
    }
    let sum = 0;
    for (let i = 0; i <= len1 - 1; i++) {
        sum = 0;
        for (let j = 0; j <= len1 - 1; j++) {
            if (arr1[i][0] === arr1[j][0]) {
                if (arr1[j].length === 1) {
                    sum += 1;
                } else {
                    if (arr1[j][1] === "2") {
                        sum += 2;
                    }
                    if (arr1[j][1] === "'") {
                        sum -= 1;
                    }
                }
            }
        }
        if (sum % order !== 0) {
            document.getElementById("out").innerHTML = "Not found.";
            return "Not found.";
        }
    }
    let count = 0,
        arrex = [];
    const locationud = [];
    for (let i = 0; i < arr1.length - 1; i++) {
        const similarstr = "UD DU UE EU DE ED RM MR RL LR LM ML FS SF FB BF SB BS";
        if (similarstr.indexOf(arr1[i][0] + arr1[i + 1][0]) > -1) {
            locationud[count] = i;
            count += 1;
        }
    }
    const number = 2 ** count;
    let commutatorResult = "Not found.",
        flag = false;
    for (let ii = 1; ii <= (len1 - 1) / 3; ii++) {
        for (let i = 0; i <= number - 1; i++) {
            const text = String(i.toString(2));
            arrex = arr1.concat();
            for (let j = 0; j < text.length; j++) {
                if (text[text.length - 1 - j] === "1") {
                    arrex = swaparr(arrex, locationud[j], locationud[j] + 1);
                }
            }
            commutatorResult = commutatormain(arrex, ii, ii);
            if (commutatorResult !== "Not found.") {
                flag = true;
            }
        }
        if (flag) {
            return commutatorResult;
        }
    }
    return "Not found.";
}

function preprocessing(algValue) {
    let x = algValue.trim();
    x = x.split("").join(" ");
    x = x.replace(/\s+/igu, " ");
    x = x.replace(/[‘]/gu, "'");
    x = x.replace(/[’]/gu, "'");
    x = x.replace(/3/gu, "'");
    x = x.replace(/ '/gu, "'");
    x = x.replace(/ 2/gu, "2");
    x = x.replace(/2'/gu, "2");
    x = x.replace(/'2/gu, "2");
    if (x.indexOf("R") > -1 || x.indexOf("M") > -1) {
        x = x.replace(/r2/gu, "R2 M2");
        x = x.replace(/r'/gu, "R' M");
        x = x.replace(/r/gu, "R M'");
    }
    if (x.indexOf("L") > -1 || x.indexOf("M") > -1) {
        x = x.replace(/l2/gu, "L2 M2");
        x = x.replace(/l'/gu, "L' M'");
        x = x.replace(/l/gu, "L M");
    }
    if (x.indexOf("F") > -1 || x.indexOf("S") > -1) {
        x = x.replace(/f2/gu, "F2 S2");
        x = x.replace(/f'/gu, "F' S'");
        x = x.replace(/f/gu, "F S");
    }
    if (x.indexOf("B") > -1 || x.indexOf("S") > -1) {
        x = x.replace(/b2/gu, "B2 S2");
        x = x.replace(/b'/gu, "B' S");
        x = x.replace(/b/gu, "B S'");
    }
    if (x.indexOf("U") > -1 || x.indexOf("E") > -1) {
        x = x.replace(/u2/gu, "U2 E2");
        x = x.replace(/u'/gu, "U' E");
        x = x.replace(/u/gu, "U E'");
    }
    if (x.indexOf("D") > -1 || x.indexOf("E") > -1) {
        x = x.replace(/d2/gu, "D2 E2");
        x = x.replace(/d'/gu, "D' E'");
        x = x.replace(/d/gu, "D E");
    }
    return simplify(x.split(" "));
}

function commutatorpre(arr1, depth, maxdepth) {
    let count = 0,
        arrex = [];
    const locationud = [];
    for (let i = 0; i < arr1.length - 1; i++) {
        const similarstr = "UD DU UE EU DE ED RM MR RL LR LM ML FS SF FB BF SB BS";
        if (similarstr.indexOf(arr1[i][0] + arr1[i + 1][0]) > -1) {
            locationud[count] = i;
            count += 1;
        }
    }
    const number = 2 ** count;
    let commutatorResult = "Not found.";
    for (let i = 0; i <= number - 1; i++) {
        const text = String(i.toString(2));
        arrex = arr1.concat();
        for (let j = 0; j < text.length; j++) {
            if (text[text.length - 1 - j] === "1") {
                arrex = swaparr(arrex, locationud[j], locationud[j] + 1);
            }
        }
        commutatorResult = commutatormain(arrex, depth, maxdepth);
        if (commutatorResult !== "Not found.") {
            return commutatorResult;
        }
    }
    return "Not found.";
}

function commutatormain(array, depth, maxdepth) {
    const arr0 = array.concat(),
        partc = conjugate(arr0);
    let arr1 = simplify(inverse(partc).concat(arr0, partc)),
        text1 = "",
        text0 = "";
    const arrbak = arr1.concat();
    if (arr1.length < 3 * depth + 1) {
        return "Not found.";
    }
    // For U M' U' R U S U' R' S2 D S M D'
    for (let displaceIndex = 0; displaceIndex <= arr1.length - 1; displaceIndex++) {
        // For a b c b' a' d c' d' = a b:[c,b' a' d]
        let maxi = 0;
        if (depth === 1) {
            maxi = arr1.length / 2 - Math.max(displaceIndex, 2) + 1;
        } else {
            maxi = arr1.length / 2 - 1;
        }
        for (let i = 1; i <= maxi; i++) {
            let minj = 0;
            if (depth === 1) {
                minj = Math.max(1, Math.ceil(arr1.length / 2 - i));
            } else {
                minj = 1;
            }
            for (let j = minj; j <= arr1.length / 2 - 1; j++) {
                let irList = [];
                if (arr1[i - 1][0] === arr1[i + j - 1][0]) {
                    irList = [1, 2, 3];
                } else {
                    if (depth === 1 && combineTwo(arr1[i - 1], arr1[i + j]).length !== 0) {
                        continue;
                    }
                    irList = [-1];
                }
                for (const irKey in irList) {
                    const ir = irList[irKey];
                    let part1x = [],
                        part2x = [];
                    if (ir === -1) {
                        part1x = simplify(arr1.slice(0, i));
                        part2x = simplify(inverse(part1x).concat(arr1.slice(0, i + j)));
                    } else {
                        const jr = (readEnd(arr1[i + j - 1]) + ir) % 4;
                        part1x = simplify(repeatEnd(arr1.slice(0, i), ir));
                        part2x = simplify(inverse(part1x).concat(repeatEnd(arr1.slice(0, i + j), jr)));
                    }
                    const arra = simplify(part2x.concat(part1x, inverse(part2x), inverse(part1x))),
                        arrb = simplify(arra.concat(arr1));
                    let partb = "";
                    if (depth > 1) {
                        partb = commutatorpre(arrb, depth - 1, maxdepth);
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
                                part1y = inverse(part2x);
                                part2y = party;
                            }
                        }
                        // For a b c b' a' d c' d' = a b:[c,b' a' d] = d:[d' a b,c]
                        let part0 = simplify(partc.concat(arrbak.slice(0, displaceIndex))),
                            part1 = part1y,
                            part2 = part2y;
                        if (part0.length > 0 && maxdepth === 1) {
                            const partz = simplify(part0.concat(part2y));
                            if (partz.length < part0.length) {
                                part0 = partz;
                                part1 = inverse(part2y);
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
                        if (depth !== maxdepth) {
                            return text1;
                        }
                        if (text0 === "") {
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
        arr1 = displace(arr1);
    }
    if (text0 === "") {
        return "Not found.";
    }
    return text0;
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


function readEnd(str) {
    const len = str.length;
    if (len === 0) {
        return 0;
    }
    if (len === 1) {
        return 1;
    }
    if (len === 2) {
        if (str[1] === "2") {
            return 2;
        }
        if (str[1] === "'") {
            return 3;
        }
    }
    return null;
}

function repeatEnd(array, attempt) {
    const str = array[array.length - 1],
        arr = array.slice(0, array.length - 1),
        arrstr = [str];
    if (attempt === 0) {
        return arr;
    }
    if (attempt === 1) {
        return arr.concat(arrstr[0][0]);
    }
    if (attempt === 2) {
        return arr.concat(`${arrstr[0][0]}2`);
    }
    if (attempt === 3) {
        return arr.concat(`${arrstr[0][0]}'`);
    }
    return null;
}

function displace(array) {
    const arr = array.concat(),
        arr1 = [arr[0]];
    return simplify(inverse(arr1).concat(arr, arr1));
}

function conjugate(array) {
    const arr = array.concat();
    let minlen = arr.length,
        t = 0;
    for (let i = 1; i < array.length; i++) {
        const arr1 = arr.slice(0, i),
            arr2 = inverse(arr1),
            len = simplify(arr2.concat(arr, arr1)).length;
        if (len < minlen) {
            t = i;
            minlen = len;
        }
    }
    // For  R' U2 R' D R U R' D' R U R, output R' U':[U',R' D R] instead of R' U2:[R' D R,U]
    if (t > 0) {
        if (arr[t - 1].length > 1) {
            if (arr[t - 1][1] === "2") {
                const output0 = simplify(arr.slice(0, t)),
                    output1 = simplify(arr.slice(0, t - 1).concat([arr[t - 1][0]])),
                    output2 = simplify(arr.slice(0, t - 1).concat([inverseOne(arr[t - 1][0])])),
                    len0 = simplify(inverse(output0).concat(arr, output0)).length,
                    len1 = simplify(inverse(output1).concat(arr, output1)).length,
                    len2 = simplify(inverse(output2).concat(arr, output2)).length;
                if (len0 < len1 && len0 < len2) {
                    return output0;
                }
                if (len1 <= len2) {
                    return output1;
                }
                return output2;
            }
        }
    }
    return arr.slice(0, t);
}

function inverse(array) {
    return array.map((x) => inverseOne(x)).reverse();
}

function simplifyfinal(array) {
    let arr = array.concat();
    arr = simplify(arr);
    if (arr.length === 0) {
        return "";
    }
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i][0] === "D" && arr[i + 1][0] === "U") {
            arr = swaparr(arr, i, i + 1);
        }
        if (arr[i][0] === "B" && arr[i + 1][0] === "F") {
            arr = swaparr(arr, i, i + 1);
        }
        if (arr[i][0] === "L" && arr[i + 1][0] === "R") {
            arr = swaparr(arr, i, i + 1);
        }
        if (arr[i][0] === "E" && arr[i + 1][0] === "U") {
            arr = swaparr(arr, i, i + 1);
        }
        if (arr[i][0] === "S" && arr[i + 1][0] === "F") {
            arr = swaparr(arr, i, i + 1);
        }
        if (arr[i][0] === "M" && arr[i + 1][0] === "R") {
            arr = swaparr(arr, i, i + 1);
        }
        if (arr[i][0] === "D" && arr[i + 1][0] === "E") {
            arr = swaparr(arr, i, i + 1);
        }
        if (arr[i][0] === "B" && arr[i + 1][0] === "S") {
            arr = swaparr(arr, i, i + 1);
        }
        if (arr[i][0] === "L" && arr[i + 1][0] === "M") {
            arr = swaparr(arr, i, i + 1);
        }
    }
    let arrOutput = `${arr.join(" ")} `;
    arrOutput = arrOutput.replace(/R2 M2 /gu, "r2 ");
    arrOutput = arrOutput.replace(/R' M /gu, "r' ");
    arrOutput = arrOutput.replace(/R M' /gu, "r ");
    arrOutput = arrOutput.replace(/L2 M2 /gu, "l2 ");
    arrOutput = arrOutput.replace(/L' M' /gu, "l' ");
    arrOutput = arrOutput.replace(/L M /gu, "l ");
    arrOutput = arrOutput.replace(/F2 S2 /gu, "f2 ");
    arrOutput = arrOutput.replace(/F' S' /gu, "f' ");
    arrOutput = arrOutput.replace(/F S /gu, "f ");
    arrOutput = arrOutput.replace(/B2 S2 /gu, "b2 ");
    arrOutput = arrOutput.replace(/B' S /gu, "b' ");
    arrOutput = arrOutput.replace(/B S' /gu, "b ");
    arrOutput = arrOutput.replace(/U2 E2 /gu, "u2 ");
    arrOutput = arrOutput.replace(/U' E /gu, "u' ");
    arrOutput = arrOutput.replace(/U E' /gu, "u ");
    arrOutput = arrOutput.replace(/D2 E2 /gu, "d2 ");
    arrOutput = arrOutput.replace(/D' E' /gu, "d' ");
    arrOutput = arrOutput.replace(/D E /gu, "d ");
    arrOutput = arrOutput.replace(/M2 R2 /gu, "r2 ");
    arrOutput = arrOutput.replace(/M R' /gu, "r' ");
    arrOutput = arrOutput.replace(/M' R /gu, "r ");
    arrOutput = arrOutput.replace(/M2 L2 /gu, "l2 ");
    arrOutput = arrOutput.replace(/M' L' /gu, "l' ");
    arrOutput = arrOutput.replace(/M L /gu, "l ");
    arrOutput = arrOutput.replace(/S2 F2 /gu, "f2 ");
    arrOutput = arrOutput.replace(/S' F' /gu, "f' ");
    arrOutput = arrOutput.replace(/S F /gu, "f ");
    arrOutput = arrOutput.replace(/S2 B2 /gu, "b2 ");
    arrOutput = arrOutput.replace(/S B' /gu, "b' ");
    arrOutput = arrOutput.replace(/S' B /gu, "b ");
    arrOutput = arrOutput.replace(/E2 U2 /gu, "u2 ");
    arrOutput = arrOutput.replace(/E U' /gu, "u' ");
    arrOutput = arrOutput.replace(/E' U /gu, "u ");
    arrOutput = arrOutput.replace(/E2 D2 /gu, "d2 ");
    arrOutput = arrOutput.replace(/E' D' /gu, "d' ");
    arrOutput = arrOutput.replace(/E D /gu, "d ");
    arrOutput = arrOutput.replace(/R M2 /gu, "r M' ");
    arrOutput = arrOutput.replace(/R' M2 /gu, "r' M ");
    arrOutput = arrOutput.replace(/M2 R /gu, "r M' ");
    arrOutput = arrOutput.replace(/M2 R' /gu, "r' M ");
    arrOutput = arrOutput.substring(0, arrOutput.length - 1);
    return arrOutput;
}

function simplify(array) {
    if (array.length === 0) {
        return [];
    }
    const arr = [array[0]];
    let i = 1;
    while (i < array.length) {
        const arrayAdd = array[i],
            len = arr.length;
        if (arr.length >= 1) {
            if (combineTwo(arr[len - 1], arrayAdd).length === 0) {
                arr.splice(-1, 1);
                i += 1;
                continue;
            }
            if (combineTwo(arr[len - 1], arrayAdd) === arr[len - 1][0]) {
                arr.splice(-1, 1, arr[len - 1][0]);
                i += 1;
                continue;
            }
            if (combineTwo(arr[len - 1], arrayAdd) === `${arr[len - 1][0]}2`) {
                arr.splice(-1, 1, `${arr[len - 1][0]}2`);
                i += 1;
                continue;
            }
            if (combineTwo(arr[len - 1], arrayAdd) === `${arr[len - 1][0]}'`) {
                arr.splice(-1, 1, `${arr[len - 1][0]}'`);
                i += 1;
                continue;
            }
        }
        if (arr.length >= 2) {
            const similarstr1 = "UD DU UE EU DE ED RM MR RL LR LM ML FS SF FB BF SB BS";
            if (similarstr1.indexOf(arr[len - 2][0] + arr[len - 1][0]) > -1) {
                if (combineTwo(arr[len - 2], arrayAdd).length === 0) {
                    arr.splice(-2, 1);
                    i += 1;
                    continue;
                }
                if (combineTwo(arr[len - 2], arrayAdd) === arr[len - 2][0]) {
                    arr.splice(-2, 1, arr[len - 2][0]);
                    i += 1;
                    continue;
                }
                if (combineTwo(arr[len - 2], arrayAdd) === `${arr[len - 2][0]}2`) {
                    arr.splice(-2, 1, `${arr[len - 2][0]}2`);
                    i += 1;
                    continue;
                }
                if (combineTwo(arr[len - 2], arrayAdd) === `${arr[len - 2][0]}'`) {
                    arr.splice(-2, 1, `${arr[len - 2][0]}'`);
                    i += 1;
                    continue;
                }
            }
        }
        if (arr.length >= 3) {
            const similarstr2 = "UDE DUE UED EUD DEU EDU RML MRL RLM LRM LMR MLR FSB SFB FBS BFS SBF BSF";
            if (similarstr2.indexOf(arr[len - 3][0] + arr[len - 2][0] + arr[len - 1][0]) > -1) {
                if (combineTwo(arr[len - 3], arrayAdd).length === 0) {
                    arr.splice(-3, 1);
                    i += 1;
                    continue;
                }
                if (combineTwo(arr[len - 3], arrayAdd) === arr[len - 3][0]) {
                    arr.splice(-3, 1, arr[len - 3][0]);
                    i += 1;
                    continue;
                }
                if (combineTwo(arr[len - 3], arrayAdd) === `${arr[len - 3][0]}2`) {
                    arr.splice(-3, 1, `${arr[len - 3][0]}2`);
                    i += 1;
                    continue;
                }
                if (combineTwo(arr[len - 3], arrayAdd) === `${arr[len - 3][0]}'`) {
                    arr.splice(-3, 1, `${arr[len - 3][0]}'`);
                    i += 1;
                    continue;
                }
            }
        }
        arr[len] = arrayAdd;
        i += 1;
    }
    return arr;
}

function combineTwo(str1, str2) {
    const len1 = str1.length,
        len2 = str2.length;
    if (str1[0] === str2[0]) {
        if (len1 === 1) {
            if (len2 === 1) {
                return `${str1}2`;
            }
            if (len2 === 2) {
                if (str2[1] === "2") {
                    return `${str1}'`;
                }
                if (str2[1] === "'") {
                    return "";
                }
            }
        }
        if (len1 === 2) {
            if (str1[1] === "'") {
                if (len2 === 1) {
                    return "";
                }
                if (len2 === 2) {
                    if (str2[1] === "2") {
                        return str1[0];
                    }
                    if (str2[1] === "'") {
                        return `${str1[0]}2`;
                    }
                }
            }
            if (str1[1] === "2") {
                if (len2 === 1) {
                    return `${str1[0]}'`;
                }
                if (len2 === 2) {
                    if (str2[1] === "2") {
                        return "";
                    }
                    if (str2[1] === "'") {
                        return str1[0];
                    }
                }
            }
        }
    }
    return "0";
}

function inverseOne(str) {
    const len = str.length;
    if (len === 1) {
        return `${str}'`;
    }
    if (len === 2) {
        if (str[1] === "2") {
            return str;
        }
        if (str[1] === "'") {
            return str[0];
        }
    }
    return null;
}

function swaparr(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
}

document.getElementById("cube").addEventListener("click", cube);
document.getElementById("expand").addEventListener("click", expand);