// ==UserScript==
// @name         JIRA Issue Loader
// @namespace    http://redhat.com
// @version      0.1
// @description  Auto-expand Jira Issue Comments
// @author       Kirk Bater
// @match        https://issues.redhat.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=redhat.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("load", (event) => {
        console.log("Hello Redhat");

        document.getElementsByClassName("show-more-comment-tabpanel")[0].click();
    });
})();
