// ==UserScript==
// @name         JIRA Helpers
// @namespace    http://redhat.com
// @version      0.3
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
    const modifyProductName = function() {
        document.querySelectorAll('[id=customfield_12319040-field]')
            .forEach(item => {
                const span = item.querySelector('span');
                switch(span.textContent) {
                    case "HyperShift Preview":
                        span.textContent = "Hypershift";
                        break;
                    case "Red Hat OpenShift Service on AWS":
                        span.textContent = "ROSA";
                        break;
                }
            })
    }

    const sfdcCaseLinker = function() {
        const re = /created new external case link for case: (\d+)\./; 
        document.querySelectorAll('.activity-comment')
            .forEach((comment) => {
                let commentBody = comment.querySelector('.action-body')
                let text = commentBody.innerHTML;
                let found = text.match(re)
                if (found) {
                    let newtext = text.replace(found[1], '<a href="https://access.redhat.com/support/cases/#/case/' + found[1] + '" target="_blank">' + found[1] + '</a>');
                    commentBody.innerHTML = newtext;
                }
            })
    }

    // Use setTimeout here to delay the query for N ms after page load, to give JIRA
    // time to handle itself and load everything to the DOM. Subsequent setTimeouts are
    // not called in sequence, they're all handled individually from initial page load.
    setTimeout(() => modifyProductName(), 5000);
    setTimeout(() => loadAllComments(), 1000);
    setTimeout(() => sfdcCaseLinker(), 1000);
})();
