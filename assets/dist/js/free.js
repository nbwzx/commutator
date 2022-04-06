"use strict";

function free() {
    const algValue = String(document.getElementById("alg").value);
    document.getElementById("alert").classList.add("invisible");
    document.getElementById("alert").innerHTML = commutator(algValue);
    document.getElementById("alert").classList.remove("invisible");
}

function commutator(x) {
    const order = 1;
    if (x.toString() === "".toString()) {
        return "Empty input.";
    }
    const arr1 = preprocessing(x);
    if (arr1.length === 0) {
        return "Empty input.";
    }
    for (let i = 0; i < arr1.length - 1; i++) {
        if (arr1[i].length > 2) {
            return "Invalid input.";
        }
    }
    let sum = 0;
    for (let i = 0; i <= arr1.length - 1; i++) {
        sum = 0;
        for (let j = 0; j <= arr1.length - 1; j++) {
            if (arr1[i][0] === arr1[j][0]) {
                if (arr1[j].length === 1) {
                    sum += 1;
                } else if (arr1[j][1] === "'") {
                    sum -= 1;
                }
            }
        }
        if (sum % order !== 0) {
            return "Not found.";
        }
    }
    const textOutput = commutatormain(arr1);
    if (textOutput.toString() !== "Not found.".toString()) {
        return textOutput;
    }
    const part3 = conjugate(arr1),
        arrex = simplify(inverse(part3.concat()).concat(arr1, part3));
    return commutatorpair(arrex, part3);
}

function preprocessing(algValue) {
    let x = "";
    x = algValue.trim();
    x = x.split("").join(" ");
    x = x.replace(/\s+/igu, " ");
    x = x.replace(/[‘]/gu, "'");
    x = x.replace(/[’]/gu, "'");
    x = x.replace(/ '/gu, "'");
    return simplify(x.split(" "));
}

function commutatorpair(array, part3) {
    let arrtemp = array.concat(),
        minscore = 10000,
        temp = 0,
        output0b = "",
        partb0 = "",
        outputb = [],
        outputb0 = "",
        outputa1 = "",
        outputa2 = "",
        outputb1 = "",
        outputb2 = "",
        text1 = "",
        commutator1 = "",
        commutator2 = "";
    const lenarr1 = arrtemp.length;
    if (lenarr1 < 4) {
        return "Not found.";
    }
    for (let displaceIndex = 0; displaceIndex < lenarr1; displaceIndex++) {
        for (let i = 1; i <= lenarr1 / 2; i++) {
            const str1 = arrtemp.concat().slice(0, i);
            for (let j = 1; j <= lenarr1 / 2; j++) {
                const str2 = arrtemp.concat().slice(i, i + j),
                    part1x = simplify(str1),
                    part2x = simplify(str2),
                    party = simplify(part2x.concat(part1x));
                let part1 = part1x,
                    part2 = part2x;
                // For U R' F R2 D' R' D R' F' R U' D' R D R', output [U R' F R,R D' R' D] instead of [U R' F R2 D' R' D,R D' R' D]
                if (party.length < Math.max(part1x.length, part2x.length)) {
                    if (part1x.length <= part2x.length) {
                        part1 = part1x;
                        part2 = party;
                    } else {
                        part1 = inverse(part2x.concat());
                        part2 = party;
                    }
                }
                const arrex = part1.concat(part2, inverse(part1.concat()), inverse(part2.concat())),
                    arra = simplify(arrex),
                    arrb = simplify(inverse(arra.concat()).concat(arrtemp));
                let partb = commutatormain(arrb);
                if (partb.toString() !== "Not found.".toString()) {
                    const realscore0 = part1.length + part2.length + Math.min(part1.length, part2.length),
                        parta1 = simplifyfinal(part1),
                        parta2 = simplifyfinal(part2);
                    if (partb.split("[").length === 3) {
                        partb = partb.substring(1, partb.length - 1);
                    }
                    if (partb.toString().indexOf(":".toString()) > -1) {
                        partb0 = partb.split(":")[0];
                    } else {
                        partb0 = "";
                    }
                    const partb1 = partb.split("[")[1].split(",")[0],
                        partb2 = partb.split(",")[1].split("]")[0],
                        realscore = partb1.split(" ").length + partb2.split(" ").length + Math.min(partb1.split(" ").length, partb2.split(" ").length) + realscore0;
                    if (realscore < minscore) {
                        if (displaceIndex === 0) {
                            output0b = "";
                        } else {
                            output0b = array.concat().slice(0, displaceIndex);
                        }
                        outputb = arrb;
                        outputb0 = partb0;
                        outputa1 = parta1;
                        outputa2 = parta2;
                        outputb1 = partb1;
                        outputb2 = partb2;
                        temp = 1;
                        minscore = realscore;
                    }
                }
            }
        }
        arrtemp = displace(arrtemp);
    }
    if (temp === 0) {
        return "Not found.";
    }
    let output0 = simplify(part3);
    if (output0b.toString() !== "".toString()) {
        output0 = simplify(part3.concat(output0b));
    }
    let output0x = "None";
    if (output0.toString() !== "".toString()) {
        output0x = simplify(output0.concat(inverse(outputb.concat())));
    }
    if (output0x.length < output0.length && output0x.toString() !== "None".toString()) {
        if (output0x.toString() === "".toString()) {
            commutator1 = singleOutput(outputb0, outputb1, outputb2);
            commutator2 = singleOutput("", outputa1, outputa2);
            text1 = twoOutput("".commutator1, commutator2);
        } else {
            const outputbarr0 = outputb0.split(":")[0].split(" "),
                output0y = simplify(output0x.concat(outputbarr0));
            if (output0y.length < output0x.length) {
                commutator1 = singleOutput("", outputb1, outputb2);
                commutator2 = singleOutput(simplifyfinal(inverse(outputbarr0.concat())), outputa1, outputa2);
                text1 = twoOutput(simplifyfinal(output0y), commutator1, commutator2);
            } else {
                commutator1 = singleOutput(outputb0, outputb1, outputb2);
                commutator2 = singleOutput("", outputa1, outputa2);
                text1 = twoOutput(simplifyfinal(output0x), commutator1, commutator2);
            }
        }
        return text1;
    }
    commutator1 = singleOutput("", outputa1, outputa2);
    commutator2 = singleOutput(outputb0, outputb1, outputb2);
    text1 = twoOutput(simplifyfinal(output0), commutator1, commutator2);
    return text1;
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
        part3 = conjugate(arr0),
        penaltyFactor = 2;
    let arr1 = simplify(inverse(part3.concat()).concat(arr0, part3)),
        minscore = 2000,
        mini = 0,
        realscore = 0,
        arrtemp = arr1.concat(),
        part4 = "";
    for (let i = 0; i < arrtemp.length; i++) {
        const scoreTemp = score(arrtemp.concat());
        if (i <= arrtemp.length / 2) {
            realscore = scoreTemp + i / (penaltyFactor + 1);
        }
        if (i > arrtemp.length / 2) {
            realscore = scoreTemp + penaltyFactor * (arrtemp.length - i) / (penaltyFactor + 1);
        }
        if (realscore < minscore) {
            mini = i;
            minscore = realscore;
        }
        arrtemp = displace(arrtemp);
    }
    if (mini <= arrtemp.length / 2) {
        part4 = arr1.concat().slice(0, mini);
        arr1 = simplify(inverse(part4.concat()).concat(arr1, part4));
    } else {
        part4 = arr1.concat().slice(mini, arrtemp.length);
        arr1 = simplify(part4.concat().concat(arr1, inverse(part4)));
    }
    const part5 = simplify(part3.concat(part4)),
        part5Output = simplifyfinal(part5),
        lenarr1 = arr1.length;
    for (let i = 1; i <= lenarr1 / 2; i++) {
        const str1 = arr1.concat().slice(0, i);
        for (let j = 1; j <= lenarr1 / 2; j++) {
            const str2 = arr1.concat().slice(i, i + j),
                part1x = simplify(str1),
                part2x = simplify(str2),
                party = simplify(part2x.concat(part1x));
            let part1 = part1x,
                part2 = part2x;
            // For U R' F R2 D' R' D R' F' R U' D' R D R', output [U R' F R,R D' R' D] instead of [U R' F R2 D' R' D,R D' R' D]
            if (party.length < Math.max(part1x.length, part2x.length)) {
                if (part1x.length <= part2x.length) {
                    part1 = part1x;
                    part2 = party;
                } else {
                    part1 = inverse(part2x.concat());
                    part2 = party;
                }
            }
            const arrex = part1.concat(part2, inverse(part1.concat()), inverse(part2.concat())),
                arr = simplify(arrex),
                part1Output = simplifyfinal(part1),
                part2Output = simplifyfinal(part2);
            if (simplify(arr.concat(inverse(arr1.concat()))).length === 0) {
                if (part5.length === 0) {
                    return `[${part1Output},${part2Output}]`;
                }
                if (part5.length > 0) {
                    return `${part5Output}:[${part1Output},${part2Output}]`;
                }
            }
        }
    }
    return "Not found.";
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
        arr1 = arr.concat().slice(0, 1),
        arr2 = arr.concat().slice(arr.length - 1, arr.length);
    let arrtemp = [];
    if (combineTwo(arr1[0], arr2[0]).toString() === "0".toString()) {
        arrtemp = arr.concat();
        arrtemp = inverse(arr1.concat()).concat(arrtemp, arr1);
        arrtemp = simplify(arrtemp);
    } else {
        arrtemp = arr.concat();
        arrtemp = arr2.concat(arrtemp, inverse(arr2.concat()));
        arrtemp = simplify(arrtemp);
    }
    return arrtemp;
}

function score(array) {
    const arr1 = array.concat(),
        lenarr1 = arr1.length,
        scoreNotFound = 1000;
    for (let i = 1; i <= lenarr1 / 2; i++) {
        const str1 = arr1.concat().slice(0, i);
        for (let j = 1; j <= lenarr1 / 2; j++) {
            const str2 = arr1.concat().slice(i, i + j),
                part1x = simplify(str1),
                part2x = simplify(str2),
                party = simplify(part2x.concat(part1x));
            let part1 = part1x,
                part2 = part2x;
            // For U R' F R2 D' R' D R' F' R U' D' R D R', output [U R' F R,R D' R' D] instead of [U R' F R2 D' R' D,R D' R' D]
            if (party.length < Math.max(part1x.length, part2x.length)) {
                if (part1x.length <= part2x.length) {
                    part1 = part1x;
                    part2 = party;
                } else {
                    part1 = inverse(part2x.concat());
                    part2 = party;
                }
            }
            const arrex = part1.concat(part2, inverse(part1.concat()), inverse(part2.concat())),
                arr = simplify(arrex);
            if (simplify(arr.concat(inverse(arr1.concat()))).length === 0) {
                return part1.length + part2.length + Math.min(part1.length, part2.length);
            }
        }
    }
    return scoreNotFound;
}

function conjugate(array) {
    const arr = array.concat();
    let minlen = arr.length,
        t = 0;
    for (let i = 1; i < array.length; i++) {
        const arr1 = arr.concat().slice(0, i),
            arr2 = inverse(arr1.concat());
        let arrtemp = arr.concat();
        arrtemp = arr2.concat(arrtemp, arr1);
        arrtemp = simplify(arrtemp);
        const len = simplify(arrtemp).length;
        if (len < minlen) {
            t = i;
            minlen = len;
        }
    }
    return arr.concat().slice(0, t);
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
    const len = array.length;
    let arr = array.concat();
    for (let i = 0; i <= len; i++) {
        arr = simple(arr);
    }
    return arr;
}

function simple(array) {
    const arr = array.concat();
    for (let i = 0; i < arr.length - 1; i++) {
        if (combineTwo(arr[i], arr[i + 1]).toString() === "".toString()) {
            arr.splice(i, 2);
            break;
        }
        if (combineTwo(arr[i], arr[i + 1]).toString() === arr[i][0].toString()) {
            arr.splice(i + 2, 0, arr[i][0]);
            arr.splice(i, 2);
            break;
        }
        if (combineTwo(arr[i], arr[i + 1]).toString() === `${arr[i][0]}'`.toString()) {
            arr.splice(i + 2, 0, `${arr[i][0]}'`);
            arr.splice(i, 2);
            break;
        }
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