import { fileURLToPath } from "url";

const XLSX = require("xlsx");

interface dataRow {
  Province_State: string;
  '4/26/21': string;
  Population: number
}
function getKeyByValue (object: any, value : any) {
  return Object.keys(object).find(key => object[key] === value);
}

export const roundToFixed = (input:number, digits = 1) => {
  var rounded = Math.pow(10, digits);
  if (input === 0) {
    return input;
  }
  return (Math.round(input * rounded) / rounded).toFixed(digits);
};

function leerCsv(ruta: String) {
  const workbook = XLSX.readFile(ruta);
  const workbookSheets = workbook.SheetNames;
  const sheet = workbookSheets[0];
  const dataExcel: Array<dataRow> = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
 
  const states = dataExcel.map((item: any)=> {
    return item['Province_State'];
  })
  const uniqueStates:Array<string> =Array.from(new Set(states))

  const statesResults: any = uniqueStates.reduce((prev:any, current:string) => {
    return {...prev, [current]: 0}
  }, {})

  const statePopulations: any = uniqueStates.reduce(
    (prev: any, current: string) => {
      return { ...prev, [current]: 0 };
    },
    {}
  );

  const stateDeathRates: any = uniqueStates.reduce(
    (prev: any, current: string) => {
      return { ...prev, [current]: 0 };
    },
    {}
  );

  for (const row of dataExcel) {
    let lastKey = Object.keys(row).pop()
    const currentDeaths = statesResults[row.Province_State] + row["4/26/21"];
    const currentPopulation = statePopulations[row.Province_State] +
      row.Population;
      const result = Number(currentDeaths) / currentPopulation;
    const currentDeathRate: number = (isFinite(result) && result) || 0 ;
    statesResults[row.Province_State] = currentDeaths;
    statePopulations[row.Province_State] = currentPopulation;
    stateDeathRates[row.Province_State] = currentDeathRate;
  }

  
  
  let valuesObtained: Array<number> =  Object.values(statesResults);
  let deathRatesValues: Array<number> = Object.values(stateDeathRates);
  const max : number = Math.max(...valuesObtained);
  const min : number = Math.min(...valuesObtained);
  const worstRate: number = Math.max(...deathRatesValues);
  let maxState = getKeyByValue(statesResults, max);
  let minState = getKeyByValue(statesResults, min);
  let worstState = getKeyByValue(stateDeathRates, worstRate);
  console.log("1) ", maxState);
  console.log("2) ", minState);
  console.log("3) Death rates by state");
  for (const stateEntry of Object.entries(stateDeathRates)) {
    console.log(stateEntry[0], `${roundToFixed(Number(stateEntry[1]) * 100, 3)}%`);
  }
  console.log("4) ", worstState, `${roundToFixed(worstRate * 100, 3)}%`);


}


leerCsv("./app/time_series_covid19_deaths_US.csv");
