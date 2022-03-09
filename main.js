function commutator() {
  var x = String(document.getElementById("x").value);
  var i;
  var j;
  var k;
  var flag;
  var arrtemp;
  var arr1;
  var arr2;
  var mini;
  var minscore;
  arr1 = simplify(x.split(" "));
  part3 = conjugate(arr1);
  arr1 = simplify(inverse(part3.concat()).concat(arr1, part3));
  arr2 = inverse(arr1.concat());
  flag = 0;
  text1 = "";
  minscore = 1000;
  arrtemp = arr1.concat();
  for (i = 0; i <= arrtemp.length; i++) {
    if (i <= arrtemp.length / 2) {
      realscore = score(arrtemp) + i / 3;  //penalty factor
    }
    if (i > arrtemp.length / 2) {
      realscore = score(arrtemp) + 2 * (arrtemp.length - i) / 3; //penalty factor
    }
    // text1 = text1 + i.toString() + "?" + score(arrtemp).toString() + ","; //+"("+  arrtemp.toString()+")"+",";
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
  arr2 = inverse(arr1.concat());

  part5 = simplify(part3.concat(part4));
  for (i = 0; i <= arr1.length; i++) {
    str1 = arr1.concat().slice(0, i);
    for (k = 0; k <= i; k++) {
      j = conjugate(arr1.concat().slice(i, arr1.length)).length;
      str2 = arr1.concat().slice(i, i + j);
      str3 = arr1.concat().slice(i - k, i);
      part1 = simplify(str1);
      part2 = simplify(str2.concat(str3));
      arrex = part1.concat(part2, inverse(part1.concat()), inverse(part2.concat()));
      arr = simplify(arrex);
      if (arr.toString() == arr1.toString()) {
        if (part5.length == 0) {
          text1 = "[" + part1.join(" ") + "," + part2.join(" ") + "]";
        }
        if (part5.length > 0) {
          text1 = part5.join(" ") + ":[" + part1.join(" ") + "," + part2.join(" ") + "]";
        }
        text2 = "[t,i,j,k]=[" + part5.length.toString() + "," + i.toString() + "," + j.toString() + "," + k.toString() + "]"
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
    text2 = "Not found."
  }
  document.getElementById("result1").innerHTML = text1;
  document.getElementById("result2").innerHTML = text2;
}

// R2 D R U' R D' R' U R D R' U R' D' R U' R
function displace(array) {
  var arrtemp;
  var arr;
  var arr1;
  var arr2;
  arr = array;
  arr1 = arr.concat().slice(0, 1);
  arr2 = arr.concat().slice(arr.length - 1, arr.length);
  if (combine_str(arr1[0], arr2[0]).toString() == "0".toString()) {
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
  var i;
  var j;
  var k;
  var flag;
  var arr1;
  var arr2;
  var str1;
  var str2;
  var str3;
  var arr;
  var arrex;
  arr1 = array;
  arr2 = inverse(arr1.concat());
  flag = 0;
  for (i = 0; i <= arr1.length; i++) {
    str1 = arr1.concat().slice(0, i);
    for (k = 0; k <= i; k++) {
      j = conjugate(arr1.concat().slice(i, arr1.length)).length;
      str2 = arr1.concat().slice(i, i + j);
      str3 = arr1.concat().slice(i - k, i);
      part1 = simplify(str1);
      part2 = simplify(str2.concat(str3));
      arrex = part1.concat(part2, inverse(part1.concat()), inverse(part2.concat()));
      arr = simplify(arrex);
      if (arr.toString() == arr1.toString()) {
        return i + j + k
      }
    }
  }
}

function conjugate(array) {
  var arr;
  var i;
  var arr1;
  var arr2;
  var len;
  var arrtemp;
  var t;
  var minlen;
  arr = array;
  minlen = arr.length;
  t = 0;
  for (i = 1; i < array.length; i++) {
    arr1 = arr.concat().slice(0, i);
    arr2 = inverse(arr1.concat());
    arrtemp = arr.concat();
    arrtemp = arr2.concat(arrtemp, arr1);
    arrtemp = simplify(arrtemp);
    len = simplify(arrtemp).length;
    if (len < minlen) {
      t = i;
      minlen = len;
    }
  }
  return arr.concat().slice(0, t);
}

function inverse(array) {
  var temp;
  var arr;
  var i;
  arr = array;
  for (i = 0; i < arr.length / 2; i++) {
    temp = arr[i];
    arr[i] = array[arr.length - 1 - i];
    arr[arr.length - 1 - i] = temp;
  }
  for (i = 0; i < arr.length; i++) {
    arr[i] = inverse_str(arr[i]);
  }
  return arr;
}

function simplify(array) {
  var arr;
  var i;
  arr = array;
  for (i = 0; i <= array.length; i++) {
    arr = simple(arr);
  }
  return arr;
}

function simple(array) {
  var arr;
  var i;
  arr = array;
  for (i = 0; i < arr.length - 1; i++) {
    if (combine_str(arr[i], arr[i + 1]).toString() == "".toString()) {
      arr.splice(i, 2);
      break;
    }
    if (combine_str(arr[i], arr[i + 1]).toString() == (arr[i][0]).toString()) {
      arr.splice(i + 2, 0, arr[i][0]);
      arr.splice(i, 2);
      break;
    }
    if (combine_str(arr[i], arr[i + 1]).toString() == (arr[i][0] + "2").toString()) {
      arr.splice(i + 2, 0, arr[i][0] + "2");
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
  var len1;
  var len2;
  len1 = str1.length;
  len2 = str2.length;
  if (str1[0] == str2[0]) {
    if (len1 == 1) {
      if (len2 == 1) {
        return str1 + "2";
      }
      if (len2 == 2) {
        if (str2[1] == "2") {
          return str1 + "'";
        }
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
        if (len2 == 2) {
          if (str2[1] == "2") {
            return str1[0];
          }
          if (str2[1] == "'") {
            return str1[0] + "2";
          }
        }
      }
      if (str1[1] == "2") {
        if (len2 == 1) {
          return str1[0] + "'";
        }
        if (len2 == 2) {
          if (str2[1] == "2") {
            return "";
          }
          if (str2[1] == "'") {
            return str1[0];
          }
        }
      }
    }
  }
  return "0";
}

function inverse_str(str) {
  var len;
  len = str.length;
  if (len == 1) {
    return str + "'";

  }
  if (len == 2) {
    if (str[1] == "2") {
      return str;
    }
    if (str[1] == "'") {
      return str[0];
    }
  }
}

document.getElementById("go").addEventListener("click", commutator);