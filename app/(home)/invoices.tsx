import 'react-native-reanimated';
import useAuthStore from '@/stores/useAuthStore';
import { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useInvoices } from '@/hooks/useInvoicesHook';
import { getFeeTypeName } from '@/utils/getFeeTypeName';
import { formatInvoiceDate } from '@/utils/formatInvoiceDate';
import { roundNumber } from '@/utils/roundedNumber';
import { FontAwesome6, Feather } from '@expo/vector-icons';
import UnderstandYourBillCTA from '@/components/common/UnderstandYourBillCTA';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F242A',
    flex: 1,
    width: '100%',
  },
  pickerContainer: {
    margin: 16,
    backgroundColor: '#1B2B31',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    color: '#DBFFE8',
    height: 50,
  },
  card: {
    backgroundColor: '#1B2B31',
    margin: 16,
    borderRadius: 8,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DBFFE8',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amountContainer: {
    backgroundColor: '#035170',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  amount: {
    fontSize: 16,
    color: '#DBFFE8',
    fontWeight: '600',
  },
  period: {
    color: '#DBFFE8',
    fontSize: 14,
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DBFFE8',
    marginTop: 16,
    marginBottom: 8,
  },
  sectionDescription: {
    color: '#DBFFE8',
    opacity: 0.7,
    fontSize: 14,
    marginBottom: 12,
  },
  highlight: {
    color: '#4DB6AC',
    fontWeight: '500',
  },
  table: {
    marginTop: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2A3B41',
  },
  cell: {
    flex: 1,
    fontSize: 14,
  },
  cellHeader: {
    color: '#DBFFE8',
    opacity: 0.7,
    fontWeight: '500',
  },
  cellData: {
    color: '#DBFFE8',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noInvoiceText: {
    color: '#DBFFE8',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
});

const ContractedPowerTable = ({ data }: any) => {
  const tableData = [];

  if (data.powerKW) {
    if (data.codeFare === '2T') {
      tableData.push(
        { tramos: 'P1', cantidad: `${roundNumber(data.powerKW[0])} kW`, precio: `${roundNumber(data.tp_p1)} €/kW` },
        { tramos: 'P2', cantidad: `${roundNumber(data.powerKW[1])} kW`, precio: `${roundNumber(data.tp_p2)} €/kW` }
      );
    } else {
      for (let i = 0; i < 6; i++) {
        tableData.push({
          tramos: `P${i + 1}`,
          cantidad: `${roundNumber(data.powerKW[i])} kW`,
          precio: `${roundNumber(data[`tp_p${i + 1}`])} €/kW`,
        });
      }
    }
  } else {
    tableData.push({ tramos: 'P1', cantidad: '0 kW', precio: `${roundNumber(data.tp_p1)} €/kW` }, { tramos: 'P2', cantidad: '0 kW', precio: `${roundNumber(data.tp_p2)} €/kW` });
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>Término de potencia</Text>
      <Text style={styles.sectionDescription}>
        El <Text style={styles.highlight}>término de potencia</Text> en tu factura de luz es una cuota fija por la máxima potencia que puedes usar en cada tramo, garantizando su disponibilidad la uses
        o no. Si la superas, podrías enfrentar cortes o penalizaciones según tu tarifa.
      </Text>

      {data.powerKW ? (
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.cellHeader]}>Tramos</Text>
            <Text style={[styles.cell, styles.cellHeader]}>Tiene contratado por tramo...</Text>
            <Text style={[styles.cell, styles.cellHeader]}>Paga al día por tramo...</Text>
          </View>
          {tableData.map((row, index) => (
            <View key={index} style={styles.row}>
              <Text style={[styles.cell, styles.highlight]}>{row.tramos}</Text>
              <Text style={[styles.cell, styles.cellData]}>{row.cantidad}</Text>
              <Text style={[styles.cell, styles.cellData]}>{row.precio}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.sectionDescription}>Actualmente no dispone de datos de potencia contratada para mostrar en el detalle.</Text>
      )}
    </View>
  );
};

const ConsumedEnergyTable = ({ data }: any) => {
  const getEnergyTableData = () => {
    if (!data.energyConsumed) {
      return [
        { tramos: 'Punta', consumo: '0 kWh', precio: `${roundNumber(data.te_p1)} €/kWh` },
        { tramos: 'Llano', consumo: '0 kWh', precio: `${roundNumber(data.te_p2)} €/kWh` },
        { tramos: 'Valle', consumo: '0 kWh', precio: `${roundNumber(data.te_p3)} €/kWh` },
      ];
    }

    if (data.feeType === 6) {
      return [
        { tramos: 'Punta', consumo: `${roundNumber(data.energyConsumed[0])} kWh`, precio: `${roundNumber(data.te_p1)} €/kWh` },
        { tramos: 'Valle', consumo: `${roundNumber(data.energyConsumed[1])} kWh`, precio: `${roundNumber(data.te_p2)} €/kWh` },
      ];
    }

    const prices =
      data.feeType === 3
        ? Array(3).fill(`${roundNumber(data.t_o)} €/kWh`)
        : data.feeType === 4
        ? Array(3).fill('Variable')
        : [`${roundNumber(data.te_p1)} €/kWh`, `${roundNumber(data.te_p2)} €/kWh`, `${roundNumber(data.te_p3)} €/kWh`];

    return [
      { tramos: 'Punta', consumo: `${roundNumber(data.energyConsumed[0])} kWh`, precio: prices[0] },
      { tramos: 'Llano', consumo: `${roundNumber(data.energyConsumed[1])} kWh`, precio: prices[1] },
      { tramos: 'Valle', consumo: `${roundNumber(data.energyConsumed[2])} kWh`, precio: prices[2] },
    ];
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Término de energía</Text>
      <Text style={styles.sectionDescription}>
        El <Text style={styles.highlight}>término de energía</Text> es lo que pagas por la electricidad que realmente consumes, varía según la cantidad de energía que uses en cada tramo horario según
        tu tarifa.
      </Text>

      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={[styles.cell, styles.cellHeader]}>Tramos</Text>
          <Text style={[styles.cell, styles.cellHeader]}>Has consumido...</Text>
          <Text style={[styles.cell, styles.cellHeader]}>Al precio de...</Text>
        </View>
        {getEnergyTableData().map((row, index) => (
          <View key={index} style={styles.row}>
            <Text style={[styles.cell, styles.highlight]}>{row.tramos}</Text>
            <Text style={[styles.cell, styles.cellData]}>{row.consumo}</Text>
            <Text style={[styles.cell, styles.cellData]}>{row.precio}</Text>
          </View>
        ))}
      </View>

      {data.energyExported !== 0 && data.t_c !== 0 && (
        <View>
          <Text style={styles.sectionDescription}>
            Dispone de un <Text style={styles.highlight}>sistema de autoconsumo</Text>, y estos son los datos recogidos en esta factura:
          </Text>
          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={[styles.cell, styles.cellHeader]}>Energía vertida</Text>
              <Text style={[styles.cell, styles.cellHeader]}>Término de compensación</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.cell, styles.cellData]}>{data.energyExported ? `${data.energyExported} kWh` : '0 kWh'}</Text>
              <Text style={[styles.cell, styles.cellData]}>{`${data.t_c} €/kWh`}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default function InvoicesPage() {
  const { user } = useAuthStore();
  const { invoicesData } = useInvoices();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  useEffect(() => {
    if (invoicesData?.length > 0 && !selectedInvoiceId) {
      setSelectedInvoiceId(invoicesData[0]._id);
    }
  }, [invoicesData]);

  const selectedInvoice = invoicesData?.find((invoice: any) => invoice._id === selectedInvoiceId);

  if (!invoicesData || invoicesData.length === 0) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.noInvoiceText}>No hay facturas disponibles</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedInvoiceId} onValueChange={(itemValue) => setSelectedInvoiceId(itemValue)} style={styles.picker}>
          {invoicesData.map((invoice: any) => (
            <Picker.Item key={invoice._id} label={`Factura de ${formatInvoiceDate(invoice.invoiceDate)} - ${(invoice.total ?? 0).toFixed(2)}€`} value={invoice._id} />
          ))}
        </Picker>
      </View>
      {selectedInvoice && (
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Factura de {formatInvoiceDate(selectedInvoice.invoiceDate)}</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.amount}>{(selectedInvoice.total ?? 0).toFixed(2)} €</Text>
            </View>
          </View>
          <Text style={styles.period}>
            Empieza el {selectedInvoice.startInvoicingPeriod} y dura {selectedInvoice.durationInvoicingPeriod} día
            {selectedInvoice.durationInvoicingPeriod > 1 ? 's' : ''}
          </Text>

          <Text style={styles.sectionDescription}>
            Su tipo de tarifa es <Text style={styles.highlight}>{getFeeTypeName(selectedInvoice.feeType)}</Text>, y el tipo de acceso es{' '}
            <Text style={styles.highlight}>{selectedInvoice.codeFare}</Text>.
          </Text>

          <ContractedPowerTable data={selectedInvoice} />
          <ConsumedEnergyTable data={selectedInvoice} />
        </View>
      )}
      <UnderstandYourBillCTA />
    </ScrollView>
  );
}
