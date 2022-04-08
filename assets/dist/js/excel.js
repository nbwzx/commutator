"use strict";

Array.prototype.unique = function () {
    var res = [];
    var json = {};
    for (var i = 0; i < this.length; i++) {
        if (!json[this[i]]) {
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
}
var X = XLSX;
var file = document.getElementById('upfile');
var out = document.getElementById('out');
var output = '';

function handleFile(e) {
    var files = e.target.files;
    var i, f;
    for (i = 0, f = files[i]; i != files.length; ++i) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            /* DO SOMETHING WITH workbook HERE */
            var result = '';
            var tmp = X.utils.sheet_to_formulae(workbook.Sheets[workbook.SheetNames[0]]);
            var maxRowCount = 0;
            var tmpRowCount = 0;
            var arrayTitle = [];
            var obj = {};
            for (var i = 0; i < tmp.length; i++) {
                tmpRowCount = parseInt(tmp[i].split('=')[0].substr(1, tmp[i].split('=')[0].length - 1));
                if (tmpRowCount >= maxRowCount) {
                    maxRowCount = tmpRowCount;
                }
                obj[tmp[i].split('=')[0]] = tmp[i].split('=')[1];
                arrayTitle.push(tmp[i].split('=')[0].charAt(0));
            }
            arrayTitle = arrayTitle.unique(); //Array deduplication
            result += '<table class="productInfo">';
            for (var i = 1; i <= maxRowCount; i++) {
                result += '<tr>';
                for (var j = 0; j < arrayTitle.length; j++) {
                    if (obj.hasOwnProperty(arrayTitle[j] + i)) {
                        result += '<td>' + obj[arrayTitle[j] + i].replace('\'', '') + '</td>';
                        if (obj[arrayTitle[j] + i].replace('\'', '').length > 8) {
                            console.log(i + ":" + obj[arrayTitle[j] + i].replace('\'', ''));
                            result += '<td>' + commutator(obj[arrayTitle[j] + i].replace('\'', '')) + '</td>';
                        }
                    } else {
                        result += '<td></td>';
                    }
                }
                result += '</tr>';
            }
            result += '</table>';
            out.innerHTML = result;
        };
        reader.readAsBinaryString(f);
    }
}

function commutator(x) {
    const order = 4;
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
    let arr1 = simplify(x.split(" "));
    // Handle cases like R2 M2 E' R' U' R E R' U R' M2
    const similarstr = "UD DU UE EU DE ED RM MR RL LR LM ML FS SF FB BF SB BS";
    if (arr1.length > 1) {
        if (similarstr.toString().indexOf(arr1[0][0].toString() + arr1[1][0].toString()) > -1) {
            if (arr1[1][0] === arr1[arr1.length - 1][0]) {
                arr1 = swaparr(arr1, 0, 1);
            }
        }
        if (similarstr.toString().indexOf(arr1[arr1.length - 2][0].toString() + arr1[arr1.length - 1][0].toString()) > -1) {
            if (arr1[arr1.length - 2][0] === arr1[0][0]) {
                arr1 = swaparr(arr1, arr1.length - 2, arr1.length - 1);
            }
        }
    }
    return arr1;
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
                for (let k = 1; k <= 3; k++) {
                    const str2 = repeatEnd(arrtemp.concat().slice(i, i + j), k),
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
            for (let k = 1; k <= 3; k++) {
                const str2 = repeatEnd(arr1.concat().slice(i, i + j), k),
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
                    return singleOutput(part5Output, part1Output, part2Output);
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

    }
    if (setup === "") {
        return `[${commutatora},${commutatorb}]`;
    }
    return `[${setup}:[${commutatora},${commutatorb}]]`;


}

function repeatEnd(array, attempt) {
    const arr = array.concat();
    let arr2 = arr.concat().slice(arr.length - 1, arr.length),
        flag = 0;
    const str = arr2[0].toString();
    if (str.length === 2) {
        if (str[1] === "2") {
            arr2 = [str[0]];
            flag = 1;
        }
    }
    if (attempt === 1) {
        return simplify(arr);
    }
    if (attempt === 2) {
        return simplify(arr.concat(arr2));
    }
    if (attempt === 3 && flag == 0) {
        return simplify(arr.concat(arr2, arr2));
    }
    if (attempt === 3 && flag == 1) {
        return simplify(arr.concat(arr2, arr2, arr2));
    }
    return null;
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
            for (let k = 1; k <= 3; k++) {
                const str2 = repeatEnd(arr1.concat().slice(i, i + j), k),
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
    // For  R' U2 R' D R U R' D' R U R, output R' U':[U',R' D R] instead of R' U2:[R' D R,U]
    if (t > 0) {
        if (arr[t - 1].length > 1) {
            if (arr[t - 1][1].toString() === "2".toString()) {
                const output0 = simplify(arr.concat().slice(0, t)),
                    output1 = simplify(arr.concat().slice(0, t - 1).concat([arr[t - 1][0]])),
                    output2 = simplify(arr.concat().slice(0, t - 1).concat([inverseOne(arr[t - 1][0])])),
                    len0 = simplify(inverse(output0.concat()).concat(arr, output0)).length,
                    len1 = simplify(inverse(output1.concat()).concat(arr, output1)).length,
                    len2 = simplify(inverse(output2.concat()).concat(arr, output2)).length;
                if (len0 < len1 && len0 < len2) {
                    return output0;
                } else {
                    if (len1 <= len2) {
                        return output1;
                    } else {
                        return output2;
                    }
                }
            }
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
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i][0].toString() === "D".toString() && arr[i + 1][0].toString() === "U".toString()) {
            arr = swaparr(arr, i, i + 1);
        }
        if (arr[i][0].toString() === "B".toString() && arr[i + 1][0].toString() === "F".toString()) {
            arr = swaparr(arr, i, i + 1);
        }
        if (arr[i][0].toString() === "L".toString() && arr[i + 1][0].toString() === "R".toString()) {
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
        if (combineTwo(arr[i], arr[i + 1]).toString() === `${arr[i][0]}2`.toString()) {
            arr.splice(i + 2, 0, `${arr[i][0]}2`);
            arr.splice(i, 2);
            break;
        }
        if (combineTwo(arr[i], arr[i + 1]).toString() === `${arr[i][0]}'`.toString()) {
            arr.splice(i + 2, 0, `${arr[i][0]}'`);
            arr.splice(i, 2);
            break;
        }
    }
    for (let i = 0; i < arr.length - 2; i++) {
        const similarstr = "UD DU UE EU DE ED RM MR RL LR LM ML FS SF FB BF SB BS";
        if (similarstr.toString().indexOf(arr[i][0].toString() + arr[i + 1][0].toString()) > -1) {
            if (combineTwo(arr[i], arr[i + 2]).toString() === "".toString()) {
                arr.splice(i + 2, 1);
                arr.splice(i, 1);
                break;
            }
            if (combineTwo(arr[i], arr[i + 2]).toString() === arr[i][0].toString()) {
                arr.splice(i + 3, 0, arr[i][0]);
                arr.splice(i + 2, 1);
                arr.splice(i, 1);
                break;
            }
            if (combineTwo(arr[i], arr[i + 2]).toString() === `${arr[i][0]}2`.toString()) {
                arr.splice(i + 3, 0, `${arr[i][0]}2`);
                arr.splice(i + 2, 1);
                arr.splice(i, 1);
                break;
            }
            if (combineTwo(arr[i], arr[i + 2]).toString() === `${arr[i][0]}'`.toString()) {
                arr.splice(i + 3, 0, `${arr[i][0]}'`);
                arr.splice(i + 2, 1);
                arr.splice(i, 1);
                break;
            }
        }
    }
    for (let i = 0; i < arr.length - 3; i++) {
        const similarstr = "UDE DUE UED EUD DEU EDU RML MRL RLM LRM LMR MLR FSB SFB FBS BFS SBF BSF";
        if (similarstr.toString().indexOf(arr[i][0].toString() + arr[i + 1][0].toString()+ arr[i + 2][0].toString()) > -1) {
            if (combineTwo(arr[i], arr[i + 3]).toString() === "".toString()) {
                arr.splice(i + 3, 1);
                arr.splice(i, 1);
                break;
            }
            if (combineTwo(arr[i], arr[i + 3]).toString() === arr[i][0].toString()) {
                arr.splice(i + 4, 0, arr[i][0]);
                arr.splice(i + 3, 1);
                arr.splice(i, 1);
                break;
            }
            if (combineTwo(arr[i], arr[i + 3]).toString() === `${arr[i][0]}2`.toString()) {
                arr.splice(i + 4, 0, `${arr[i][0]}2`);
                arr.splice(i + 3, 1);
                arr.splice(i, 1);
                break;
            }
            if (combineTwo(arr[i], arr[i + 3]).toString() === `${arr[i][0]}'`.toString()) {
                arr.splice(i + 4, 0, `${arr[i][0]}'`);
                arr.splice(i + 3, 1);
                arr.splice(i, 1);
                break;
            }
        }
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

file.addEventListener('change', handleFile, false);