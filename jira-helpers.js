// ==UserScript==
// @name         JIRA Helpers
// @namespace    http://redhat.com
// @version      0.2
// @description  Auto-expand Jira Issue Comments
// @author       Kirk Bater
// @match        https://issues.redhat.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=redhat.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const loadAllComments = function() {
        document.querySelector("button.show-more-comment-tabpanel").click();

        if (document.querySelectorAll("button.show-more-comment-tabpanel").length) {
            setTimeout(() => loadAllComments(), 500);
        }
    }

    // Modifys the product name label in the card to shorter, easier to parse display names
    const modifyProductName = function(item) {
        const span = item.querySelector('span');

        switch(span.textContent) {
            case "HyperShift Preview":
                span.textContent = "Hypershift";
                break;
            case "Red Hat OpenShift Service on AWS":
                span.textContent = "ROSA";
                break;
        }
    };

    // Use setTimeout here to delay the query for N ms after page load, to give JIRA
    // time to handle itself and load everything to the DOM. Subsequent setTimeouts are
    // not called in sequence, they're all handled individually from initial page load.
    setTimeout(() => document.querySelectorAll('[id=customfield_12319040-field]')
               .forEach(item =>
                  modifyProductName(item)
               ), 5000);

    setTimeout(() => loadAllComments(), 1000);
})();
