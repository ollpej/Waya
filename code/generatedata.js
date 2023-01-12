var fs = require('fs');
const yaml = require('js-yaml');


const randomSeed = (length = 8) => {
    return Math.random().toString(16).substr(2, length);
};

const fileName = randomSeed(14) + '.json';
const filePath = 'code\\seeds\\' + fileName;
const configs = yaml.load(fs.readFileSync('code\\config.yaml', 'utf8'));


const fruitPrice1 = (() => { return Math.random() * (configs.fruitPrice1.max - configs.fruitPrice1.min) + configs.fruitPrice1.min * Math.random() * ((configs.fruitPrice1.priceVarianceMax - 0) / 10)});
const fruitPrice2 = (() => { return Math.random() * (configs.fruitPrice2.max - configs.fruitPrice2.min) + configs.fruitPrice2.min * Math.random() * ((configs.fruitPrice2.priceVarianceMax - 0) / 10)});
const driveCost = (() => { return Math.random() * (configs.driveCost.max - configs.driveCost.min) + configs.driveCost.max});

const fruitStands = []

for (let i = 0; i < 19; i++){
    fruitStands.push({
        id: randomSeed(14),
        fruitPrice1: fruitPrice1(),
        fruitPrice2: fruitPrice2(),
        driveCost: driveCost()
    })
}

var searchResult

if(configs.resultCheck === "lowest cost"){
    const fruitStandsWithTotalSum = fruitStands.map(obj => {
        return {...obj, totalCost: Object.keys(obj).filter(key =>
            key.includes("Cost", "cost", "Price", "price")).reduce((key, sum) => sum +currentFruitStand[key])}})
    searchResult = fruitStandsWithTotalSum.reduce((currentFruitStand, savedFruitStand) => {
        if(savedFruitStand && currentFruitStand.totalCost > savedFruitStand.totalCost){
            return savedFruitStand;
        }
        return currentFruitStand;
    })
}


fs.writeFile(filePath, JSON.stringify({ data: fruitStands, result: JSON.stringify(searchResult)}), function (err) {
    if (err) throw err;
  });

