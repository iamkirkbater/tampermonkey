# TamperMonkey Scripts

This is where I'm keeping tampermonkey scripts for some helpful functions I may have. These have only been tested in Latest Chrome. I'll accept PRs to support Firefox or other browsers but I can guarantee that I won't have the time to develop or debug the issues myself.

## JIRA Helpers

Sometimes using JIRA is a pain - this helps to make my life a bit easier.

### Features

* History Description Diff Tool - See a highlighted diff of the history of a ticket's description.
* All Comment Expansion - expands all comments on a ticket (in issue view page only) by default instead of having to click
* OHSS Product name change - Changes some old product names to shorter, recognizeable names
* SFDC Case Linker - Changes the comment with the SFDC case ID to be a clickable link so you don't have to copy/paste

### Installation

* Install [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?pli=1)
* Click the Tampermonkey extension icon and open the Dashboard
* Click Utilities at the top right
* Select the RAW GH url from the [script above](https://github.com/iamkirkbater/tampermonkey/raw/main/jira-helpers.js) and copy it
* Paste the RAW GH url into the text box at the bottom titled "Import from URL" and click "Install"
* Verify that the comment at the top matches what you expect (like that I'm the author, and that the version is correct, etc)
* Navigate to JIRA and see the features in action.
