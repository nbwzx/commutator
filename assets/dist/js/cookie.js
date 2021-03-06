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
    if (getCookie("settingsOuterBracket") === "true") {
        byid("settingsOuterBracket").checked = true;
    }
    if (getCookie("settingsSortScorea") !== "") {
        byid("settingsSortScorea").value = getCookie("settingsSortScorea");
    }
    if (getCookie("settingsSortScoreb") !== "") {
        byid("settingsSortScoreb").value = getCookie("settingsSortScoreb");
    }
};

function changeCookie() {
    if (byid("settingsOuterBracket").checked === true) {
        setCookie("settingsOuterBracket", "true", 30);
    } else {
        setCookie("settingsOuterBracket", "", -1);
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
}

function byid(id) {
    return document.getElementById(id);
}