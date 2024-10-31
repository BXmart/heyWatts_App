import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

// You'll need to implement this function or import it from your lib
import { calculatePercentageChange } from '@/utils';
import { InvoiceData } from '@/services/dashboard.service';

const ComparisonRow: React.FC<{
  compareValue: number;
  percentageChange: string;
  comparisonText: string;
  noDataText: string;
}> = ({ compareValue, percentageChange, comparisonText, noDataText }) => {
  if (compareValue === null || compareValue === undefined) {
    return <Text style={styles.noDataText}>{noDataText}</Text>;
  }

  const isPositive = compareValue > 0;
  const isEqual = compareValue === 0;

  return (
    <View style={styles.comparisonRow}>
      {!isEqual && <Text style={[styles.changeIcon, isPositive ? styles.increaseText : styles.decreaseText]}>{isPositive ? '▲' : '▼'}</Text>}
      <Text style={[styles.changeValue, isPositive ? styles.increaseText : styles.decreaseText]}>
        {isEqual ? (
          <Text style={styles.comparisonText}>Igual que {comparisonText}</Text>
        ) : (
          <>
            {Math.abs(compareValue).toFixed(2)}
            <Text style={styles.unitText}>€ </Text>
            <Text style={styles.comparisonText}>
              ({percentageChange}%) {comparisonText}
            </Text>
          </>
        )}
      </Text>
    </View>
  );
};

const OwnerDashboardTopMoneyConsumedCard = ({ invoiceData }: { invoiceData: InvoiceData }) => {
  const { costLastWeek, costLastCicle, costActualCicle, costActualWeek } = invoiceData.comparative;

  const compareMonthCost = costActualCicle !== null && costLastCicle !== null ? costActualCicle - costLastCicle : null;
  const compareWeekCost = costActualWeek !== null && costLastWeek !== null ? costActualWeek - costLastWeek : null;

  const percentageMonthCost = costActualCicle !== null && costLastCicle !== null ? calculatePercentageChange(costActualCicle, costLastCicle) : '';
  const percentageWeekCost = costActualWeek !== null && costLastWeek !== null ? calculatePercentageChange(costActualWeek, costLastWeek) : '';

  const isOverallNegative = compareMonthCost !== null && compareMonthCost < 0 && compareWeekCost !== null && compareWeekCost < 0;

  return (
    <Card style={styles.card}>
      <View>
        <Text style={styles.headerText}>Energía mes en euros</Text>
        <View style={styles.contentContainer}>
          <Text style={[styles.mainNumber, isOverallNegative ? styles.decreaseText : styles.increaseText]}>
            {costActualCicle !== null ? costActualCicle.toFixed(2) : '0.00'}
            <Text style={styles.unitText}>€</Text>
          </Text>

          <View style={styles.comparisonsContainer}>
            <ComparisonRow compareValue={compareMonthCost || 0} percentageChange={percentageMonthCost} comparisonText="mes pasado" noDataText="Sin datos del mes pasado" />

            <ComparisonRow compareValue={compareWeekCost || 0} percentageChange={percentageWeekCost} comparisonText="semana pasada" noDataText="Sin datos de la semana pasada" />
          </View>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="cash-outline" size={24} color="#10B981" />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 130,
    width: 250,
    padding: 16,
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: 'transparent',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 4,
  },
  contentContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  mainNumber: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: -8,
  },
  unitText: {
    fontSize: 14,
    marginLeft: 4,
  },
  comparisonsContainer: {
    flexDirection: 'column',
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  changeValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  comparisonText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  increaseText: {
    color: '#10B981',
  },
  decreaseText: {
    color: '#EF4444',
  },
  noDataText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  iconContainer: {
    position: 'absolute',
    top: 20,
    right: 16,
  },
});

export default OwnerDashboardTopMoneyConsumedCard;
