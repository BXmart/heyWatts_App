
export function getPowersToChangeInTwoArrays(currentPowers: number[], recommendedPowers: number[]) {
  let increasePowerArray = [];
  let decreasePowerArray = [];
  if (currentPowers.length !== recommendedPowers.length || currentPowers.length <= 0 || recommendedPowers.length <= 0) {
    return [];
  }
  for (let i = 0; i < currentPowers.length; i++) {
    if (currentPowers[i] > recommendedPowers[i]) {
      decreasePowerArray.push({ tariff: 'P' + (i + 1), powerBefore: currentPowers[i], powerAfter: recommendedPowers[i] });
    }
    if (currentPowers[i] < recommendedPowers[i]) {
      increasePowerArray.push({ tariff: 'P' + (i + 1), powerBefore: currentPowers[i], powerAfter: recommendedPowers[i] });
    }
  }
  return [increasePowerArray, decreasePowerArray];
}

