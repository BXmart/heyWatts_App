import { ConsumptionGraphPointI } from '@/types/ConsumptionGraphPoint';
import { ProductionGraphPointI } from '@/types/ProductionGraphPoint';
import { PropertyDayHistoricI } from '@/types/PropertyDayHistoric';
import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

export async function fetchNewDayGraphData(callback: (propertyId: string, selectedDay: string) => Promise<PropertyDayHistoricI>, propertyId: string, selectedDay: string) {
  let data = await callback(propertyId!, selectedDay);

  const { historicConsumption, deviceList } = data;
  // Red eléctrica
  const consumptionCleanVatDays = new Set();
  const consumptionCleanVat: any = historicConsumption
    .filter((item: ConsumptionGraphPointI) => {
      const formattedDate = moment(item.createdAt, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
      return consumptionCleanVatDays.has(formattedDate) ? false : consumptionCleanVatDays.add(formattedDate);
    })
    .map((item: ConsumptionGraphPointI) => [moment(item.createdAt, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss.SSSZ'), item.cleanVat])
    .sort((a: any, b: any) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

  // Producción fotovoltaica
  const productionCleanVatDays = new Set();
  const productionCleanVat: any = historicConsumption
    .filter((item: ConsumptionGraphPointI) => {
      const formattedDate = moment(item.createdAt, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
      return productionCleanVatDays.has(formattedDate) ? false : productionCleanVatDays.add(formattedDate);
    })
    .map((item: ConsumptionGraphPointI) => [moment(item.createdAt, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss.SSSZ'), item.pvPower])
    .sort((a: any, b: any) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

  // Batería
  const consumptionBatteryDays = new Set();
  const consumptionBattery: any = historicConsumption
    .filter((item: ConsumptionGraphPointI) => {
      const formattedDate = moment(item.createdAt, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
      return consumptionBatteryDays.has(formattedDate) ? false : consumptionBatteryDays.add(formattedDate);
    })
    .map((item: ConsumptionGraphPointI) => [moment(item.createdAt, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss.SSSZ'), item.batteryPower])
    .sort((a: any, b: any) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

  // Red eléctrica sin valores negativos
  const positiveConsumption = consumptionCleanVat.map((value: any) => (value[1] <= 0 ? [value[0], 0] : value));

  function filterNegativeConsumption(consumptionCleanVat: any) {
    // value[0] -> Date, value[1] -> number to compare
    var negativeConsumption = [];
    let isZeroPositive = false;

    for (var i = 0; i < consumptionCleanVat.length; i++) {
      var value = consumptionCleanVat[i];

      if (i === 0 && value[1] <= 0) {
        isZeroPositive = true;
      }

      if (value[1] <= 0 && !isZeroPositive) {
        isZeroPositive = true;
        negativeConsumption.push([value[0], 0]);
        continue;
      }

      if (i < consumptionCleanVat.length - 1 && consumptionCleanVat[i + 1][1] > 0 && isZeroPositive) {
        isZeroPositive = false;
        negativeConsumption.push([value[0], 0]);
        continue;
      }

      if (value[1] <= 0) {
        negativeConsumption.push(value);
      } else {
        negativeConsumption.push([value[0], null]);
      }
    }
    return negativeConsumption;
  }

  const negativeConsumption = filterNegativeConsumption(consumptionCleanVat);

  // Consumo total
  // function getTotalConsumption(production: any, consumption: any) {
  //   const totalConsumption = [...consumption];

  //   for (let i = 0; i < production.length; i++) {
  //     const sameDay = consumption.find((point: string | number[]) => point[0] === production[i][0]);
  //     if (!!sameDay) {
  //       const index = totalConsumption.findIndex((point: string | number[]) => point[0] === production[i][0]);
  //       totalConsumption[index] = [production[i][0], production[i][1] + totalConsumption[index][1]];
  //     }
  //   }

  //   const totalConsumptionFixed = totalConsumption.map((item) => {
  //     const condition = item[1] < 0 ? 0 : item[1];
  //     return [item[0], condition];
  //   });

  //   return totalConsumptionFixed;
  // }

  function getTotalConsumptionWithBattery(production: any, consumption: any, battery: any) {
    const totalConsumption = [...consumption];

    for (let i = 0; i < production.length; i++) {
      const sameDay = consumption.find((point: string | number[]) => point[0] === production[i][0]);
      if (!!sameDay) {
        const index = totalConsumption.findIndex((point: string | number[]) => point[0] === production[i][0]);
        totalConsumption[index] = [production[i][0], production[i][1] + totalConsumption[index][1]];
      }
    }

    const totalConsumptionFixed = totalConsumption.map((item) => {
      const condition = item[1] < 0 ? 0 : item[1];
      return [item[0], condition];
    });

    const totalConsumptionWithBattery = [...totalConsumptionFixed];
    for (let i = 0; i < battery.length; i++) {
      const sameDay = totalConsumptionFixed.find((point: string | number[]) => point[0] === battery[i][0]);
      if (!!sameDay) {
        const index = totalConsumptionWithBattery.findIndex((point: string | number[]) => point[0] === battery[i][0]);
        totalConsumptionWithBattery[index] = [battery[i][0], (battery[i][1] < 0 ? Math.abs(battery[i][1]) : 0) + totalConsumptionWithBattery[index][1]];
      }
    }

    return totalConsumptionWithBattery;
  }
  const totalConsumption: any = getTotalConsumptionWithBattery(productionCleanVat, consumptionCleanVat, consumptionBattery);


  // Devices
  /* const historicDevices = deviceList?.map((item) => ({
    name: item.name,
    historic:
      item.historicDeviceAttribute.length > 0
        ? item.historicDeviceAttribute
          .map((item) => [moment(item.createdAt, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss.SSSZ'), +item.value])
          .sort((a: any, b: any) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
        : [],
  })); */

  return { productionCleanVat, positiveConsumption, negativeConsumption, totalConsumption, consumptionBattery, deviceList };
}
