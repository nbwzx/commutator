function free() {
  var x = String(document.getElementById("alg").value);
  document.getElementById("alert").classList.add("invisible");
  document.getElementById("alert").innerHTML = commutator(x);
  document.getElementById("alert").classList.remove("invisible");
}

function commutator(x) {
  x = x.trim();
  x = x.replace(/\s+/ig, " ");
  x = x.replace(/[‘]/g, "'");
  x = x.replace(/[’]/g, "'");
  x = x.replace(/ '/g, "'");
  var arr1 = simplify(x.split(" "));
  if (arr1.length == 0) {
    return "Empty input.";
  }
  for (i = 0; i < arr1.length - 1; i++) {
    if (arr1[i].length > 2) {
      return "Invalid input.";
    }
  }
  var sum;
  for (i = 0; i <= arr1.length - 1; i++) {
    sum = 0;
    for (j = 0; j <= arr1.length - 1; j++) {
      if (arr1[i][0] == arr1[j][0]) {
        if (arr1[j].length == 1) {
          sum = sum + 1;
        } else {
          if (arr1[j][1] == "'") {
            sum = sum - 1;
          }
        }
      }
    }
    if (sum !== 0) {
      return "Not found.";
    }
  }
  var text_output = commutatormain(arr1);
  if (text_output.toString() !== "Not found.".toString()) {
    return text_output;
  } else {
    part3 = conjugate(arr1);
    arrex = simplify(inverse(part3.concat()).concat(arr1, part3));
    if (part3.length == 0) {
      return commutatorpair(arrex);
    } else {
      text_output = commutatorpair(arrex);
      if (text_output.toString() == "Not found.".toString()) {
        return "Not found.";
      } else {
        if (text_output.split('[').length - 1 == 3) {
          return simplifyfinal(part3) + " " + text_output;
        } else {
          return simplifyfinal(part3) + ":[" + text_output + "]";
        }
      }
    }
  }
}

function commutatorpair(array) {
  var arrtemp = array.concat();
  for (var i_dis = 0; i_dis <= arrtemp.length; i_dis++) {
    if (4 > arrtemp.length) {
      return "Not found."
    }
    for (var count = 4; count <= arrtemp.length; count++) {
      var arr1 = arrtemp.concat().slice(0, count);
      var lenarr1 = arr1.length;
      if (lenarr1 % 2 == 1) {
        continue
      }
      for (var i = 1; i <= lenarr1 / 2 - 1; i++) {
        var str1 = arr1.concat().slice(0, i);
        for (var j = 1; j <= lenarr1 / 2 - 1; j++) {
          var str2 = arr1.concat().slice(i, i + j);
          var part1x = simplify(str1);
          var part2x = simplify(str2);
          var party = simplify(part2x.concat(part1x));
          var part1 = part1x;
          var part2 = part2x;
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
          var arrex = part1.concat(part2, inverse(part1.concat()), inverse(part2.concat()));
          var arra = simplify(arrex);
          var arrb = simplify(inverse(arra.concat()).concat(arrtemp));
          var partb = commutatormain(arrb);
          if (partb.toString() !== "Not found.".toString()) {
            var part1_out = simplifyfinal(part1);
            var part2_out = simplifyfinal(part2);
            var parta = "[" + part1_out + "," + part2_out + "]";
            if (i_dis == 0) {
              var text1 = parta + "+" + partb;
            } else {
              text1 = array.concat().slice(0, i_dis).join(" ") + ":[" + parta + "+" + partb + "]";
            }
            return text1;
          }
        }
      }
    }
    arrtemp = displace(arrtemp);
  }
  return "Not found."
}

function commutatormain(array) {
  var arr1 = array.concat();
  var part3 = conjugate(arr1);
  var arr1 = simplify(inverse(part3.concat()).concat(arr1, part3));
  var flag = 0;
  var text1 = "";
  var minscore = 1000;
  var mini;
  var arrtemp = arr1.concat();
  for (var i = 0; i < arrtemp.length; i++) {
    score_temp = score(arrtemp.concat());
    if (i <= arrtemp.length / 2) {
      realscore = score_temp + i / 3; //penalty factor
    }
    if (i > arrtemp.length / 2) {
      realscore = score_temp + 2 * (arrtemp.length - i) / 3; //penalty factor
    }
    if (realscore < minscore) {
      mini = i;
      minscore = realscore;
    }
    arrtemp = displace(arrtemp);
  }
  if (mini <= arrtemp.length / 2) {
    var part4 = arr1.concat().slice(0, mini);
    arr1 = simplify(inverse(part4.concat()).concat(arr1, part4));
  } else {
    part4 = arr1.concat().slice(mini, arrtemp.length);
    arr1 = simplify(part4.concat().concat(arr1, inverse(part4)));
  }
  var part5 = simplify(part3.concat(part4));
  var part5_out = simplifyfinal(part5);
  var lenarr1 = arr1.length;
  if (lenarr1 % 2 == 1) {
    return "Not found.";
  }
  for (var i = 1; i <= lenarr1 / 2 - 1; i++) {
    var str1 = arr1.concat().slice(0, i);
    for (var j = 1; j <= lenarr1 / 2 - 1; j++) {
      var str2 = arr1.concat().slice(i, i + j);
      var part1x = simplify(str1);
      var part2x = simplify(str2);
      var party = simplify(part2x.concat(part1x));
      var part1 = part1x;
      var part2 = part2x;
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
      var arrex = part1.concat(part2, inverse(part1.concat()), inverse(part2.concat()));
      var arr = simplify(arrex);
      var part1_out = simplifyfinal(part1);
      var part2_out = simplifyfinal(part2);
      if (simplify(arr.concat(inverse(arr1.concat()))).length == 0) {
        if (part5.length == 0) {
          text1 = "[" + part1_out + "," + part2_out + "]";
        }
        if (part5.length > 0) {
          text1 = part5_out + ":[" + part1_out + "," + part2_out + "]";
        }
        flag = 1;
        break;
      }
    }
    if (flag == 1) {
      break;
    }
  }
  if (flag == 0) {
    text1 = "Not found."
  }
  return text1;
}
// R2 D R U' R D' R' U R D R' U R' D' R U' R

function displace(array) {
  var arr = array.concat();
  var arr1 = arr.concat().slice(0, 1);
  var arr2 = arr.concat().slice(arr.length - 1, arr.length);
  if (combine_str(arr1[0], arr2[0]).toString() == "0".toString()) {
    var arrtemp = arr.concat();
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
  var arr1 = array.concat();
  var lenarr1 = arr1.length;
  if (lenarr1 % 2 == 1) {
    return 1000;
  }
  for (i = 1; i <= lenarr1 / 2 - 1; i++) {
    var str1 = arr1.concat().slice(0, i);
    for (var j = 1; j <= lenarr1 / 2 - 1; j++) {
      var str2 = arr1.concat().slice(i, i + j);
      var part1x = simplify(str1);
      var part2x = simplify(str2);
      var party = simplify(part2x.concat(part1x));
      var part1 = part1x;
      var part2 = part2x;
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
      var arrex = part1.concat(part2, inverse(part1.concat()), inverse(part2.concat()));
      var arr = simplify(arrex);
      if (simplify(arr.concat(inverse(arr1.concat()))).length == 0) {
        if (part1.length < part2.length) {
          return 2 * part1.length + part2.length;
        } else {
          return part1.length + 2 * part2.length;
        }
      }
    }
  }
  return 1000;
}

function conjugate(array) {
  var arr = array.concat();
  var minlen = arr.length;
  var t = 0;
  for (var i = 1; i < array.length; i++) {
    var arr1 = arr.concat().slice(0, i);
    var arr2 = inverse(arr1.concat());
    var arrtemp = arr.concat();
    arrtemp = arr2.concat(arrtemp, arr1);
    arrtemp = simplify(arrtemp);
    var len = simplify(arrtemp).length;
    if (len < minlen) {
      t = i;
      minlen = len;
    }
  }
  return arr.concat().slice(0, t);
}

function inverse(array) {
  var arr = array.concat();
  for (var i = 0; i < arr.length / 2; i++) {
    var temp = arr[i];
    arr[i] = array[arr.length - 1 - i];
    arr[arr.length - 1 - i] = temp;
  }
  for (i = 0; i < arr.length; i++) {
    arr[i] = inverse_str(arr[i]);
  }
  return arr;
}

function simplifyfinal(array) {
  var arr = array.concat();
  arr = simplify(arr);
  var arr_out = arr.join(" ");
  return arr_out;
}

function simplify(array) {
  var len = array.length;
  var arr = array.concat();
  for (var i = 0; i <= len; i++) {
    arr = simple(arr);
  }
  return arr;
}

function simple(array) {
  var arr = array.concat();
  for (var i = 0; i < arr.length - 1; i++) {
    if (combine_str(arr[i], arr[i + 1]).toString() == "".toString()) {
      arr.splice(i, 2);
      break;
    }
    if (combine_str(arr[i], arr[i + 1]).toString() == (arr[i][0]).toString()) {
      arr.splice(i + 2, 0, arr[i][0]);
      arr.splice(i, 2);
      break;
    }
    if (combine_str(arr[i], arr[i + 1]).toString() == (arr[i][0] + "'").toString()) {
      arr.splice(i + 2, 0, arr[i][0] + "'");
      arr.splice(i, 2);
      break;
    }
  }
  return arr;
}

function combine_str(str1, str2) {
  var len1 = str1.length;
  var len2 = str2.length;
  if (str1[0] == str2[0]) {
    if (len1 == 1) {
      if (len2 == 2) {
        if (str2[1] == "'") {
          return "";
        }
      }
    }
    if (len1 == 2) {
      if (str1[1] == "'") {
        if (len2 == 1) {
          return "";
        }
      }
    }
  }
  return "0";
}

function inverse_str(str) {
  var len = str.length;
  if (len == 1) {
    return str + "'";
  }
  if (len == 2) {
    if (str[1] == "'") {
      return str[0];
    }
  }
}

function swaparr(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}

document.getElementById("free").addEventListener("click", free);