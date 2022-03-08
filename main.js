function commutator() {
  var x = String(document.getElementById("x").value);
  // var y = String(document.getElementById("y").value);
  var i;
  var j;
  var k;
  var l;
  var flag;
  var len;
  len = x.length;
  arr1 = x.split(" ");
  arr2 = inverse(arr1.concat());
  flag = 0;
  // Maybe j,l,i,k is better for reading.
  for (j = 0; j <= arr1.length; j++) {
    for (l = 0; l <= arr1.length; l++) {
      for (i = 0; i <= arr1.length; i++) {
        for (k = 0; k <= arr1.length; k++) {
          str1 = arr1.concat().slice(0, i);
          str2 = inverse(arr2.concat().slice(0, j));
          str3 = arr2.concat().slice(0, k);
          str4 = inverse(arr1.concat().slice(0, l));
          part1 = simplify(str1.concat(str2));
          part2 = simplify(str3.concat(str4));
          arrex = part1.concat(part2, inverse(part1.concat()), inverse(part2.concat()));
          arr = simplify(arrex);
          if (arr.toString() == arr1.toString() && flag == 0) {
            text1 = "[" + part1.join(" ") + "," + part2.join(" ") + "]";
            text2 = "[i,j,k,l]=[" + i.toString() + "," + j.toString() + "," + k.toString() + "," + l.toString() + "]"
            flag = 1;
          }
        }
      }
    }
  }
  if (flag == 0) {
    text1 = "Not found."
    text2 = ""
  }
  document.getElementById("result1").innerHTML = text1;
  document.getElementById("result2").innerHTML = text2;
}

function inverse(array) {
  var temp;
  var arr;
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
  return 0;
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