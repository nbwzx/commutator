function commutator() {
  var x = String(document.getElementById("x").value);
  var i;
  var j;
  var k;
  var l;
  var flag;
  var len;
  len = x.length;
  arr1 = simplify(x.split(" "));
  part3 = conjugate(arr1);
  arr1 = simplify(inverse(part3.concat()).concat(arr1, part3));
  arr2 = inverse(arr1.concat());
  flag = 0;
  // text1 = score(displace(arr1));
  // for (i = 0; i <= arr1.length; i++) {
  //   text1=text1+score(arr1).toString()+",";//+"("+arr1.toString()+")"+",";
  //   arr1=displace(arr1);
  // }

  for (i = 0; i <= arr1.length; i++) {
    str1 = arr1.concat().slice(0, i);
    for (j = 0; j <= arr1.length - i; j++) {
      for (k = 0; k <= i; k++) {
        str2 = arr1.concat().slice(i, i + j);
        str3 = arr1.concat().slice(i - k, i);
        part1 = simplify(str1);
        part2 = simplify(str2.concat(str3));
        arrex = part1.concat(part2, inverse(part1.concat()), inverse(part2.concat()));
        arr = simplify(arrex);
        if (arr.toString() == arr1.toString()) {
          if (part3.length == 0) {
            text1 = "[" + part1.join(" ") + "," + part2.join(" ") + "]";
          }
          if (part3.length > 0) {
            text1 = part3.join(" ") + ":[" + part1.join(" ") + "," + part2.join(" ") + "]";
          }
          text2 = "[t,i,j,k]=[" + part3.length.toString() + "," + i.toString() + "," + j.toString() + "," + k.toString() + "]"
          flag = 1;
          break;
        }
      }
      if (flag == 1) {
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
  var l;
  var flag;
  var len;
  arr1 = array;
  arr2 = inverse(arr1.concat());
  flag = 0;
  for (i = 0; i <= arr1.length; i++) {
    str1 = arr1.concat().slice(0, i);
    for (j = 0; j <= arr1.length - i; j++) {
      for (k = 0; k <= i; k++) {
        str2 = arr1.concat().slice(i, i + j);
        str3 = arr1.concat().slice(i - k, i);
        part1 = simplify(str1);
        part2 = simplify(str2.concat(str3));
        arrex = part1.concat(part2, inverse(part1.concat()), inverse(part2.concat()));
        arr = simplify(arrex);
        if (arr.toString() == arr1.toString()) {
           return "[t,i,j,k]=[" + part3.length.toString() + "," + i.toString() + "," + j.toString() + "," + k.toString() + "]"
        }
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
  for (i = 0; i < array.length; i++) {
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