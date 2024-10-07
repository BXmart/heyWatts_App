export const convertWattsToHours = (watts: number) => {
  let result: string

  const absoluteValue = Math.abs(watts)

  if (absoluteValue < 1000000) {
    const kWh = absoluteValue / 1000
    result = `${!!kWh ? kWh.toFixed(2) : 0} kWh`
  } else {
    const MWh = absoluteValue / 1000000
    result = `${!!MWh ? MWh.toFixed(2) : 0} MWh`
  }

  return result
}