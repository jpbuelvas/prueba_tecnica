"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundToFixed = void 0;
const XLSX = require("xlsx");
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
const roundToFixed = (input, digits = 1) => {
    var rounded = Math.pow(10, digits);
    if (input === 0) {
        return input;
    }
    return (Math.round(input * rounded) / rounded).toFixed(digits);
};
exports.roundToFixed = roundToFixed;
function leerCsv(ruta) {
    const workbook = XLSX.readFile(ruta);
    const workbookSheets = workbook.SheetNames;
    const sheet = workbookSheets[0];
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
    const states = dataExcel.map((item) => {
        return item['Province_State'];
    });
    const uniqueStates = Array.from(new Set(states));
    const statesResults = uniqueStates.reduce((prev, current) => {
        return Object.assign(Object.assign({}, prev), { [current]: 0 });
    }, {});
    const statePopulations = uniqueStates.reduce((prev, current) => {
        return Object.assign(Object.assign({}, prev), { [current]: 0 });
    }, {});
    const stateDeathRates = uniqueStates.reduce((prev, current) => {
        return Object.assign(Object.assign({}, prev), { [current]: 0 });
    }, {});
    for (const row of dataExcel) {
        let lastKey = Object.keys(row).pop();
        const currentDeaths = statesResults[row.Province_State] + row["4/26/21"];
        const currentPopulation = statePopulations[row.Province_State] +
            row.Population;
        const result = Number(currentDeaths) / currentPopulation;
        const currentDeathRate = (isFinite(result) && result) || 0;
        statesResults[row.Province_State] = currentDeaths;
        statePopulations[row.Province_State] = currentPopulation;
        stateDeathRates[row.Province_State] = currentDeathRate;
    }
    let valuesObtained = Object.values(statesResults);
    let deathRatesValues = Object.values(stateDeathRates);
    const max = Math.max(...valuesObtained);
    const min = Math.min(...valuesObtained);
    const worstRate = Math.max(...deathRatesValues);
    let maxState = getKeyByValue(statesResults, max);
    let minState = getKeyByValue(statesResults, min);
    let worstState = getKeyByValue(stateDeathRates, worstRate);
    console.log("1) ", maxState);
    console.log("2) ", minState);
    console.log("3) ", worstState, `${(0, exports.roundToFixed)(worstRate * 100, 3)}%`);
    console.log("Death rates by state");
    for (const stateEntry of Object.entries(stateDeathRates)) {
        console.log(stateEntry[0], `${(0, exports.roundToFixed)(Number(stateEntry[1]) * 100, 3)}%`);
    }
}
leerCsv("./app/time_series_covid19_deaths_US.csv");
