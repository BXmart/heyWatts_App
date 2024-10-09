import moment from 'moment';

export enum GraphType {
  Money = 0,
  Energy = 1,
}

export enum Colors {
  LOW = '#ffcfc6',
  MODERATE = '#ff7e67',
  STANDARD = '#db3214',
  HIGH = '#c52b10',
  CRITICAL = '#4a0f05',
  SURPLUS_COMPENSATION_NONE = '#082620',
  SURPLUS_COMPENSATION_LOW = '#156752',
  SURPLUS_COMPENSATION_MODERATE = '#4bbc96',
  SURPLUS_COMPENSATION_HIGH = '#b2e8d0',
}

export enum BarColors {
  red = '#c52b10',
  orange = '#fb923c',
  green = '#22C55E',
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
  flat: number;
  tip: number;
  valley: number;
}

export interface DashboardData {
  consumptionData?: ConsumptionDataItem[];
  predictionData?: PredictionDataItem[];
  predictedEuros?: PredictionDataItem[];
}

export interface ParsedDataItem {
  value: number;
  label: string;
  frontColor?: string;
  datetime: Date;
  gradientColor?: string;
}

export interface ReturnDashboardData {
  parsedData: ParsedDataItem[];
  parsedPredictionData: ParsedDataItem[];
}
const parseEnergyData = (
  data: DashboardData,
  parsedData: ParsedDataItem[],
  parsedPredictionData: ParsedDataItem[]
): ReturnDashboardData => {
  const { consumptionData, predictionData } = data;

  if (consumptionData) {
    consumptionData.forEach((item) => {
      const itemDateTime = moment(item.createdAt, 'YYYY-MM-DD HH:mm:ss');
      const index = itemDateTime.hour();

      parsedData[index] = {
        value: item.net / 1000,
        label: index % 2 === 0 ? itemDateTime.format('HH:00') : '',
        frontColor: item.tip !== 0 ? BarColors.red : item.flat !== 0 ? BarColors.orange : BarColors.green,
        datetime: itemDateTime.toDate(),
      };
    });
  }

  if (predictionData) {
    predictionData.forEach((item) => {
      const itemDateTime = moment(item.createdAt);
      const index = itemDateTime.hour();

      parsedPredictionData[index] = {
        value: (item.consumptionWh + item.surplus_energy_wh) / 1000,
        label: index % 2 === 0 ? itemDateTime.format('HH:00') : '',
        frontColor: item.tip !== 0 ? BarColors.red : item.flat !== 0 ? BarColors.orange : BarColors.green,
        datetime: itemDateTime.toDate(),
      };
    });
  }

  return { parsedData, parsedPredictionData };
};

const parseMoneyData = (
  data: any,
  parsedData: ParsedDataItem[]
): ParsedDataItem[] => {
  const { consumptionData } = data;
  if (consumptionData) {
    consumptionData.forEach((item: any) => {
      const itemDateTime = moment(item.createdAt, 'YYYY-MM-DD HH:mm:ss');
      const index = itemDateTime.hour();
      const isSurplus = (item.tip + item.valley + item.flat) <= 0;

      parsedData[index] = {
        value: Number(Math.abs(item.tip + item.valley + item.flat).toFixed(2)),
        label: itemDateTime.format('HH:00'),
        gradientColor: (item.tip + item.valley + item.flat) > 0.50 ? Colors.HIGH : isSurplus ? Colors.SURPLUS_COMPENSATION_MODERATE : Colors.MODERATE,
        frontColor: isSurplus ? Colors.SURPLUS_COMPENSATION_MODERATE : Colors.MODERATE,
        datetime: itemDateTime.toDate(),
      };
    });
  }

  return parsedData;
};

const createEmptyDataArray = (): ParsedDataItem[] => {
  return Array.from({ length: 24 }, (_, index) => ({
    value: 0,
    label: moment().startOf('day').add(index, 'hours').format('HH:00'),
    frontColor: '#e6e6e6',
    datetime: moment().startOf('day').add(index, 'hours').toDate(),
  }));
};

const parseDashboardData = (data: DashboardData | null, graphType: GraphType): ReturnDashboardData => {
  let parsedData = createEmptyDataArray();
  let parsedPredictionData = createEmptyDataArray();

  if (!data) {
    return { parsedData, parsedPredictionData };
  }

  if (graphType === GraphType.Money) {
    parsedData = parseMoneyData(data, parsedData);
  } else {
    ({ parsedData, parsedPredictionData } = parseEnergyData(data, parsedData, parsedPredictionData));
  }

  parsedData.sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
  parsedPredictionData.sort((a, b) => a.datetime.getTime() - b.datetime.getTime());

  return { parsedData, parsedPredictionData };
};

export default parseDashboardData