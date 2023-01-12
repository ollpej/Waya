var fs = require('fs');

const randomSeed = (length = 8) => {
    return Math.random().toString(16).substr(2, length);
};

const fileName = randomSeed(14) + '.json';
const filePath = 'code\\seeds\\' + fileName;

const fruitPrice1 = (() => { return Math.random() * (140 - 80) + 80 * Math.random() * ((50 - 0) / 10)});
const fruitPrice2 = (() => { return Math.random() * (180 - 100) + 100 * Math.random() * ((50 - 0) / 10)});
const driveCost = (() => { return Math.random() * (50 - 10) + 10});

const fruitStands = []

for (let i = 0; i < 19; i++){
    fruitStands.push({
        id: randomSeed(14),
        fruitPrice1: fruitPrice1(),
        fruitPrice2: fruitPrice2(),
        driveCost: driveCost()
    })
}
var searchResult = fruitStands.reduce((currentFruitStand, currentLowest) => {
    if(currentLowest && currentFruitStand.fruitPrice1 + currentFruitStand.fruitPrice2 + currentFruitStand.driveCost > currentLowest.fruitPrice1 + currentLowest.fruitPrice2 + currentLowest.driveCost){
        return currentLowest;
    }
    return currentFruitStand;
})

fs.writeFile(filePath, JSON.stringify({ data: fruitStands, result: JSON.stringify(searchResult)}), function (err) {
    if (err) throw err;
  });

