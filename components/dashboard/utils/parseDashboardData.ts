import moment from 'moment';

export enum GraphType {
  Consumption = 0,
  Prediction = 1,
  Money = 2,
}

interface ConsumptionDataItem {
  consumption_id: number;
  _id: string;
  createdAt: string;
  cleanVat: number;
  net: number;
  fee: number;
  tip: number;
  flat: number;
  valley: number;
  feeType: number;
  propertyId: number;
}

interface PredictionDataItem {
  _id: string;
  consumptionWh: number;
  surplus_energy_wh: number;
  createdAt: Date;
  updatedAt: null;
}

interface PredictedEurosDataItem {

}

export interface DashboardData {
  consumptionData?: ConsumptionDataItem[];
  predictionData?: PredictionDataItem[];
  predictedEuros?: PredictionDataItem[];
}

export interface ReturnDashboardData {
  consumptionData?: ParsedDataItem[];
  predictionData?: ParsedDataItem[];
  predictedEuros?: ParsedDataItem[];
}


export interface ParsedDataItem {
  value: number;
  label: string;
  frontColor: string;
  topLabelComponent?: () => JSX.Element;
}



const parseDashboardData = (data: DashboardData, graphType: GraphType): ParsedDataItem[] => {
  const tempArray = Array.from({ length: 24 }, (_, index) => ({
    value: 0,
    label: moment().startOf('day').add(index, 'hours').format('HH:mm'),
    frontColor: "#e6e6e6",
  }));

  const parsedData: ParsedDataItem[] = tempArray;

  const array = graphType === GraphType.Consumption ? data.consumptionData : graphType === GraphType.Prediction ? data.predictionData : data.predictedEuros;

  if (array && graphType === GraphType.Consumption) {

    (array as ConsumptionDataItem[]).forEach((item: ConsumptionDataItem, index: number) => {
      const currentHour = new Date(item.createdAt).getHours();
      const date = moment(item.createdAt);
      const hour = date.hour();

      parsedData[index] = {
        value: item.net,
        label: parsedData[index].label,
        frontColor: "green",
        /* topLabelComponent: createLabelComponent({
          text: 'Consumption',
          color: 'blue',
          fontSize: 8,
          rotationDegree: -45
        }) */
      };
    });
  }

  // Parse predictionData
  if (array && graphType === GraphType.Prediction) {
    (array as PredictionDataItem[]).forEach((item: PredictionDataItem, index: number) => {
      const currentHour = new Date(item.createdAt).getHours();

      parsedData[index] = {
        value: item.consumptionWh + item.surplus_energy_wh,
        label: parsedData[index].label,
        frontColor: "green",
        /* topLabelComponent: createLabelComponent({
          text: 'Predcition',
          color: 'blue',
          fontSize: 8,
          rotationDegree: -45
        }) */
      };
    });
  }

  // Parse predictedEuros
  /* if (array && graphType === GraphType.Euros) {
    (array as Euros[]).forEach((item: PredictionDataItem, index: number) => {
      const currentHour = new Date(item.createdAt).getHours();

      predictedEuros[currentHour] = {
        value: item.consumptionWh ?? 0, // Ensure non-negative value
        label: moment(item.createdAt).format('HH:mm'),
        frontColor: "orange",
        /* topLabelComponent: createLabelComponent({
          text: 'Predicted €',
          color: 'blue',
          fontSize: 8,
          rotationDegree: -45
        }) 
      };
    });
  } */

  // Sort the result by date
  parsedData.sort((a, b) => moment(a.label, 'HH:mm').valueOf() - moment(b.label, 'HH:mm').valueOf());

  return parsedData;
};

export default parseDashboardData;