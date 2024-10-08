
export interface TimeSlot {
  start: number;
  end: number;
  color: string;
  adviceType?: AdviceType;
}

export enum AdviceType {
  LOW = "Bajo",
  MODERATE = "Moderado",
  STANDARD = "Estándar",
  HIGH = "Alto",
  CRITICAL = "Crítico",
  SURPLUS_COMPENSATION_NONE = "Nula",
  SURPLUS_COMPENSATION_LOW = "Baja",
  SURPLUS_COMPENSATION_MODERATE = "Moderada",
  SURPLUS_COMPENSATION_HIGH = "Alta",
}

export enum Colors {
  LOW = "#ffcfc6",
  MODERATE = "#ff7e67",
  STANDARD = "#db3214",
  HIGH = "#c52b10",
  CRITICAL = "#4a0f05",
  SURPLUS_COMPENSATION_NONE = "#082620",
  SURPLUS_COMPENSATION_LOW = "#156752",
  SURPLUS_COMPENSATION_MODERATE = "#4bbc96",
  SURPLUS_COMPENSATION_HIGH = "#b2e8d0",
}

interface EnergyPrice {
  datetime: string;
  price: number;
}

interface SlotBuckets {
  low: number[];
  moderate: number[];
  high: number[];
  critical: number[];
}

interface CompSlotBuckets {
  none: number[];
  low: number[];
  moderate: number[];
  high: number[];
}

const consolidateSlots = (hours: number[], color: Colors, adviceType: AdviceType): TimeSlot[] => {
  const result: TimeSlot[] = [];
  let start: number | null = null;
  let end: number | null = null;
  const sortedHours = hours.sort((a, b) => a - b);

  sortedHours.forEach((hour) => {
    if (start === null) {
      start = hour;
      end = hour;
    } else if (hour === end! + 1) {
      end = hour;
    } else {
      result.push({ start: start!, end: (end! + 1) % 24, color, adviceType });
      start = hour;
      end = hour;
    }
  });

  if (start !== null) {
    result.push({ start, end: (end! + 1) % 24, color, adviceType });
  }

  return result;
};

export const analyzeEnergyPrices = (energyPrices: EnergyPrice[]): TimeSlot[] => {
  const slots: SlotBuckets = {
    low: [],
    moderate: [],
    high: [],
    critical: []
  };

  energyPrices.forEach(({ datetime, price }) => {
    const date = new Date(datetime);
    const hour = date.getHours();

    if (price < 0.05) slots.low.push(hour);
    else if (price < 0.1) slots.moderate.push(hour);
    else if (price > 0.18 && price < 0.23) slots.high.push(hour);
    else if (price > 0.23) slots.critical.push(hour);
  });

  return [
    ...consolidateSlots(slots.critical, Colors.CRITICAL, AdviceType.CRITICAL),
    ...consolidateSlots(slots.high, Colors.HIGH, AdviceType.HIGH),
    ...consolidateSlots(slots.moderate, Colors.MODERATE, AdviceType.MODERATE),
    ...consolidateSlots(slots.low, Colors.LOW, AdviceType.LOW),
  ];
};

export const analyzeCompPrices = (energyPrices: EnergyPrice[]): TimeSlot[] => {
  const slots: CompSlotBuckets = {
    none: [],
    low: [],
    moderate: [],
    high: [],
  };

  energyPrices.forEach(({ datetime, price }) => {
    const date = new Date(datetime);
    const hour = date.getHours();

    if (price === 0) slots.none.push(hour);
    else if (price < 0.04) slots.low.push(hour);
    else if (price < 0.08) slots.moderate.push(hour);
    else if (price > 0.08) slots.high.push(hour);
  });

  return [
    ...consolidateSlots(slots.moderate, Colors.SURPLUS_COMPENSATION_MODERATE, AdviceType.SURPLUS_COMPENSATION_MODERATE),
    ...consolidateSlots(slots.high, Colors.SURPLUS_COMPENSATION_HIGH, AdviceType.SURPLUS_COMPENSATION_HIGH),
    ...consolidateSlots(slots.low, Colors.SURPLUS_COMPENSATION_LOW, AdviceType.SURPLUS_COMPENSATION_LOW),
    ...consolidateSlots(slots.none, Colors.SURPLUS_COMPENSATION_NONE, AdviceType.SURPLUS_COMPENSATION_NONE),
  ];
};

export const formatTime = (time: number): string => {
  const hours = Math.floor(time);
  const minutes = Math.round((time - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}