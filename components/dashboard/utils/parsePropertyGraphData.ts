import { HistoricEchartsI } from "@/types/HistoricEcharts";
import { ParsedDataItem } from "./parseDashboardData";

interface ParsedResult {
  negativeConsumption: ParsedDataItem[];
  positiveConsumption: ParsedDataItem[];
  productionCleanVat: ParsedDataItem[];
  totalConsumption: ParsedDataItem[];
  historicDevices: [ParsedDataItem[]];
}

export function parseData(data: any, dataTypes: string[]): ParsedResult {
  const result: any = {
    negativeConsumption: [],
    positiveConsumption: [],
    productionCleanVat: [],
    totalConsumption: [],
    historicDevices: {}
  };

  if (!dataTypes) return result;

  dataTypes.forEach(dataType => {
    if (['negativeConsumption', 'positiveConsumption', 'productionCleanVat', 'totalConsumption'].includes(dataType)) {


      result[dataType] = data[dataType].map((item: any) => {
        const date = new Date(item[0]);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const time24Hour = `${hours}:${minutes}`;

        return {
          type: dataType,
          value: item[1] / 1000 || 0,
          label: time24Hour,
          datetime: new Date(item[0]),
          frontColor: dataType === 'productionCleanVat' ? '#00FF00' : '#FF0000',
          gradientColor: dataType === 'productionCleanVat' ? '#99FF99' : '#FF9999',
        };
      });
    } else {
      if (data.historicDevices && data.historicDevices.length > 0) {
        const device = data.historicDevices.find((d: any) => d.name === dataType);
        if (device) {
          result.historicDevices[dataType] = device.historic.map((attr: any) => {

            const date = new Date(attr[0]);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const time24Hour = `${hours}:${minutes}`;

            return {
              type: dataType,
              value: attr[1] / 1000 || 0,
              label: time24Hour,
              datetime: new Date(attr.datetime),
              frontColor: '#0000FF',
              gradientColor: '#9999FF',
            }
          });
        }
      }
    }
  });
  return result;
}