
let resetButton = document.getElementById('resetAffinityScore');

resetButton.onclick = function() {
  chrome.storage.local.set({
    CSE_Challenge: {
      Womens: 0,
      Mens: 0,
      Home: 0,
      Lifestyle: 0,
      Beauty: 0
    }
  }, alert('Score reset!'));
};