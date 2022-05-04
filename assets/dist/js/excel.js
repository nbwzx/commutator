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
                            // console.time("Time");
                            console.log(i + ":" + obj[arrayTitle[j] + i].replace('\'', ''));
                            result += '<td>' + commutator(obj[arrayTitle[j] + i].replace('\'', '')) + '</td>';
                            // console.timeEnd("Time");
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
            return "Not found.";
        }
    }
    let count = 0,
        minscoreall = 10000,
        arrex = [],
        minarr = [];
    const locationud = [];
    for (let i = 0; i < arr1.length - 1; i++) {
        const similarstr = "UD DU UE EU DE ED RM MR RL LR LM ML FS SF FB BF SB BS";
        if (similarstr.indexOf(arr1[i][0] + arr1[i + 1][0]) > -1) {
            locationud[count] = i;
            count += 1;
        }
    }
    if (count <= 4) {
        const number = 2 ** count;
        let minscore = 0;
        for (let i = 0; i <= number - 1; i++) {
            const text = String(i.toString(2));
            arrex = arr1.concat();
            for (let j = 0; j < text.length; j++) {
                if (text[text.length - 1 - j] === "1") {
                    arrex = swaparr(arrex, locationud[j], locationud[j] + 1);
                }
            }
            const part3 = conjugate(arrex),
                arr2 = simplify(inverse(part3).concat(arrex, part3)),
                penaltyFactor = 2;
            let arrtemp = arr2.concat(),
                realscore = 0;
            minscore = 1000;
            for (let j = 0; j < arrtemp.length; j++) {
                const scoreTemp = score(arrtemp);
                if (j <= arrtemp.length / 2) {
                    realscore = scoreTemp + j / (penaltyFactor + 1) + part3.length / 100;
                }
                if (j > arrtemp.length / 2) {
                    realscore = scoreTemp + penaltyFactor * (arrtemp.length - j) / (penaltyFactor + 1) + part3.length / 100;
                }
                if (realscore < minscore) {
                    minscore = realscore;
                }
                arrtemp = displace(arrtemp);
            }
            if (minscore < minscoreall) {
                minarr = arrex;
                minscoreall = minscore;
            }
        }
    } else {
        minarr = arr1;
    }
    const textOutput = commutatormain(minarr);
    if (textOutput !== "Not found.") {
        return textOutput;
    }
    const part3 = conjugate(arr1);
    arrex = simplify(inverse(part3).concat(arr1, part3));
    return commutatorpair(arrex, part3);
}

function preprocessing(algValue) {
    let x = algValue.trim();
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
    const similarstr = "UD DU UE EU DE ED RM MR RL LR LM ML FS SF FB BF SB BS",
        len1 = arr1.length;
    if (len1 > 1) {
        if (similarstr.indexOf(arr1[len1 - 2][0] + arr1[len1 - 1][0]) > -1) {
            if (arr1[len1 - 2][0] === arr1[0][0]) {
                arr1 = swaparr(arr1, len1 - 2, len1 - 1);
            }
        }
        if (similarstr.indexOf(arr1[0][0] + arr1[1][0]) > -1) {
            if (arr1[1][0] === arr1[len1 - 1][0]) {
                arr1 = swaparr(arr1, 0, 1);
            }
        }
    }
    return arr1;
}

function commutatorpair(array, part3) {
    let arr1 = array.concat(),
        minscore = 10000,
        temp = 0,
        output0b = "",
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
    for (let displaceIndex = 0; displaceIndex < lenarr1; displaceIndex++) {
        for (let i = 1; i <= lenarr1 / 2 - 1; i++) {
            for (let j = 1; j <= lenarr1 / 2 - 1; j++) {
                if (arr1[i - 1][0] === arr1[i + j - 1][0]) {
                    for (let ir = 1; ir <= 3; ir++) {
                        const jr = (readEnd(arr1[i + j - 1]) + ir) % 4;
                        const part1x = simplify(repeatEnd(arr1.slice(0, i), ir));
                        const part2x = simplify(inverse(part1x).concat(repeatEnd(arr1.slice(0, i + j), jr))),
                            party = simplify(part2x.concat(part1x));
                        let part1 = part1x,
                            part2 = part2x;
                        if (party.length < Math.max(part1x.length, part2x.length)) {
                            if (part1x.length <= part2x.length) {
                                // For a b c d e b' a' c' e' d' = [a b c,d e b' a'] = [a b c,d e c]
                                part1 = part1x;
                                part2 = party;
                            } else {
                                // For a b c d e b' a' d' c' e' = [a b c,d e b' a'] = [a b c d,e b' a']
                                part1 = inverse(part2x);
                                part2 = party;
                            }
                        }
                        const arrex = part1.concat(part2, inverse(part1), inverse(part2)),
                            arra = simplify(arrex),
                            arrb = simplify(inverse(arra).concat(arr1));
                        let partb = commutatormain(arrb);
                        if (partb !== "Not found.") {
                            const realscore0 = part1.length + part2.length + Math.min(part1.length, part2.length),
                                parta1 = simplifyfinal(part1),
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
                                realscore = partb1.split(" ").length + partb2.split(" ").length + Math.min(partb1.split(" ").length, partb2.split(" ").length) + realscore0;
                            if (realscore < minscore) {
                                output0b = array.slice(0, displaceIndex);
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
                } else {
                    const part1x = simplify(arr1.slice(0, i));
                    const part2x = simplify(inverse(part1x).concat(arr1.slice(0, i + j))),
                        party = simplify(part2x.concat(part1x));
                    let part1 = part1x,
                        part2 = part2x;
                    if (party.length < Math.max(part1x.length, part2x.length)) {
                        if (part1x.length <= part2x.length) {
                            // For a b c d e b' a' c' e' d' = [a b c,d e b' a'] = [a b c,d e c]
                            part1 = part1x;
                            part2 = party;
                        } else {
                            // For a b c d e b' a' d' c' e' = [a b c,d e b' a'] = [a b c d,e b' a']
                            part1 = inverse(part2x);
                            part2 = party;
                        }
                    }
                    const arrex = part1.concat(part2, inverse(part1), inverse(part2)),
                        arra = simplify(arrex),
                        arrb = simplify(inverse(arra).concat(arr1));
                    let partb = commutatormain(arrb);
                    if (partb !== "Not found.") {
                        const realscore0 = part1.length + part2.length + Math.min(part1.length, part2.length),
                            parta1 = simplifyfinal(part1),
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
                            realscore = partb1.split(" ").length + partb2.split(" ").length + Math.min(partb1.split(" ").length, partb2.split(" ").length) + realscore0;
                        if (realscore < minscore) {
                            output0b = array.slice(0, displaceIndex);
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
        arr1 = displace(arr1);
    }
    if (temp === 0) {
        return "Not found.";
    }
    let output0 = simplify(part3);
    if (output0b.length > 0) {
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
    let arr1 = simplify(inverse(part3).concat(arr0, part3)),
        minscore = 2000,
        mini = 0,
        realscore = 0,
        arrtemp = arr1.concat(),
        part4 = "",
        scoreMin = 1000,
        fullOutput = "";
    for (let i = 0; i < arrtemp.length; i++) {
        const scoreTemp = score(arrtemp);
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
        part4 = arr1.slice(0, mini);
        arr1 = simplify(inverse(part4).concat(arr1, part4));
    } else {
        part4 = inverse(arr1.slice(mini, arrtemp.length));
        arr1 = simplify(inverse(part4).concat(arr1, part4));
    }
    const part5 = simplify(part3.concat(part4)),
        part5Output = simplifyfinal(part5),
        lenarr1 = arr1.length;
    for (let i = 1; i <= lenarr1 / 2 - 1; i++) {
        const jmin = Math.max(1, Math.ceil((lenarr1 - 1) / 2 - i));
        for (let j = jmin; j <= lenarr1 / 2 - 1; j++) {
            if (arr1[i - 1][0] === arr1[i + j - 1][0]) {
                for (let ir = 1; ir <= 3; ir++) {
                    const jr = (readEnd(arr1[i + j - 1]) + ir) % 4;
                    const part1x = simplify(repeatEnd(arr1.slice(0, i), ir));
                    const part2x = simplify(inverse(part1x).concat(repeatEnd(arr1.slice(0, i + j), jr))),
                        party = simplify(part2x.concat(part1x));
                    let part1 = part1x,
                        part2 = part2x;
                    if (party.length < Math.max(part1x.length, part2x.length)) {
                        if (part1x.length <= part2x.length) {
                            // For a b c d e b' a' c' e' d' = [a b c,d e b' a'] = [a b c,d e c]
                            part1 = part1x;
                            part2 = party;
                        } else {
                            // For a b c d e b' a' d' c' e' = [a b c,d e b' a'] = [a b c d,e b' a']
                            part1 = inverse(part2x);
                            part2 = party;
                        }
                    }
                    const arrex = part1.concat(part2, inverse(part1), inverse(part2)),
                        arr = simplify(arrex),
                        part1Output = simplifyfinal(part1),
                        part2Output = simplifyfinal(part2);
                    if (simplify(arr.concat(inverse(arr1))).length === 0) {
                        const scoreMintemp = part1.length + part2.length + Math.min(part1.length, part2.length);
                        if (scoreMintemp < scoreMin) {
                            scoreMin = scoreMintemp;
                            fullOutput = singleOutput(part5Output, part1Output, part2Output);
                        }
                    }
                }
            } else {
                const part1x = simplify(arr1.slice(0, i));
                const part2x = simplify(inverse(part1x).concat(arr1.slice(0, i + j))),
                    party = simplify(part2x.concat(part1x));
                let part1 = part1x,
                    part2 = part2x;
                if (party.length < Math.max(part1x.length, part2x.length)) {
                    if (part1x.length <= part2x.length) {
                        // For a b c d e b' a' c' e' d' = [a b c,d e b' a'] = [a b c,d e c]
                        part1 = part1x;
                        part2 = party;
                    } else {
                        // For a b c d e b' a' d' c' e' = [a b c,d e b' a'] = [a b c d,e b' a']
                        part1 = inverse(part2x);
                        part2 = party;
                    }
                }
                const arrex = part1.concat(part2, inverse(part1), inverse(part2)),
                    arr = simplify(arrex),
                    part1Output = simplifyfinal(part1),
                    part2Output = simplifyfinal(part2);
                if (simplify(arr.concat(inverse(arr1))).length === 0) {
                    const scoreMintemp = part1.length + part2.length + Math.min(part1.length, part2.length);
                    if (scoreMintemp < scoreMin) {
                        scoreMin = scoreMintemp;
                        fullOutput = singleOutput(part5Output, part1Output, part2Output);
                    }
                }
            }
        }
    }
    if (fullOutput.length > 0) {
        return fullOutput;
    }
    return "Not found.";
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
    const str = array[array.length - 1],
        arr = array.slice(0, array.length - 1);
    const arrstr = [str];
    if (attempt === 0) {
        return arr;
    }
    if (attempt === 1) {
        return arr.concat(arrstr[0][0]);
    }
    if (attempt === 2) {
        return arr.concat(arrstr[0][0], arrstr[0][0]);
    }
    if (attempt === 3) {
        return arr.concat(arrstr[0][0], arrstr[0][0], arrstr[0][0]);
    }
    return null;
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

function score(array) {
    const arr1 = array.concat(),
        lenarr1 = arr1.length;
    let scoreMin = 1000;
    for (let i = 1; i <= lenarr1 / 2 - 1; i++) {
        const jmin = Math.max(1, Math.ceil((lenarr1 - 1) / 2 - i));
        for (let j = jmin; j <= lenarr1 / 2 - 1; j++) {
            if (arr1[i - 1][0] === arr1[i + j - 1][0]) {
                for (let ir = 1; ir <= 3; ir++) {
                    const jr = (readEnd(arr1[i + j - 1]) + ir) % 4;
                    const part1x = simplify(repeatEnd(arr1.slice(0, i), ir));
                    const part2x = simplify(inverse(part1x).concat(repeatEnd(arr1.slice(0, i + j), jr))),
                        party = simplify(part2x.concat(part1x));
                    let part1 = part1x,
                        part2 = part2x;
                    if (party.length < Math.max(part1x.length, part2x.length)) {
                        if (part1x.length <= part2x.length) {
                            // For a b c d e b' a' c' e' d' = [a b c,d e b' a'] = [a b c,d e c]
                            part1 = part1x;
                            part2 = party;
                        } else {
                            // For a b c d e b' a' d' c' e' = [a b c,d e b' a'] = [a b c d,e b' a']
                            part1 = inverse(part2x);
                            part2 = party;
                        }
                    }
                    const arrex = part1.concat(part2, inverse(part1), inverse(part2)),
                        arr = simplify(arrex);
                    if (simplify(arr.concat(inverse(arr1))).length === 0) {
                        scoreMin = Math.min(scoreMin, part1.length + part2.length + Math.min(part1.length, part2.length));
                    }
                }
            } else {
                const part1x = simplify(arr1.slice(0, i));
                const part2x = simplify(inverse(part1x).concat(arr1.slice(0, i + j))),
                    party = simplify(part2x.concat(part1x));
                let part1 = part1x,
                    part2 = part2x;
                if (party.length < Math.max(part1x.length, part2x.length)) {
                    if (part1x.length <= part2x.length) {
                        // For a b c d e b' a' c' e' d' = [a b c,d e b' a'] = [a b c,d e c]
                        part1 = part1x;
                        part2 = party;
                    } else {
                        // For a b c d e b' a' d' c' e' = [a b c,d e b' a'] = [a b c d,e b' a']
                        part1 = inverse(part2x);
                        part2 = party;
                    }
                }
                const arrex = part1.concat(part2, inverse(part1), inverse(part2)),
                    arr = simplify(arrex);
                if (simplify(arr.concat(inverse(arr1))).length === 0) {
                    scoreMin = Math.min(scoreMin, part1.length + part2.length + Math.min(part1.length, part2.length));
                }
            }
        }
    }
    return scoreMin;
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
        if (arr[i][0] === "D" && arr[i + 1][0] === "U") {
            arr = swaparr(arr, i, i + 1);
        }
        if (arr[i][0] === "B" && arr[i + 1][0] === "F") {
            arr = swaparr(arr, i, i + 1);
        }
        if (arr[i][0] === "L" && arr[i + 1][0] === "R") {
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

file.addEventListener('change', handleFile, false);