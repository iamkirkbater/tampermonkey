// ==UserScript==
// @name         JIRA Helpers
// @namespace    http://redhat.com
// @version      0.4.0
// @description  Set of JIRA usability helpers
// @author       Kirk Bater
// @match        https://issues.redhat.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=redhat.com
// @grant        none
// ==/UserScript==

function addStyle(css) {
  const style = document.getElementById("jirautil-style") || (function() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = "jirautil-style";
    document.head.appendChild(style);
    return style;
  })();
  const sheet = style.sheet;
  sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}


addStyle(`.wikEdDiffInsert { background-color:#c9ffbb !important; }`);
addStyle(`.wikEdDiffDelete { background-color:#ff9c9c !important; }`);
addStyle(`.action-body.changehistory { position: relative; }`);
addStyle(`.jirautils-diffhtml .wikEdDiffContainer {
    width: 80%;
    position: absolute;
    left: 10%;
    top: 30%;
    margin-top: -12.5%;
}`);
addStyle(`.jirautils-diffhtml {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: white;
}`);
addStyle(`.jirautils-diffclose {
    position: absolute;
    top: 2em;
    right: -0.5em;
    padding: 0.6em 1em;
    font-size: 1.25em;
    border-radius: 97%;
    box-shadow: 3px 3px #d0d0d0;
    background: white;
    border: 1px solid #d0d0d0;
    cursor: pointer;
}`);
addStyle(`a.jirautils-difflink:before {
    content: "\\A";
    width: 0;
    height: 0;
    border-top: 0.45em solid transparent;
    border-bottom: 0.45em solid transparent;
    border-left: 0.45em solid #06c;
    position: relative;
    left: -0.5em;
    display: inline-block;
}`);
addStyle(`a.jirautils-difflink {
    display: block;
    padding-left: 1.5em;
    padding-top: 0.5em;
}`);

var observeDOM = (function(){
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  return function( obj, callback ){
    if( !obj || obj.nodeType !== 1 ) return;

    if( MutationObserver ){
      // define a new observer
      var mutationObserver = new MutationObserver(callback)

      // have the observer observe for changes in children
      mutationObserver.observe( obj, { childList:true, subtree:true })
      return mutationObserver
    }

    // browser support fallback
    else if( window.addEventListener ){
      obj.addEventListener('DOMNodeInserted', callback, false)
      obj.addEventListener('DOMNodeRemoved', callback, false)
    }
  }
})();

( function () { var script = document.createElement( 'script' ); script.src = 'https://en.wikipedia.org/w/index.php?title=User:Cacycle/diff.js&action=raw&ctype=text/javascript'; script.async = true; document.getElementsByTagName( 'head' )[ 0 ].appendChild( script ); } ) ();

(function() {
    'use strict';

    var wikEdDiff;


    // Loads all of the comments automatically instead of having to consistently click Load More
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

    // Finds the case link comment and turns the case number into a clickable link to SFDC
    const sfdcCaseLinker = function() {
        const re = /created new external case link for case: (\d+)\./;
        document.querySelectorAll('.activity-comment')
            .forEach((comment) => {
                let commentBody = comment.querySelector('.action-body');
                let text = commentBody.innerHTML;
                let found = text.match(re);
                if (found) {
                    let newtext = text.replace(found[1], '<a href="https://access.redhat.com/support/cases/#/case/' + found[1] + '" target="_blank">' + found[1] + '</a>');
                    commentBody.innerHTML = newtext;
                }
            });
    }

    const diffAdder = function() {
        console.log("Generating Diff Links");
        document.querySelectorAll('.changehistory.action-body').forEach((diffComment) => {
            if (diffComment.querySelector('.activity-name').innerText == "Description") {
                let diffLink = document.createElement('a');
                diffLink.innerText = "Diff";
                diffLink.setAttribute('class', 'jirautils-difflink');
                diffComment.querySelector('.activity-name').append(diffLink);
                diffLink.addEventListener('click', (e) => {
                    console.log('Generating Diff');
                    let wikEdDiff = new WikEdDiff();
                    let doubleNewLineRegex = /\n{2}/g
                    let diffParentDom = e.currentTarget.closest('.changehistory.action-body')
                    let oldVersionDom = diffParentDom.querySelector('.activity-old-val').cloneNode(true);
                    let newVersionDom = diffParentDom.querySelector('.activity-new-val').cloneNode(true);
                    if (oldVersionDom.querySelector('b') != undefined) { oldVersionDom.querySelector('b').remove(); }
                    if (newVersionDom.querySelector('b') != undefined) { newVersionDom.querySelector('b').remove(); }
                    let oldVersionString = oldVersionDom.innerText.trim().replace(doubleNewLineRegex, "\n");
                    let newVersionString = newVersionDom.innerText.trim().replace(doubleNewLineRegex, "\n");
                    let diffHtml = wikEdDiff.diff(oldVersionString, newVersionString);
                    let diffDom = document.createElement('div');
                    diffDom.setAttribute('class', 'jirautils-diffhtml');
                    diffDom.innerHTML = diffHtml;
                    let diffFloatContainer = diffDom.firstChild;


                    // add heading
                    let diffHeading = document.createElement('h2');
                    diffHeading.innerText = "Description";
                    diffFloatContainer.prepend(diffHeading);

                    // add close button
                    let closeButton = document.createElement('div');
                    closeButton.setAttribute("class", "jirautils-diffclose");
                    closeButton.innerText = "x";
                    diffFloatContainer.prepend(closeButton);

                    closeButton.addEventListener('click', (e) => {
                        let diffDom = e.currentTarget.closest('.jirautils-diffhtml');
                        diffDom.remove();
                    });

                    // add the diff
                    diffParentDom.append(diffDom);
                });
            }
        });
    }

    const initDiffAdder = function() {
        let historyButton = document.querySelector('#changehistory-tabpanel')
        if (historyButton != undefined) {
            if (historyButton.hasAttribute('class')) {
                if (historyButton.getAttribute('class').split(' ').includes('active')) {
                    diffAdder()
                }
            }
        }
        observeDOM(document.querySelector('.issuePanelWrapper'), (m) => {
                console.log('issue panel change detected');
                setTimeout(() => diffAdder(), 1000);
            });
    }


    // Use setTimeout here to delay the query for N ms after page load, to give JIRA
    // time to handle itself and load everything to the DOM. Subsequent setTimeouts are
    // not called in sequence, they're all handled individually from initial page load.
    setTimeout(() => modifyProductName(), 5000);
    setTimeout(() => loadAllComments(), 1000);
    setTimeout(() => sfdcCaseLinker(), 1000);
    setTimeout(() => initDiffAdder(), 1000);


})();
