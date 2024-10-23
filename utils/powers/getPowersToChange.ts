export function getPowersToChange(currentPowers: number[], recommendedPowers: number[]) {
  let resultArray = [];
  if (currentPowers.length !== recommendedPowers.length || currentPowers.length <= 0 || recommendedPowers.length <= 0) {
    return [];
  }
  for (let i = 0; i < currentPowers.length; i++) {
    if (currentPowers[i] !== recommendedPowers[i]) {
      resultArray.push({ tariff: 'P' + (i + 1), powerBefore: currentPowers[i], powerAfter: recommendedPowers[i] });
    }
  }
  return resultArray;
}