"use strict";

let displaceIndexGlobal = 0,
    iGlobal = 0,
    part3Global = [],
    arrGlobal = [],
    canbeTwo = 0;

function free() {
    const algValue = String(document.getElementById("alg").value);
    displaceIndexGlobal = 0;
    iGlobal = 0;
    canbeTwo = 0;
    part3Global = [];
    arrGlobal = [];
    document.getElementById("out").innerHTML = "";
    commutator(algValue);
}

function commutator(x) {
    if (x.length === 0) {
        document.getElementById("out").innerHTML = "Empty input.";
        return;
    }
    const arr1 = preprocessing(x),
        len1 = arr1.length;
    if (len1 === 0) {
        document.getElementById("out").innerHTML = "Empty input.";
        return;
    }
    for (let i = 0; i < len1 - 1; i++) {
        if (arr1[i].length > 2) {
            document.getElementById("out").innerHTML = "Invalid input.";
            return;
        }
    }
    let sum = 0;
    for (let i = 0; i <= len1 - 1; i++) {
        sum = 0;
        for (let j = 0; j <= len1 - 1; j++) {
            if (arr1[i][0] === arr1[j][0]) {
                if (arr1[j].length === 1) {
                    sum += 1;
                } else if (arr1[j][1] === "'") {
                    sum -= 1;
                }
            }
        }
        if (sum !== 0) {
            document.getElementById("out").innerHTML = "Not found.";
            return;
        }
    }
    arrGlobal = arr1;
    const textOutput = commutatormain(arr1);
    if (textOutput !== "Not found.") {
        document.getElementById("out").innerHTML = textOutput;
        return;
    }
    const part3 = conjugate(arr1),
        arrex = simplify(inverse(part3).concat(arr1, part3));
    part3Global = part3;
    arrGlobal = arrex;
    countSecond();
}

function preprocessing(algValue) {
    let x = algValue.trim();
    x = x.split("").join(" ");
    x = x.replace(/\s+/igu, " ");
    x = x.replace(/[‘]/gu, "'");
    x = x.replace(/[’]/gu, "'");
    x = x.replace(/ '/gu, "'");
    return simplify(x.split(" "));
}

function commutatorpair(array, part3) {
    let arr1 = array.concat(),
        partb0 = "",
        outputb0 = "",
        outputa1 = "",
        outputa2 = "",
        outputb1 = "",
        outputb2 = "",
        text1 = "",
        commutator1 = "",
        commutator2 = "";

    const lenarr1 = arr1.length;
    if (lenarr1 < 4) {
        return "Not found.";
    }
    for (let displaceIndex = 0; displaceIndex < lenarr1 / 2; displaceIndex++) {
        for (let i = 1; i <= lenarr1 / 2 && displaceIndex >= displaceIndexGlobal; i++) {
            const str1 = arr1.slice(0, i);
            for (let j = 1; j <= lenarr1 / 2 && (i >= iGlobal || displaceIndex > displaceIndexGlobal); j++) {
                const str2 = arr1.slice(i, i + j),
                    part1x = simplify(str1),
                    part2x = simplify(str2),
                    party = simplify(part2x.concat(part1x));
                let part1 = part1x,
                    part2 = part2x;
                if (party.length < Math.max(part1x.length, part2x.length)) {
                    if (part1x.length <= part2x.length) {
                        part1 = part1x;
                        part2 = party;
                    } else {
                        part1 = inverse(part2x);
                        part2 = party;
                    }
                }
                const arrex = part1.concat(part2, inverse(part1), inverse(part2)),
                    arra = simplify(arrex),
                    arrb = simplify(inverse(arra).concat(arr1));
                let partb = commutatormain(arrb);
                if (partb !== "Not found.") {
                    const parta1 = simplifyfinal(part1),
                        parta2 = simplifyfinal(part2);
                    if (partb.split("[").length === 3) {
                        partb = partb.substring(1, partb.length - 1);
                    }
                    if (partb.indexOf(":") > -1) {
                        partb0 = partb.split(":")[0];
                    } else {
                        partb0 = "";
                    }
                    const partb1 = partb.split("[")[1].split(",")[0],
                        partb2 = partb.split(",")[1].split("]")[0],
                        output0b = array.slice(0, displaceIndex);
                    outputb0 = partb0;
                    outputa1 = parta1;
                    outputa2 = parta2;
                    outputb1 = partb1;
                    outputb2 = partb2;
                    canbeTwo = 1;
                    let output0 = simplify(part3);
                    if (output0b.length > 0) {
                        output0 = simplify(part3.concat(output0b));
                    }
                    commutator1 = singleOutput("", outputa1, outputa2);
                    commutator2 = singleOutput(outputb0, outputb1, outputb2);
                    text1 = twoOutput(simplifyfinal(output0), commutator1, commutator2);
                    displaceIndexGlobal = displaceIndex;
                    iGlobal = i + 1;
                    return text1;
                }
            }
        }
        arr1 = displace(arr1);
    }
    if (canbeTwo === 0) {
        return "Not found.";
    }
    return "";
}

function twoOutput(setup, commutator1, commutator2) {
    if (document.getElementById("settingsOuterBracket").checked === false) {
        if (setup === "") {
            return `${commutator1}+${commutator2}`;
        }
        return `${setup}:[${commutator1}+${commutator2}]`;
    }
    if (setup === "") {
        return `[${commutator1}${commutator2}]`;
    }
    return `[${setup}:${commutator1}${commutator2}]`;
}


function commutatormain(array) {
    const arr0 = array.concat(),
        part3 = conjugate(arr0);
    let arr1 = simplify(inverse(part3).concat(arr0, part3)),
        maxi = 0;
    const arrtemp = arr1.concat();
    for (let displaceIndex = 0; displaceIndex <= arr1.length / 2 - 2; displaceIndex++) {
        maxi = arr1.length / 2 - 1 - displaceIndex;
        for (let i = 0; i <= maxi; i++) {
            const part1x = simplify(arr1.slice(0, i));
            for (let j = arr1.length / 2 - i; j <= arr1.length / 2 - 1; j++) {
                const part2x = simplify(arr1.slice(i, i + j));
                const arr = simplify(part1x.concat(part2x, inverse(part1x), inverse(part2x)));
                if (simplify(arr.concat(inverse(arr1))).length === 0) {
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
                    let part0 = simplify(part3.concat(arrtemp.slice(0, displaceIndex)));
                    let part1 = part1y,
                        part2 = part2y;
                    if (part0.length > 0) {
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
                    return singleOutput(part0Output, part1Output, part2Output);
                }
            }
        }
        arr1 = displace(arr1);
    }
    return "Not found.";
}


function countSecond() {
    let outValue = 0;
    outValue = commutatorpair(arrGlobal, part3Global);
    if (outValue === "Not found.") {
        document.getElementById("out").innerHTML = "Not found.";
        return;
    }
    if (outValue !== "") {
        if (document.getElementById("out").innerHTML.indexOf(outValue) === -1) {
            document.getElementById("out").innerHTML = `${document.getElementById("out").innerHTML + outValue}\n `;
        }
        setTimeout("countSecond()", 1);
    }
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

// R2 D R U' R D' R' U R D R' U R' D' R U' R
function displace(array) {
    const arr = array.concat(),
        arr1 = [arr[0]],
        arr2 = [arr[arr.length - 1]];
    if (arr1[0][0] === arr2[0][0]) {
        return simplify(arr2.concat(arr, inverse(arr2)));
    }
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
    for (let i = 0; i < arr.length / 2; i++) {
        const temp = arr[i];
        arr[i] = array[arr.length - 1 - i];
        arr[arr.length - 1 - i] = temp;
    }
    for (let i = 0; i < arr.length; i++) {
        arr[i] = inverseOne(arr[i]);
    }
    return arr;
}

function simplifyfinal(array) {
    let arr = array.concat();
    arr = simplify(arr);
    if (arr.length === 0) {
        return "";
    }
    let arrOutput = `${arr.join(" ")} `;
    arrOutput = arrOutput.substring(0, arrOutput.length - 1);
    return arrOutput;
}

function simplify(array) {
    const arr = [array[0]];
    let i = 1;
    if (array.length === 0) {
        return [];
    }
    while (i < array.length) {
        const arrayAdd = array[i],
            len = arr.length;
        if (arr.length >= 1) {
            if (combineTwo(arr[len - 1], arrayAdd).length === 0) {
                arr.splice(-1, 1);
                i += 1;
                continue;
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
            if (len2 === 2) {
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
        if (str[1] === "'") {
            return str[0];
        }
    }
    return null;
}

document.getElementById("free").addEventListener("click", free);