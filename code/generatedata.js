var fs = require('fs')
const yaml = require('js-yaml')

const randomSeed = (length = 8) => {
  return Math.random().toString(16).substr(2, length)
}

const fileName = randomSeed(14) + '.json'
const filePath = 'code\\seeds\\' + fileName
const configs = yaml.load(fs.readFileSync('code\\config.yaml', 'utf8'))
let fruitStands = []

const fruitPrice1 = () => {
  return (
    Math.random() * (configs.fruitPrice1.max - configs.fruitPrice1.min) +
    configs.fruitPrice1.min *
      Math.random() *
      ((configs.fruitPrice1.priceVarianceMax - 0) / 10)
  )
}
const fruitPrice2 = () => {
  return (
    Math.random() * (configs.fruitPrice2.max - configs.fruitPrice2.min) +
    configs.fruitPrice2.min *
      Math.random() *
      ((configs.fruitPrice2.priceVarianceMax - 0) / 10)
  )
}
const driveCost = () => {
  return (
    Math.random() * (configs.driveCost.max - configs.driveCost.min) +
    configs.driveCost.max
  )
}

var searchResult

const shoppingListCalcTotal = (fruitStands, shoppingCart = null) => {
  if (shoppingCart == null) {
    return fruitStands.map((currentFruitStand) => {
      let sum = 0
      Object.keys(currentFruitStand)
        .filter((key) => ['Cost', 'Price'].find((word) => key.includes(word)))
        .forEach((key) => (sum = sum + currentFruitStand[key]))

        return {
        ...currentFruitStand,
        totalCost: sum,
      }
    })
  } else {
    return fruitStands.map((currentFruitStand) => {
      //Only return one
      const mandatoryFruit = shoppingCart.mandatoryKind.map(
        (mandatoryFruitKey) => {
          return {
            fruit: mandatoryFruitKey,
            cost: currentFruitStand[mandatoryFruitKey],
          }
        },
      )[0]
      //Only return one
      const optionalFruit = shoppingCart.optionalKind
        .map((optionalFruitKey) => {
          return {
            fruit: optionalFruitKey,
            cost: currentFruitStand[optionalFruitKey],
          }
        })
        .sort((a, b) => {
          return a.cost - b.cost
        })[0]

      const totalCost = mandatoryFruit.cost + optionalFruit.cost
      return {
        ...currentFruitStand,
        shoppingCart: {
          mandatoryFruit,
          optionalFruit,
          totalCost: totalCost,
        },
      }
    })
  }
}

if (configs.resultCheck.lowestCost) {
  for (let i = 0; i < 19; i++) {
    fruitStands.push({
      id: randomSeed(14),
      fruitPrice1: fruitPrice1(),
      fruitPrice2: fruitPrice2(),
      driveCost: driveCost(),
    })
  }
  const fruitStandsWithTotalSum = shoppingListCalcTotal(fruitStands)
  searchResult = fruitStandsWithTotalSum.reduce(
    (savedFruitStand, currentFruitStand) => {
      if (
        savedFruitStand &&
        currentFruitStand.totalCost > savedFruitStand.totalCost
      ) {
        return savedFruitStand
      }
      return currentFruitStand
    },
  )
}

if (configs.resultCheck.lowestCostWithCart) {
  const fruitPrice3 = () => {
    return (
      Math.random() * (configs.fruitPrice3.max - configs.fruitPrice3.min) +
      configs.fruitPrice3.min *
        Math.random() *
        ((configs.fruitPrice3.priceVarianceMax - 0) / 10)
    )
  }
  for (let i = 0; i < 19; i++) {
    fruitStands.push({
      id: randomSeed(14),
      fruitPrice1: fruitPrice1(),
      fruitPrice2: fruitPrice2(),
      fruitPrice3: fruitPrice3(),
      driveCost: driveCost(),
    })
  }

  const fruitStandsWithShoppingCart = shoppingListCalcTotal(
    fruitStands,
    configs.shoppingCart,
  )

  searchResult = fruitStandsWithShoppingCart.reduce(
    (savedFruitStand, currentFruitStand) => {
      if (
        savedFruitStand &&
        currentFruitStand.shoppingCart.totalCost >
          savedFruitStand.shoppingCart.totalCost
      ) {
        return savedFruitStand
      }
      return currentFruitStand
    },
  )
}

fs.writeFile(
  filePath,
  JSON.stringify({ data: fruitStands, result: JSON.stringify(searchResult) }),
  function (err) {
    if (err) throw err
  },
)
