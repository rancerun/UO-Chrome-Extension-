
let storage = chrome.storage.local;

//set initial CSE_Challenge variable values on startup, define popup button rules

chrome.runtime.onInstalled.addListener(function() {
  storage.set({
    CSE_Challenge: {
      Womens: 0,
      Mens: 0,
      Home: 0,
      Lifestyle: 0,
      Beauty: 0
    }}, function() {        
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([
        {
          conditions: [
            new chrome.declarativeContent.PageStateMatcher({
              pageUrl: { hostEquals: 'www.urbanoutfitters.com', schemes: ['https'] },
            })
          ],
          actions: [ new chrome.declarativeContent.ShowPageAction() ]
        }
      ]);
    });
  });
});

//stores new values on every increment

function incrementAffinityCount(string, count) {
  storage.get(["CSE_Challenge"], function(result) {
    let currentValue = result.CSE_Challenge;
    currentValue[string] += count;

    storage.set({CSE_Challenge: currentValue});
  });
};

//listener that increments based on the request from incrementScript.js

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    if (/women/.test(request.category)) {
      incrementAffinityCount("Womens", request.count);

    } else if (/men/.test(request.category)) {
      incrementAffinityCount("Mens", request.count);

    } else if (/home/.test(request.category)) {
      incrementAffinityCount("Home", request.count);

    } else if (/lifestyle/.test(request.category)) {
      incrementAffinityCount("Lifestyle", request.count);

    } else if (/beauty/.test(request.category)) {
      incrementAffinityCount("Beauty", request.count);
    }
  }
);