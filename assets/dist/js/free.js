"use strict";

let countResult = 0,
    result = [],
    order = 0,
    minAmount = 0,
    maxAmount = 0;

function free() {
    const date1 = new Date(),
        algValue = String(document.getElementById("alg").value);
    order = Number(document.getElementById("order").value);
    countResult = 0;
    result = [];
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
    if (x.length === 0) {
        return "Empty input.";
    }
    const arr1 = preprocessing(x);
    let arr = [];
    let maxAlgAmount = 0;
    for (let i = 0; i < arr1.length; i++) {
        arr[i] = [];
        arr[i][0] = arr1[i][0];
        let temp = arr1[i].replace(/[^0-9]/ug, "");
        if (temp === ""){
            temp = 1;
        }
        arr[i][1] = Number(temp);
        if (arr[i][1] > maxAlgAmount){
            maxAlgAmount = arr[i][1];
        }
        if (arr1[i][arr1[i].length - 1] === "'") {
            arr[i][1] = -arr[i][1];
        }
    }
    if (order === 0){
        order = 2 * (maxAlgAmount + 2);
    }
    // See https://github.com/cubing/cubing.js/blob/main/src/cubing/alg/traversal.ts
    // Examples:
    // • order 4 → min -1 (e.g. cube)
    // • order 5 → min -2 (e.g. Megaminx)
    // • order 3 → min -1 (e.g. Pyraminx)
    minAmount = Math.floor(order / 2) + 1 - order;
    maxAmount = Math.floor(order / 2);
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
    let x = algValue.trim();
    x = x.replace(/\s+/igu, " ");
    x = x.replace(/[‘]/gu, "'");
    x = x.replace(/[’]/gu, "'");
    x = x.replace(/ '/gu, "'");
    return x.split(" ");
}

function commutatormain(array, depth, maxdepth) {
    const arr0 = array.concat(),
        partc = conjugate(arr0);
    let arr1 = simplify(inverse(partc).concat(arr0, partc)),
        text1 = "",
        text0 = "";
    const arrbak = arr1.concat(),
        len = arr1.length;
    if (len < 3 * depth + 1) {
        return "Not found.";
    }
    for (let d = 0; d <= len - 1; d++) {
        // For a b c b' a' d c' d' = a b:[c,b' a' d]
        let maxi = 0;
        if (depth === 1) {
            maxi = len / 2 - Math.max(d, 2) + 1;
        } else {
            maxi = len / 2 - 1;
        }
        for (let i = 1; i <= maxi; i++) {
            let minj = 0;
            if (depth === 1) {
                minj = Math.max(1, Math.ceil(len / 2 - i));
            } else {
                minj = 1;
            }
            for (let j = minj; j <= len / 2 - 1; j++) {
                let irList = [];
                if (arr1[i - 1][0] === arr1[i + j - 1][0]) {
                    // (a bx,by c bz)
                    irList = [];
                    for (let irValue = minAmount; irValue <= maxAmount; irValue++) {
                        irList.push(irValue);
                    }
                } else {
                    if (depth === 1 && arr1[i][0] !== arr1[len - 1][0]) {
                        continue;
                    }
                    irList = [""];
                }
                for (const irKey in irList) {
                    const ir = irList[irKey];
                    let part1x = [],
                        part2x = [];
                    if (ir === "") {
                        part1x = simplify(arr1.slice(0, i));
                        part2x = simplify(inverse(part1x).concat(arr1.slice(0, i + j)));
                    } else {
                        const jr = normalize(arr1[i + j - 1][1] + ir);
                        part1x = simplify(repeatEnd(arr1.slice(0, i), ir));
                        part2x = simplify(inverse(part1x).concat(repeatEnd(arr1.slice(0, i + j), jr)));
                    }
                    const arra = simplify(part2x.concat(part1x, inverse(part2x), inverse(part1x))),
                        arrb = simplify(arra.concat(arr1));
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
                                part1y = inverse(part2x);
                                part2y = party;
                            }
                        }
                        // For a b c b' a' d c' d' = a b:[c,b' a' d] = d:[d' a b,c]
                        let part0 = simplify(partc.concat(arrbak.slice(0, d))),
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

function repeatEnd(array, attempt) {
    const arr = array.slice(0, array.length - 1);
    if (attempt === 0) {
        return arr;
    }
    const x = [];
    x[0] = array[array.length - 1][0];
    x[1] = attempt;
    return arr.concat([x]);
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
    return arr.slice(0, t);
}

function inverse(array) {
    const arr = array.concat();
    for (let i = 0; i < arr.length; i++) {
        arr[i] = [array[i][0], normalize(-array[i][1])];
    }
    return arr.map((x) => x).reverse();
}

function simplifyfinal(array) {
    let arr = array.concat();
    arr = simplify(arr);
    if (arr.length === 0) {
        return "";
    }
    const arrOutput = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][1] < 0){
            if (arr[i][1] === -1){
                arrOutput[i] = `${arr[i][0]}'`;
            } else {
                arrOutput[i] = `${arr[i][0] + -arr[i][1]}'`;
            }
        } else if (arr[i][1] === 1){
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
    let i = 0;
    while (i < array.length) {
        const arrayAdd = [array[i][0], normalize(array[i][1])],
            len = arr.length;
        if (arrayAdd[1] === 0){
            i += 1;
            continue;
        }
        if (arr.length >= 1) {
            if (arr[len - 1][0] === arrayAdd[0]) {
                const x = [];
                x[0] = arr[len - 1][0];
                x[1] = normalize(arr[len - 1][1] + arrayAdd[1]);
                if (x[1] === 0){
                    arr.splice(-1, 1);
                    i += 1;
                    continue;
                } else {
                    arr.splice(-1, 1, x);
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

function normalize(num){
    return (num % order + order - minAmount) % order + minAmount;
}

document.getElementById("free").addEventListener("click", free);