/*!
 * Commutator (https://github.com/nbwzx/commutator)
 * Copyright (c) 2022-2025 Zixing Wang <zixingwang.cn@gmail.com>
 * Licensed under MIT (https://github.com/nbwzx/commutator/blob/main/LICENSE)
 */
/* eslint-disable no-misleading-character-class */
/* eslint-disable no-control-regex */
var commutator = (function () {
    var MAX_INT = 4294967295;
    var orderInit = 4, outerBracketInit = false, abMaxScoreInit = 2.5, abMinScoreInit = 5, addScoreInit = 1, maxDepthInit = 0, limitInit = 0, fastInit = false, slashNotationInit = false, noBracketsInit = false, spaceAfterColonInit = false, spaceAfterCommaInit = false, outerBracketsInit = false;
    var commuteInit = {
        U: { "class": 1, priority: 1 },
        u: { "class": 1, priority: 2 },
        E: { "class": 1, priority: 3 },
        D: { "class": 1, priority: 4 },
        d: { "class": 1, priority: 5 },
        R: { "class": 2, priority: 1 },
        r: { "class": 2, priority: 2 },
        M: { "class": 2, priority: 3 },
        L: { "class": 2, priority: 4 },
        l: { "class": 2, priority: 5 },
        F: { "class": 3, priority: 1 },
        f: { "class": 3, priority: 2 },
        S: { "class": 3, priority: 3 },
        B: { "class": 3, priority: 4 },
        b: { "class": 3, priority: 5 }
    };
    var initialReplaceInit = {
        Rw2: "r2",
        "Rw'": "r'",
        Rw: "r",
        Lw2: "l2",
        "Lw'": "l'",
        Lw: "l",
        Fw2: "f2",
        "Fw'": "f'",
        Fw: "f",
        Bw2: "b2",
        "Bw'": "b'",
        Bw: "b",
        Uw2: "u2",
        "Uw'": "u'",
        Uw: "u",
        Dw2: "d2",
        "Dw'": "d'",
        Dw: "d",
        r2: "R2 M2",
        "r'": "R' M",
        r: "R M'",
        l2: "M2 L2",
        "l'": "M' L'",
        l: "M L",
        f2: "F2 S2",
        "f'": "F' S'",
        f: "F S",
        b2: "S2 B2",
        "b'": "S B'",
        b: "S' B",
        u2: "U2 E2",
        "u'": "U' E",
        u: "U E'",
        d2: "E2 D2",
        "d'": "E' D'",
        d: "E D"
    };
    var finalReplaceInit = {
        "R2 M2": "r2",
        "R' M": "r'",
        "R M'": "r",
        "M2 L2": "l2",
        "M' L'": "l'",
        "M L": "l",
        "F2 S2": "f2",
        "F' S'": "f'",
        "F S": "f",
        "S2 B2": "b2",
        "S B'": "b'",
        "S' B": "b",
        "U2 E2": "u2",
        "U' E": "u'",
        "U E'": "u",
        "E2 D2": "d2",
        "E' D'": "d'",
        "E D": "d",
        "M2 R2": "r2",
        "M R'": "r'",
        "M' R": "r",
        "L2 M2": "l2",
        "L' M'": "l'",
        "L M": "l",
        "S2 F2": "f2",
        "S' F'": "f'",
        "S F": "f",
        "B2 S2": "b2",
        "B' S": "b'",
        "B S'": "b",
        "E2 U2": "u2",
        "E U'": "u'",
        "E' U": "u",
        "D2 E2": "d2",
        "D' E'": "d'",
        "D E": "d",
        "R M2": "r M'",
        "R' M2": "r' M",
        "M2 R": "r M'",
        "M2 R'": "r' M",
        "U2 E": "U' u'",
        "U2 E'": "U u",
        "E U2": "U' u'",
        "E' U2": "U u",
        "U E2": "U' u2",
        "U' E2": "U u2",
        "E2 U": "U' u2",
        "E2 U'": "U u2"
    };
    var result = [], order = orderInit, minAmount = Math.floor(orderInit / 2) + 1 - orderInit, maxAmount = Math.floor(orderInit / 2), maxAlgAmount = 0, isOrderZero = false, outerBracket = outerBracketInit, abMaxScore = abMaxScoreInit, abMinScore = abMinScoreInit, addScore = addScoreInit, fast = fastInit, slashNotation = slashNotationInit, noBrackets = noBracketsInit, spaceAfterColon = spaceAfterColonInit, spaceAfterComma = spaceAfterCommaInit, outerBrackets = outerBracketsInit;
    var commute = commuteInit, initialReplace = initialReplaceInit, finalReplace = finalReplaceInit;
    function clean(input) {
        // Implements the internationalized string preparation algorithm from RFC 4518
        var string = input;
        string = string.replace(/[\u00ad\u1806\u034f\u180b-\u180d\ufe0f-\uff00\ufffc]+/gu, "");
        string = string.replace(/[\u0009\u000a\u000b\u000c\u000d\u0085]/gu, " ");
        string = string.replace(/[\u0000-\u0008\u000e-\u001f\u007f-\u0084\u0086-\u009f\u06dd\u070f\u180e\u200c-\u200f\u202a-\u202e\u2060-\u2063\u206a-\u206f\ufeff\ufff9-\ufffb]+/gu, "");
        string = string.replace(/\u200b/gu, "");
        string = string.replace(/[\u00a0\u1680\u2000-\u200a\u2028-\u2029\u202f\u205f\u3000]/gu, " ");
        string = string.replace(/[\u061c\u115f\u1160\u17b4\u17b5\u2064\u2800\u3164\uffa0]/gu, " ");
        // Specifically for this project
        string = string.replace(/[!！]/gu, " ");
        string = string.replace(/\s+/gu, " ");
        string = string.trim();
        var non_standard_characters = {
            "'": "｀΄＇ˈˊᑊˋꞌᛌ‘’՚‛՝`′׳´ʹ˴ߴ‵ߵʻʼ᾽ʽ῾ʾ᾿ʿ",
            ",": "¸ꓹ‚؍٫，",
            "/": "⁄Ⳇ⟋ノ╱〳∕⧸",
            ":": "︰∶:᛬⁚܃：ꓽ׃։ː꞉܄˸;",
            "(": "（{",
            ")": "）}",
            "[": "【",
            "]": "】",
            "+": "𐊛+᛭",
            "*": "×"
        };
        for (var standard_char in non_standard_characters) {
            var chars = non_standard_characters[standard_char];
            for (var i = 0; i < chars.length; i++) {
                var char = chars[i];
                string = string.replace(char, standard_char);
            }
        }
        return string;
    }
    function expand(input) {
        var _a, _b, _c, _d;
        order = (_a = input.order) !== null && _a !== void 0 ? _a : orderInit;
        initialReplace = (_b = input.initialReplace) !== null && _b !== void 0 ? _b : initialReplaceInit;
        finalReplace = (_c = input.finalReplace) !== null && _c !== void 0 ? _c : finalReplaceInit;
        commute = (_d = input.commute) !== null && _d !== void 0 ? _d : commuteInit;
        var algorithm = clean(input.algorithm);
        algorithm = algorithm
            .replace(/\*\s/gu, "*")
            .replace(/\s\*/gu, "*")
            .replace(/:\s/gu, ":")
            .replace(/\s:/gu, ":")
            .replace(/\[\s/gu, "[")
            .replace(/\s\[/gu, "[")
            .replace(/\]\s/gu, "]")
            .replace(/\s\]/gu, "]")
            .replace(/,\s/gu, ",")
            .replace(/\s,/gu, ",")
            .replace(/\+\s/gu, "+")
            .replace(/\s\+/gu, "+")
            .replace(/\*2/gu, "2");
        for (var i = algorithm.length - 1; i > 1; i--) {
            if (algorithm[i] === "2" && algorithm[i - 1] === ")") {
                var j = i - 1;
                while (algorithm[j] !== "(" && j >= 0) {
                    j--;
                }
                if (j >= 0) {
                    algorithm =
                        algorithm.slice(0, j) +
                            algorithm.slice(j + 1, i - 1) +
                            algorithm.slice(j + 1, i - 1) +
                            algorithm.slice(i + 1);
                    break;
                }
            }
        }
        for (var i = algorithm.length - 1; i > 1; i--) {
            if (algorithm[i] === "2" && algorithm[i - 1] === "]") {
                var j = i - 1;
                while (algorithm[j] !== "[" && j >= 0) {
                    j--;
                }
                if (j >= 0) {
                    algorithm =
                        algorithm.slice(0, j) +
                            algorithm.slice(j + 1, i - 1) +
                            algorithm.slice(j + 1, i - 1) +
                            algorithm.slice(i + 1);
                    break;
                }
            }
        }
        algorithm = algorithm.replace(/\(/gu, "");
        algorithm = algorithm.replace(/\)/gu, "");
        algorithm = "[".concat(algorithm.replace(/\+/gu, "]+["), "]");
        algorithm = algorithm.replace(/\]\[/gu, "]+[");
        if (order === 0) {
            isOrderZero = true;
            order = MAX_INT;
        }
        else {
            isOrderZero = false;
        }
        // Examples:
        // • order 4 → min -1 (e.g. cube)
        // • order 5 → min -2 (e.g. Megaminx)
        // • order 3 → min -1 (e.g. Pyraminx)
        minAmount = Math.floor(order / 2) + 1 - order;
        maxAmount = Math.floor(order / 2);
        var rpnStack = rpn(initStack(algorithm));
        if (rpnStack[0] === "Lack left parenthesis." ||
            rpnStack[0] === "Lack right parenthesis.") {
            return rpnStack[0];
        }
        var calcTemp = calc(rpnStack);
        if (calcTemp === "") {
            return "";
        }
        var expandOutput = arrayToStr(algToArray(calcTemp));
        if (expandOutput === "") {
            return "";
        }
        return expandOutput;
    }
    function isOperator(sign) {
        var operatorString = "+:,/[]";
        return operatorString.indexOf(sign) > -1;
    }
    function initStack(algorithm) {
        var stack = [algorithm[0]];
        for (var i = 1; i < algorithm.length; i++) {
            if (isOperator(algorithm[i]) || isOperator(stack.slice(-1)[0])) {
                stack.push(algorithm[i]);
            }
            else {
                stack.push(stack.pop() + algorithm[i]);
            }
        }
        return stack;
    }
    function operatorLevel(operator) {
        if (operator === ":") {
            return 0;
        }
        if (operator === ",") {
            return 1;
        }
        if (operator === "/") {
            return 2;
        }
        if (operator === "+") {
            return 3;
        }
        if (operator === "[") {
            return 4;
        }
        if (operator === "]") {
            return 5;
        }
        return -1;
    }
    function rpn(stackInput) {
        // Reverse Polish Notation
        var stackOutput = [], operatorStack = [];
        var isMatch = false, operatorStackPop = "";
        while (stackInput.length > 0) {
            var sign = stackInput.shift();
            if (!isOperator(sign)) {
                stackOutput.push(sign);
            }
            else if (sign === "]") {
                isMatch = false;
                while (operatorStack.length > 0) {
                    operatorStackPop = operatorStack.pop();
                    if (operatorStackPop === "[") {
                        isMatch = true;
                        break;
                    }
                    else {
                        stackOutput.push(operatorStackPop);
                    }
                }
                if (!isMatch) {
                    return ["Lack left parenthesis."];
                }
            }
            else {
                while (operatorStack.length > 0 &&
                    operatorStack.slice(-1)[0] !== "[" &&
                    operatorLevel(sign) <= operatorLevel(operatorStack.slice(-1)[0])) {
                    stackOutput.push(operatorStack.pop());
                }
                operatorStack.push(sign);
            }
        }
        while (operatorStack.length > 0) {
            operatorStackPop = operatorStack.pop();
            if (operatorStackPop === "[") {
                return ["Lack right parenthesis."];
            }
            stackOutput.push(operatorStackPop);
        }
        return stackOutput;
    }
    function calc(stack) {
        var _a;
        var calcOutput = [];
        while (stack.length > 0) {
            var sign = stack.shift();
            if (isOperator(sign)) {
                if (calcOutput.length >= 2) {
                    var calcPop2 = calcOutput.pop();
                    var calcPop1 = calcOutput.pop();
                    calcOutput.push(calcTwo(calcPop1, calcPop2, sign));
                }
                else {
                    return "";
                }
            }
            else {
                calcOutput.push(sign);
            }
        }
        return (_a = calcOutput[0]) !== null && _a !== void 0 ? _a : "";
    }
    function calcTwo(algorithm1, algorithm2, sign) {
        var array1 = [], array2 = [];
        array1 = algToArray(algorithm1);
        array2 = algToArray(algorithm2);
        switch (sign) {
            case "+":
                return arrayToStr(array1.concat(array2));
            case ":":
                return arrayToStr(array1.concat(array2, invert(array1)));
            case ",":
                return arrayToStr(array1.concat(array2, invert(array1), invert(array2)));
            case "/":
                return arrayToStr(array1.concat(array2, invert(array1), invert(array1), invert(array2), array1));
            default:
                return arrayToStr(array1.concat(array2));
        }
    }
    function score(algorithm) {
        var alg = algorithm;
        alg = "[".concat(alg.replace(/\+/gu, "]+["), "]");
        alg = alg.replace(/\]\[/gu, "]+[");
        var rpnStack = rpn(initStack(alg)), scoreOutput = [];
        while (rpnStack.length > 0) {
            var sign = rpnStack.shift();
            if (isOperator(sign)) {
                var scorePop2 = scoreOutput.pop();
                var scorePop1 = scoreOutput.pop();
                var score1 = Number(scorePop1), score2 = Number(scorePop2);
                if (isNaN(score1)) {
                    score1 = scorePop1.split(" ").length;
                }
                if (isNaN(score2)) {
                    score2 = scorePop2.split(" ").length;
                }
                scoreOutput.push(scoreTwo(score1, score2, sign).toString());
            }
            else {
                scoreOutput.push(sign);
            }
        }
        return Number(scoreOutput[0]);
    }
    function scoreTwo(score1, score2, sign) {
        switch (sign) {
            case "+":
                return score1 + score2 + addScore;
            case ":":
                return score1 + score2;
            case ",":
                return (abMaxScore * Math.max(score1, score2) +
                    abMinScore * Math.min(score1, score2));
            default:
                return Infinity;
        }
    }
    function sortRule(algorithm1, algorithm2) {
        return score(algorithm1) - score(algorithm2);
    }
    function search(input) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        var algorithm = input.algorithm;
        order = (_a = input.order) !== null && _a !== void 0 ? _a : orderInit;
        outerBracket = (_b = input.outerBracket) !== null && _b !== void 0 ? _b : outerBracketInit;
        abMaxScore = (_c = input.abMaxScore) !== null && _c !== void 0 ? _c : abMaxScoreInit;
        abMinScore = (_d = input.abMinScore) !== null && _d !== void 0 ? _d : abMinScoreInit;
        addScore = (_e = input.addScore) !== null && _e !== void 0 ? _e : addScoreInit;
        initialReplace = (_f = input.initialReplace) !== null && _f !== void 0 ? _f : initialReplaceInit;
        finalReplace = (_g = input.finalReplace) !== null && _g !== void 0 ? _g : finalReplaceInit;
        commute = (_h = input.commute) !== null && _h !== void 0 ? _h : commuteInit;
        fast = (_j = input.fast) !== null && _j !== void 0 ? _j : fastInit;
        slashNotation = (_k = input.slashNotation) !== null && _k !== void 0 ? _k : slashNotationInit;
        noBrackets = (_l = input.noBrackets) !== null && _l !== void 0 ? _l : noBracketsInit;
        spaceAfterColon = (_m = input.spaceAfterColon) !== null && _m !== void 0 ? _m : spaceAfterColonInit;
        spaceAfterComma = (_o = input.spaceAfterComma) !== null && _o !== void 0 ? _o : spaceAfterCommaInit;
        outerBrackets = (_p = input.outerBrackets) !== null && _p !== void 0 ? _p : outerBracketsInit;
        var maxDepth = (_q = input.maxDepth) !== null && _q !== void 0 ? _q : maxDepthInit, limit = (_r = input.limit) !== null && _r !== void 0 ? _r : limitInit;
        result = [];
        if (algorithm === "") {
            return [""];
        }
        var expandAlg = expand({
            algorithm: algorithm,
            order: order,
            initialReplace: initialReplace,
            finalReplace: finalReplace,
            commute: commute
        });
        if (expandAlg === "Lack left parenthesis." ||
            expandAlg === "Lack right parenthesis." ||
            expandAlg === "") {
            return [expandAlg];
        }
        var arr = algToArray(expandAlg);
        if (order === 0 || isOrderZero) {
            isOrderZero = true;
            order = 2 * (maxAlgAmount + 2);
        }
        else {
            isOrderZero = false;
        }
        // Examples:
        // • order 4 → min -1 (e.g. cube)
        // • order 5 → min -2 (e.g. Megaminx)
        // • order 3 → min -1 (e.g. Pyraminx)
        minAmount = Math.floor(order / 2) + 1 - order;
        maxAmount = Math.floor(order / 2);
        var arrLen = arr.length;
        for (var i = 0; i < arrLen; i++) {
            var amountCount = 0;
            for (var j = 0; j < arrLen; j++) {
                if (arr[i].base === arr[j].base) {
                    amountCount = amountCount + arr[j].amount;
                }
            }
            if (amountCount % order !== 0) {
                return ["Not found."];
            }
        }
        var commuteCount = 0;
        var commuteIndex = [];
        for (var i = 0; i < arrLen - 1; i++) {
            if (isSameClass(arr[i], arr[i + 1])) {
                commuteIndex[commuteCount] = i;
                commuteCount += 1;
            }
        }
        var commuteTotal = Math.pow(2, commuteCount);
        var commutatorOutput = ["Not found."], isFind = false;
        var searchDepth = 0;
        if (maxDepth === 0) {
            searchDepth = Math.floor((arrLen - 1) / 3);
        }
        else {
            searchDepth = maxDepth;
        }
        for (var depth = 1; depth <= searchDepth; depth++) {
            for (var i = 0; i < commuteTotal; i++) {
                var commuteArr = arr.concat();
                for (var j = 0; j < commuteCount; j++) {
                    if ((i & (1 << j)) !== 0) {
                        commuteArr = swapArray(commuteArr, commuteIndex[j], commuteIndex[j] + 1);
                    }
                }
                commutatorOutput = commutatorMain(commuteArr, depth, depth);
                if (commutatorOutput[0] !== "Not found.") {
                    isFind = true;
                }
                if (fast && isFind) {
                    return result;
                }
            }
            if (isFind && (depth === maxDepth || maxDepth === 0)) {
                result.sort(sortRule);
                result = result.map(function (alg) {
                    return commutatorPost(alg, slashNotation, noBrackets, spaceAfterColon, spaceAfterComma, outerBrackets);
                });
                if (limit === 0) {
                    return result;
                }
                return result.slice(0, limit);
            }
        }
        return ["Not found."];
    }
    function commutatorPost(algorithm, slashNotation1, noBrackets1, spaceAfterColon1, spaceAfterComma1, outerBrackets1) {
        var alg = algorithm;
        if (alg.includes(".")) {
            return alg;
        }
        if (slashNotation1) {
            alg = applySlash(alg);
        }
        if (noBrackets1) {
            alg = alg.replace("[", "").replace("]", "");
        }
        if (spaceAfterColon1) {
            alg = alg.replace(":", ": ");
        }
        if (spaceAfterComma1) {
            alg = alg.replace(",", ", ");
        }
        if (outerBrackets1) {
            if (alg[0] !== "[") {
                alg = "[".concat(alg, "]");
            }
        }
        return alg;
    }
    function applySlash(algorithm) {
        if (!algorithm.includes("[")) {
            return algorithm;
        }
        var part0Output = "";
        if (algorithm.includes(":")) {
            part0Output = algorithm.split(":")[0];
        }
        var part1Output = algorithm.split("[")[1].split(",")[0];
        var part2Output = algorithm.split(",")[1].split("]")[0];
        var part0 = simplify(algToArray(part0Output));
        var part2 = simplify(algToArray(part2Output));
        if (part1Output === "" || part2Output === "") {
            return "";
        }
        if (part0Output === "") {
            return "[".concat(part1Output, ",").concat(part2Output, "]");
        }
        if (part2.length === 1) {
            for (var _i = 0, _a = [-2, 2]; _i < _a.length; _i++) {
                var i = _a[_i];
                if ((part2[0].amount + i) % order === 0) {
                    var halfPart2 = [
                        {
                            base: part2[0].base,
                            amount: -i / 2
                        },
                    ];
                    var part0New = simplify(part0.concat(halfPart2));
                    var part0NewOutput = arrayToStr(part0New);
                    var part1NewOutput = arrayToStr(invert(halfPart2));
                    if (part0New.length < part0.length) {
                        if (part0NewOutput === "") {
                            return "[".concat(part1NewOutput, "/").concat(part1Output, "]");
                        }
                        return "".concat(part0NewOutput, ":[").concat(part1NewOutput, "/").concat(part1Output, "]");
                    }
                }
            }
        }
        return algorithm;
    }
    function algToArray(algorithm) {
        var algTemp = clean(algorithm);
        for (var s in initialReplace) {
            var re = new RegExp(s, "gu");
            algTemp = algTemp.replace(re, initialReplace[s]);
        }
        algTemp = algTemp.replace(/\s+/giu, "");
        if (algTemp === "") {
            return [];
        }
        var alg = "";
        for (var i = 0; i < algTemp.length; i++) {
            if ((algTemp[i + 1] < "0" || algTemp[i + 1] > "9") &&
                algTemp[i + 1] !== "'") {
                alg = "".concat(alg + algTemp[i], " ");
            }
            else {
                alg = alg + algTemp[i];
            }
        }
        var algSplit = alg.split(" ");
        var arr = [];
        for (var i = 0; i < algSplit.length; i++) {
            arr[i] = { base: algSplit[i][0], amount: 0 };
            var algNumber = algSplit[i].replace(/[^0-9]/gu, "");
            if (algNumber === "") {
                arr[i].amount = 1;
            }
            else {
                arr[i].amount = Number(algNumber);
            }
            if (arr[i].amount > maxAlgAmount) {
                maxAlgAmount = arr[i].amount;
            }
            if (algSplit[i].indexOf("'") > -1) {
                arr[i].amount = -arr[i].amount;
            }
        }
        return arr;
    }
    function commutatorPre(array, depth, maxSubDepth) {
        var commuteCount = 0;
        var commuteIndex = [];
        for (var i = 0; i < array.length - 1; i++) {
            if (isSameClass(array[i], array[i + 1])) {
                commuteIndex[commuteCount] = i;
                commuteCount += 1;
            }
        }
        var commuteTotal = Math.pow(2, commuteCount);
        var commutatorResult = ["Not found."];
        for (var i = 0; i < commuteTotal; i++) {
            var commuteArr = array.concat();
            for (var j = 0; j < commuteCount; j++) {
                if ((i & (1 << j)) !== 0) {
                    commuteArr = swapArray(commuteArr, commuteIndex[j], commuteIndex[j] + 1);
                }
            }
            commutatorResult = commutatorMain(commuteArr, depth, maxSubDepth);
            if (commutatorResult[0] !== "Not found.") {
                return commutatorResult;
            }
        }
        return ["Not found."];
    }
    function commutatorMain(array, depth, maxSubDepth) {
        var arr = simplify(array), commutatorOutput = "";
        var arrBak = arr.concat(), arrLen = arr.length;
        if (arr.length < 3 * depth + 1) {
            return ["Not found."];
        }
        for (var d = 0; d <= (arrLen + arr.length + 1) / 2 - 1; d++) {
            for (var drKey = 1; drKey < order; drKey++) {
                // 1, -1, 2, -2...
                var dr = ((drKey % 2) * 2 - 1) * Math.floor((drKey + 1) / 2);
                if (d === 0) {
                    if (drKey > 1) {
                        break;
                    }
                }
                else {
                    if (Math.abs(dr) > Math.abs(arrBak[d - 1].amount)) {
                        break;
                    }
                    if (order % 2 === 1 ||
                        arrBak[d - 1].amount !== Math.floor(order / 2)) {
                        if ((arrBak[d - 1].amount < 0 && dr > 0) ||
                            (arrBak[d - 1].amount > 0 && dr < 0)) {
                            continue;
                        }
                    }
                }
                arr = displace(arrBak, d, dr);
                // For a b c b' a' d c' d' = a b:[c,b' a' d]
                for (var i = 1; i <= arr.length / 2 - 1; i++) {
                    var minj = 0;
                    if (depth === 1) {
                        minj = Math.max(1, Math.floor((arr.length + 1) / 2 - i));
                    }
                    else {
                        minj = 1;
                    }
                    for (var j = minj; j <= arr.length / 2 - 1; j++) {
                        var part1x = [], part2x = [];
                        var commuteAdd1 = [[]], commuteAdd2 = [[]];
                        if (arr[i - 1].base === arr[i + j - 1].base) {
                            // For [a bx,by c bz]
                            for (var ir = minAmount; ir <= maxAmount; ir++) {
                                if (ir === 0) {
                                    continue;
                                }
                                var jr = normalize(arr[i + j - 1].amount + ir);
                                part1x = simplify(repeatEnd(arr.slice(0, i), ir));
                                commuteAdd1.push(part1x);
                                part2x = simplify(invert(part1x).concat(repeatEnd(arr.slice(0, i + j), jr)));
                                commuteAdd2.push(part2x);
                            }
                        }
                        else {
                            if (depth === 1 && arr[i].base !== arr[arr.length - 1].base) {
                                continue;
                            }
                            part1x = simplify(arr.slice(0, i));
                            commuteAdd1.push(part1x);
                            part2x = simplify(arr.slice(i, i + j));
                            commuteAdd2.push(part2x);
                            var commuteCase = [];
                            if (isSameClass(arr[i - 1], arr[i + j - 1])) {
                                // For L a R b L' a' R' b' = [L a R,b L' R]
                                commuteAdd1.push(part1x);
                                commuteCase = simplify(part2x.concat([arr[i - 1]]));
                                commuteAdd2.push(commuteCase);
                                // For L a R L b R L2' a' R2' b' = [L a R L,b R2 L']
                                if (i >= 2) {
                                    if (isSameClass(arr[i - 1], arr[i - 2])) {
                                        commuteAdd1.push(part1x);
                                        commuteCase = simplify(part2x.concat(arr.slice(i - 2, i)));
                                        commuteAdd2.push(commuteCase);
                                    }
                                }
                            }
                            if (isSameClass(arr[i], arr[i + j])) {
                                // For a R b L a' R' b' L' = [a R b R,R' L a'] = [a R L',L b R]
                                commuteCase = simplify(part1x.concat(invert([arr[i + j]])));
                                commuteAdd1.push(commuteCase);
                                commuteCase = simplify([arr[i + j]].concat(part2x));
                                commuteAdd2.push(commuteCase);
                                // For a R2 b R' L2 a' R' L' b' L' = [a R2 b L R,R2' L a'] = [a R2 L',L b R L]
                                if (arr.length >= i + j + 2) {
                                    if (isSameClass(arr[i + j], arr[i + j + 1])) {
                                        commuteCase = simplify(part1x.concat(invert(arr.slice(i + j, i + j + 2))));
                                        commuteAdd1.push(commuteCase);
                                        commuteCase = simplify(arr.slice(i + j, i + j + 2).concat(part2x));
                                        commuteAdd2.push(commuteCase);
                                    }
                                }
                            }
                        }
                        for (var commuteAddKey = 1; commuteAddKey < commuteAdd1.length; commuteAddKey++) {
                            part1x = commuteAdd1[commuteAddKey];
                            part2x = commuteAdd2[commuteAddKey];
                            var subArr = simplify(part2x.concat(part1x, invert(part2x), invert(part1x), arr));
                            var subPart = "";
                            if (depth > 1) {
                                subPart = commutatorPre(subArr, depth - 1, maxSubDepth)[0];
                            }
                            else if (subArr.length > 0) {
                                continue;
                            }
                            if (subPart !== "Not found.") {
                                var part1y = part1x, part2y = part2x;
                                var party = simplify(part2x.concat(part1x));
                                if (party.length < Math.max(part1x.length, part2x.length)) {
                                    if (part1x.length <= part2x.length) {
                                        // For a b c d e b' a' c' e' d' = [a b c,d e b' a'] = [a b c,d e c]
                                        part1y = part1x;
                                        part2y = party;
                                    }
                                    else {
                                        // For a b c d e b' a' d' c' e' = [a b c,d e b' a'] = [a b c d,e b' a']
                                        part1y = invert(part2x);
                                        part2y = party;
                                    }
                                }
                                // For a b c b' a' d c' d' = a b:[c,b' a' d] = d:[d' a b,c]
                                var part0 = simplify(repeatEnd(arrBak.slice(0, d), dr)), part1 = part1y, part2 = part2y;
                                if (part0.length > 0 && maxSubDepth === 1) {
                                    var partz = simplify(part0.concat(part2y));
                                    // Avoid a b c b' a' d c' d' = d:[d' a b,c], use a b:[c,b' a' d] instead.
                                    if (partz.length < part0.length - 1) {
                                        part0 = partz;
                                        part1 = invert(part2y);
                                        part2 = part1y;
                                    }
                                }
                                var part1Output = arrayToStr(part1), part2Output = arrayToStr(part2), part0Output = arrayToStr(part0);
                                if (part1Output === "" || part2Output === "") {
                                    continue;
                                }
                                var commutatorStr = pairToStr(part0Output, part1Output, part2Output, subPart);
                                if (commutatorOutput === "") {
                                    commutatorOutput = commutatorStr;
                                }
                                if (score(commutatorStr) < score(commutatorOutput)) {
                                    commutatorOutput = commutatorStr;
                                }
                                if (depth === maxSubDepth &&
                                    result.indexOf(commutatorStr) === -1) {
                                    result.push(commutatorStr);
                                }
                                if (fast) {
                                    return [commutatorOutput];
                                }
                            }
                        }
                    }
                }
            }
        }
        if (commutatorOutput === "") {
            return ["Not found."];
        }
        return [commutatorOutput];
    }
    function repeatEnd(array, attempt) {
        var arr = array.concat();
        if (arr.length === 0) {
            return [];
        }
        var arrPop = arr.pop();
        if (attempt === 0) {
            return arr;
        }
        arr.push({ base: arrPop.base, amount: attempt });
        return arr;
    }
    function pairToStr(part0, part1, part2, subPart) {
        if (subPart === "") {
            if (!outerBracket) {
                if (part0 === "") {
                    return "[".concat(part1, ",").concat(part2, "]");
                }
                return "".concat(part0, ":[").concat(part1, ",").concat(part2, "]");
            }
            else if (part0 === "") {
                return "[".concat(part1, ",").concat(part2, "]");
            }
            return "[".concat(part0, ":[").concat(part1, ",").concat(part2, "]]");
        }
        if (!outerBracket) {
            if (part0 === "") {
                return "[".concat(part1, ",").concat(part2, "]+").concat(subPart);
            }
            return "".concat(part0, ":[[").concat(part1, ",").concat(part2, "]+").concat(subPart, "]");
        }
        else if (part0 === "") {
            return "[".concat(part1, ",").concat(part2, "]").concat(subPart);
        }
        return "[".concat(part0, ":[").concat(part1, ",").concat(part2, "]").concat(subPart, "]");
    }
    function displace(array, d, dr) {
        var arr = array.concat(), arrEnd = repeatEnd(arr.slice(0, d), dr);
        return simplify(invert(arrEnd).concat(arr, arrEnd));
    }
    function invert(array) {
        var arr = [];
        for (var i = array.length - 1; i >= 0; i--) {
            arr.push({ base: array[i].base, amount: normalize(-array[i].amount) });
        }
        return arr;
    }
    function arrayToStr(array) {
        var arr = array.concat();
        arr = simplify(arr);
        if (arr.length === 0) {
            return "";
        }
        for (var times = 0; times <= 1; times++) {
            for (var i = 0; i < arr.length - 1; i++) {
                if (isSameClass(arr[i], arr[i + 1]) &&
                    commute[arr[i].base].priority > commute[arr[i + 1].base].priority) {
                    arr = swapArray(arr, i, i + 1);
                }
            }
        }
        var arrTemp = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].amount < 0) {
                if (arr[i].amount === -1) {
                    arrTemp[i] = "".concat(arr[i].base, "'");
                }
                else {
                    arrTemp[i] = "".concat(arr[i].base + -arr[i].amount, "'");
                }
            }
            else if (arr[i].amount === 1) {
                arrTemp[i] = arr[i].base;
            }
            else {
                arrTemp[i] = arr[i].base + arr[i].amount;
            }
        }
        var arrOutput = "".concat(arrTemp.join(" "), " ");
        for (var i in finalReplace) {
            var re = new RegExp("".concat(i, " "), "gu");
            arrOutput = arrOutput.replace(re, "".concat(finalReplace[i], " "));
        }
        arrOutput = arrOutput.substring(0, arrOutput.length - 1);
        return arrOutput;
    }
    function simplify(array) {
        if (array.length === 0) {
            return [];
        }
        var arr = [];
        for (var i = 0; i < array.length; i++) {
            var arrayAdd = {
                base: array[i].base,
                amount: normalize(array[i].amount)
            }, arrLen = arr.length;
            if (normalize(arrayAdd.amount) === 0) {
                continue;
            }
            var isChange = false;
            for (var j = 1; j <= 3; j++) {
                if (arr.length >= j) {
                    if (arr[arrLen - j].base === arrayAdd.base) {
                        var canCommute = true;
                        if (j >= 2) {
                            for (var k = 1; k <= j; k++) {
                                if (!(arr[arrLen - k].base in commute)) {
                                    canCommute = false;
                                    break;
                                }
                            }
                            for (var k = 2; k <= j; k++) {
                                if (!isSameClass(arr[arrLen - k], arr[arrLen - (k - 1)])) {
                                    canCommute = false;
                                    break;
                                }
                            }
                        }
                        if (canCommute) {
                            var moveAdd = {
                                base: arr[arrLen - j].base,
                                amount: normalize(arr[arrLen - j].amount + arrayAdd.amount)
                            };
                            if (moveAdd.amount === 0) {
                                arr.splice(-j, 1);
                            }
                            else {
                                arr.splice(-j, 1, moveAdd);
                            }
                            isChange = true;
                            break;
                        }
                    }
                }
            }
            if (!isChange) {
                arr[arrLen] = arrayAdd;
            }
        }
        return arr;
    }
    function isSameClass(move1, move2) {
        if (move1.base in commute && move2.base in commute) {
            if (commute[move1.base]["class"] === commute[move2.base]["class"]) {
                return true;
            }
        }
        return false;
    }
    function swapArray(array, index1, index2) {
        array[index1] = array.splice(index2, 1, array[index1])[0];
        return array;
    }
    function normalize(amount) {
        if (isOrderZero) {
            return amount;
        }
        return (((amount % order) + order - minAmount) % order) + minAmount;
    }
    return {
        search: search,
        expand: expand,
        commutatorPost: commutatorPost
    };
})();
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = commutator;
}
