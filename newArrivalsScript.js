
function calculateAffinityScoreOrder(affinityScores) {
  let defaultOrder = ["Womens", "Mens", "Home", "Lifestyle", "Beauty"];
  let defaultOrderScores = [];
  let newCategoryOrder = [];

  for (let i = 0; i < defaultOrder.length; i++) {
    let category = defaultOrder[i];

    defaultOrderScores.push(affinityScores[category]); //storing pulled affinity scores in new array with same index order as defaultOrder
  };

  function recursiveHighestScore(oldOrder, scores, newOrder) {
    if (oldOrder.length == 0) return;

    let max = Math.max(...scores);
    let index = scores.indexOf(max);

    newOrder.push(oldOrder[index]);//adds the highest score into newCategoryOrder

    let filteredOrder = oldOrder.filter((_, i) => i !== index);
    let filteredScores = scores.filter((_, i) => i !== index);

    recursiveHighestScore(filteredOrder, filteredScores, newOrder);
  };

  recursiveHighestScore(defaultOrder, defaultOrderScores, newCategoryOrder) //filters out the highest index and then recursively calls itself again with new array minus the highest score. preservers defaultOrder which isn't shifted if the numbers are the same / hasn't been incremented

  return newCategoryOrder;
}

chrome.storage.local.get(["CSE_Challenge"], function(result) {
  let categoryOrder = calculateAffinityScoreOrder(result.CSE_Challenge);
  
  //categories are broken out so template literals can be used
  let firstCat = categoryOrder[0];
  let secondCat = categoryOrder[1];
  let thirdCat = categoryOrder[2];
  let fourthCat = categoryOrder[3];
  let fifthCat = categoryOrder[4];

  //use array index times 2 plus 1 in order to calculate the index of child node relative to parent node - newArrivalsPage. this is due to child nodes with product information all occuring at odd intervals, 1, 3, 5, etc.
  let injectedCode = `
  let newArrivalsPage = document.getElementsByClassName('dom-landing-page-modules')[0];
  let originalOrder = ["Womens", "Mens", "Home", "Lifestyle", "Beauty"];
  let sortedCategoryOrder = ['${firstCat}', '${secondCat}', '${thirdCat}', '${fourthCat}', '${fifthCat}'];
  for (let i = 0; i < sortedCategoryOrder.length; i++) {
    let defaultCat = originalOrder[i];
    let sortedCat = sortedCategoryOrder[i];

    if (sortedCat !== defaultCat) {
      let defaultIndex = originalOrder.indexOf(defaultCat);
      let sortedIndex = originalOrder.indexOf(sortedCat);

      let defaultNode = newArrivalsPage.children[(2 * defaultIndex) + 1];
      let sortedNode = newArrivalsPage.children[(2 * sortedIndex) + 1];
      let placeHolderNode = newArrivalsPage.children[(2 * sortedIndex) + 2];

      sortedNode.parentNode.insertBefore(sortedNode, defaultNode);
      defaultNode.parentNode.insertBefore(defaultNode, placeHolderNode);

      let arrayIndex = originalOrder.indexOf(sortedCat);

      let temp = originalOrder[i];
      originalOrder[i] = sortedCat;
      originalOrder[arrayIndex] = temp;
    };
  };
  `;


  let script = document.createElement("script");
  script.textContent = injectedCode;
  (document.head||document.documentElement).appendChild(script);
  script.remove();
});