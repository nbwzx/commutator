"use strict";

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toGMTString()}`;
    document.cookie = `${cname}=${cvalue};${expires};`;
}

function getCookie(cname) {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

window.onload = function onload() {
    if (getCookie("order") !== "") {
        byid("order").value = getCookie("order");
    }
    if (getCookie("settingsOuterBracket") !== "") {
        byid("settingsOuterBracket").checked = true;
    }
    if (getCookie("settingsInitialReplace") !== "") {
        byid("settingsInitialReplace").checked = false;
    }
    if (getCookie("settingsFinalReplace") !== "") {
        byid("settingsFinalReplace").checked = false;
    }
    if (getCookie("settingsCommute") !== "") {
        byid("settingsCommute").checked = false;
    }
    if (getCookie("settingsMaxDepth") !== "") {
        byid("settingsMaxDepth").value = getCookie("settingsMaxDepth");
    }
    if (getCookie("settingsSortScorea") !== "") {
        byid("settingsSortScorea").value = getCookie("settingsSortScorea");
    }
    if (getCookie("settingsSortScoreb") !== "") {
        byid("settingsSortScoreb").value = getCookie("settingsSortScoreb");
    }
    if (getCookie("settingsSortScoreAdd") !== "") {
        byid("settingsSortScoreAdd").value = getCookie("settingsSortScoreAdd");
    }
    if (getCookie("settingsFast") !== "") {
        byid("settingsFast").checked = true;
    }
};

function changeCookie() {
    if (byid("order").value === "") {
        setCookie("order", "", -1);
    } else {
        setCookie("order", byid("order").value, 30);
    }
    if (byid("settingsOuterBracket").checked === true) {
        setCookie("settingsOuterBracket", "true", 30);
    } else {
        setCookie("settingsOuterBracket", "", -1);
    }
    if (byid("settingsInitialReplace").checked === true) {
        setCookie("settingsInitialReplace", "", -1);
    } else {
        setCookie("settingsInitialReplace", "false", 30);
    }
    if (byid("settingsFinalReplace").checked === true) {
        setCookie("settingsFinalReplace", "", -1);
    } else {
        setCookie("settingsFinalReplace", "false", 30);
    }
    if (byid("settingsCommute").checked === true) {
        setCookie("settingsCommute", "", -1);
    } else {
        setCookie("settingsCommute", "false", 30);
    }
    if (byid("settingsMaxDepth").value === "") {
        setCookie("settingsMaxDepth", "", -1);
    } else {
        setCookie("settingsMaxDepth", byid("settingsMaxDepth").value, 30);
    }    
    if (byid("settingsSortScoreb").value === "") {
        setCookie("settingsSortScorea", "", -1);
    } else {
        setCookie("settingsSortScorea", byid("settingsSortScorea").value, 30);
    }
    if (byid("settingsSortScoreb").value === "") {
        setCookie("settingsSortScoreb", "", -1);
    } else {
        setCookie("settingsSortScoreb", byid("settingsSortScoreb").value, 30);
    }
    if (byid("settingsSortScoreAdd").value === "") {
        setCookie("settingsSortScoreAdd", "", -1);
    } else {
        setCookie("settingsSortScoreAdd", byid("settingsSortScoreAdd").value, 30);
    }
    if (byid("settingsFast").checked === true) {
        setCookie("settingsFast", "true", 30);
    } else {
        setCookie("settingsFast", "", -1);
    }
}

function byid(id) {
    return document.getElementById(id);
}