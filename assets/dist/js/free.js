"use strict";

let countResult = 0;
let result = [];

function free() {
    const algValue = String(document.getElementById("alg").value);
    countResult = 0;
    result = [];
    document.getElementById("out").innerHTML = "";
    document.getElementById("out").innerHTML = commutator(algValue);
    if (result.length > 0) {
        document.getElementById("out").innerHTML = "";
        for (let i = 0; i < result.length; i++) {
            document.getElementById("out").innerHTML = `${document.getElementById("out").innerHTML + result[i]}\n `;
        }
    }
}

function commutator(x) {
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
                } else if (arr1[j][1] === "'") {
                    sum -= 1;
                }
            }
        }
        if (sum !== 0) {
            document.getElementById("out").innerHTML = "Not found.";
            return "Not found.";
        }
    }
    for (let i = 1; i <= len1 / 4; i++) {
        const commutatorResult = commutatormain(arr1, i, i);
        if (commutatorResult !== "Not found.") {
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
    x = x.replace(/ '/gu, "'");
    return simplify(x.split(" "));
}

function commutatormain(array, depth, maxdepth) {
    const arr0 = array.concat(),
        partc = conjugate(arr0);
    let arr1 = simplify(inverse(partc).concat(arr0, partc)),
        text1 = "";
    const arrbak = arr1.concat();
    if (depth === 0) {
        if (array.length > 0) {
            return "Not found.";
        }
        return 0;
    }
    if (depth >= 1) {
        if (arr1.length < 4 * depth) {
            return "Not found.";
        }
        for (let displaceIndex = 0; displaceIndex <= arr1.length / 2 - 2; displaceIndex++) {
            // For a b c b' a' d c' d' = a b:[c,b' a' d]
            let maxi = 0;
            if (depth === 1) {
                maxi = arr1.length / 2 - 1 - displaceIndex;
            } else {
                maxi = arr1.length / 2 - 1;
            }
            for (let i = 1; i <= maxi; i++) {
                const part1x = simplify(arr1.slice(0, i));
                let minj = 0;
                if (depth === 1) {
                    minj = arr1.length / 2 - i;
                } else {
                    minj = 1;
                }
                for (let j = minj; j <= arr1.length / 2 - 1; j++) {
                    const part2x = simplify(arr1.slice(i, i + j)),
                        arra = simplify(part1x.concat(part2x, inverse(part1x), inverse(part2x))),
                        arrb = simplify(inverse(arra).concat(arr1)),
                        partb = commutatormain(arrb, depth - 1, maxdepth);
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
                        if (depth === maxdepth && result.indexOf(text1) === -1) {
                            countResult += 1;
                            result.push(text1);
                        }
                    }
                }
            }
            arr1 = displace(arr1);
        }
        if (text1 === "") {
            return "Not found.";
        }
        return text1;
    }
    return 0;
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