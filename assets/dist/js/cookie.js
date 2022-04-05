function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

window.onload = function loadCookie() {
    if (getCookie("settingsOuterBracket") === "true") {
        byid("settingsOuterBracket").checked = true;
    }
}

function changeCookie() {
    if (byid("settingsOuterBracket").checked === true) {
        setCookie("settingsOuterBracket", "true", 30);
    } else {
        setCookie("settingsOuterBracket", "", -1);
    }
}

function byid(id) {
    return document.getElementById(id);
}