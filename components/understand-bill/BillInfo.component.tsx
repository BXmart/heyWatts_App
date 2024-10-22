import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BillInfo = () => {
  return (
    <View style={styles.tabContent}>
      {/* Introducción */}
      <View style={styles.section}>
        <Text style={styles.mainTitle}>Interacción de los Actores en la Factura Eléctrica</Text>
        <Text style={styles.introText}>Desde la generación de energía hasta el consumidor final, varios actores desempeñan roles clave:</Text>

        <View style={styles.actorsList}>
          <View style={styles.actorItem}>
            <View style={styles.actorHeader}>
              <View style={styles.bullet} />
              <Text style={styles.actorTitle}>Generación</Text>
            </View>
            <Text style={styles.actorDescription}>Compañías que producen electricidad a partir de diferentes fuentes de energía.</Text>
          </View>

          <View style={styles.actorItem}>
            <View style={styles.actorHeader}>
              <View style={styles.bullet} />
              <Text style={styles.actorTitle}>Mercado Mayorista (OMIE)</Text>
            </View>
            <Text style={styles.actorDescription}>Donde se compra y vende energía diariamente. Los precios pueden variar cada hora del día.</Text>
          </View>

          <View style={styles.actorItem}>
            <View style={styles.actorHeader}>
              <View style={styles.bullet} />
              <Text style={styles.actorTitle}>Transporte (REE)</Text>
            </View>
            <Text style={styles.actorDescription}>Se encarga de llevar la electricidad desde las plantas de generación hasta los puntos de distribución.</Text>
          </View>

          <View style={styles.actorItem}>
            <View style={styles.actorHeader}>
              <View style={styles.bullet} />
              <Text style={styles.actorTitle}>Distribución</Text>
            </View>
            <Text style={styles.actorDescription}>Compañías que operan redes locales que llevan la electricidad desde los puntos de alta tensión hasta los consumidores finales.</Text>
          </View>

          <View style={styles.actorItem}>
            <View style={styles.actorHeader}>
              <View style={styles.bullet} />
              <Text style={styles.actorTitle}>Comercialización</Text>
            </View>
            <Text style={styles.actorDescription}>Compañías que venden la energía al consumidor, ofreciendo diferentes tarifas y contratos.</Text>
          </View>

          <View style={styles.actorItem}>
            <View style={styles.actorHeader}>
              <View style={styles.bullet} />
              <Text style={styles.actorTitle}>Estado</Text>
            </View>
            <Text style={styles.actorDescription}>Regula el mercado y recauda impuestos a través del el IVA y el impuesto especial sobre la electricidad.</Text>
          </View>
        </View>
      </View>

      {/* Estructura de la Factura */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estructura de una factura de la luz</Text>
        <Text style={styles.sectionDescription}>
          En general, todos los actores involucrados en la factura de la luz cobran una cantidad sobre el importe que pagamos. A pesar de esto, la forma en que se presentan los datos no está
          completamente estandarizada. Sin embargo, existe una estructura que tiende a repetirse en todas las compañías, la cual se compone de cuatro puntos fundamentales:
        </Text>

        {/* 1. Término de Potencia */}
        <View style={styles.mainComponentCard}>
          <Text style={styles.mainComponentTitle}>1. Término de Potencia</Text>
          <Text style={styles.componentDescription}>
            El término de potencia es el coste fijo en tu factura. Se paga por la disponibilidad máxima de potencia eléctrica que puedes demandar al mismo tiempo. Si tu contrato es de mayor potencia,
            es como tener una tubería más grande por la que puede pasar más agua (electricidad) cuando lo necesites, pero también pagas más, independientemente de si la usas o no.
          </Text>

          <Text style={styles.subSectionTitle}>Tipos de Contratos de Potencia y Discriminación Horaria</Text>

          <View style={styles.subSection}>
            <Text style={styles.subComponentTitle}>Contrato Simple</Text>
            <Text style={styles.componentDescription}>
              Este es un contrato donde se establece una única potencia contratada que se aplica a todas las horas del día. Es ideal para consumidores con un uso constante de energía que no varía
              mucho entre día y noche.
            </Text>
          </View>

          <View style={styles.subSection}>
            <Text style={styles.subComponentTitle}>Contrato con Discriminación Horaria</Text>
            <Text style={styles.componentDescription}>
              En estos contratos, se pueden contratar distintas potencias para diferentes tramos horarios, permitiendo adaptar el consumo en función de las horas de mayor o menor costo de energía.
              Estos son los tipos más comunes:
            </Text>

            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Discriminación Horaria en Dos Periodos:</Text>
              <Text style={styles.componentDescription}>
                Ideal para consumidores que pueden concentrar su consumo en horas nocturnas. Las horas valle suelen ser desde las 22:00 o 23:00 hasta las 12:00 o 13:00 del día siguiente.
              </Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Discriminación Horaria en Tres Periodos:</Text>
              <Text style={styles.componentDescription}>
                Se divide el día en horas punta, llano y valle. Las horas punta y llano cubren la mayoría del día con precios más altos y moderados, respectivamente, mientras que las horas valle, que
                son las más económicas, son típicamente de medianoche a 8:00 AM.
              </Text>
            </View>
          </View>

          <View style={styles.subSection}>
            <Text style={styles.subComponentTitle}>Cómo Ajustar la Potencia Contratada</Text>
            <Text style={styles.componentDescription}>
              Puedes cambiar la potencia contratada contactando a tu compañía eléctrica. Es vital elegir correctamente, ya que si excedes la potencia contratada, se activa el ICP (Interruptor de
              Control de Potencia) cortando el suministro para evitar daños en la instalación.
            </Text>
          </View>
        </View>

        {/* 2. Término de Energía */}
        <View style={styles.mainComponentCard}>
          <Text style={styles.mainComponentTitle}>2. Término de Energía</Text>
          <Text style={styles.componentDescription}>
            Este término se refiere a lo que realmente consumes, es decir, cuánta electricidad usas. Es un coste variable y depende directamente de tus hábitos de consumo.
          </Text>

          <Text style={styles.subSectionTitle}>Tipos de Tarifas de Energía</Text>

          <View style={styles.subComponentContainer}>
            <View style={styles.tariffItem}>
              <Text style={styles.tariffTitle}>Tarifa Indexada:</Text>
              <Text style={styles.tariffDescription}>El precio varía según el mercado mayorista.</Text>
            </View>

            <View style={styles.tariffItem}>
              <Text style={styles.tariffTitle}>Tarifa Plana:</Text>
              <Text style={styles.tariffDescription}>Pagas un precio fijo mensual, independientemente de cuánto consumas.</Text>
            </View>

            <View style={styles.tariffItem}>
              <Text style={styles.tariffTitle}>PVPC:</Text>
              <Text style={styles.tariffDescription}>Precio Voluntario para el Pequeño Consumidor: Tarifa regulada por el gobierno, cambia cada hora del día.</Text>
            </View>

            <View style={styles.tariffItem}>
              <Text style={styles.tariffTitle}>Tarifas con Pagos Fijos:</Text>
              <Text style={styles.tariffDescription}>Por ejemplo, tres o seis precios fijos al día dependiendo del periodo de consumo.</Text>
            </View>
          </View>
        </View>

        {/* 3. Otros Cargos */}
        <View style={styles.mainComponentCard}>
          <Text style={styles.mainComponentTitle}>3. Otros Cargos en la Factura</Text>
          <View style={styles.subComponentContainer}>
            <View style={styles.chargeItem}>
              <Text style={styles.chargeTitle}>Alquiler de Equipos de Medición:</Text>
              <Text style={styles.componentDescription}>Pago por el contador de luz.</Text>
            </View>
            <View style={styles.chargeItem}>
              <Text style={styles.chargeTitle}>Servicios Adicionales:</Text>
              <Text style={styles.componentDescription}>Como seguros o servicios de mantenimiento que optes por contratar.</Text>
            </View>
          </View>
        </View>

        {/* 4. Impuestos */}
        <View style={styles.mainComponentCard}>
          <Text style={styles.mainComponentTitle}>4. Impuestos en la Factura de Electricidad</Text>
          <View style={styles.subComponentContainer}>
            <View style={styles.taxItem}>
              <Text style={styles.taxTitle}>Impuesto sobre la Electricidad:</Text>
              <Text style={styles.componentDescription}>
                Es un porcentaje del coste del consumo de energía y potencia contratada. Este impuesto apoya al mantenimiento de infraestructuras y servicios públicos relacionados con la energía.
              </Text>
            </View>
            <View style={styles.taxItem}>
              <Text style={styles.taxTitle}>IVA (Impuesto sobre el Valor Añadido):</Text>
              <Text style={styles.componentDescription}>
                Se aplica al total de la factura y es del 21% en España. Este impuesto es general para bienes y servicios y no es específico solo para la energía.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BillInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F242A",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#0F242A",
    borderBottomWidth: 0.5,
    borderBottomColor: "#2A3B41",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  activeTab: {
    backgroundColor: "transparent",
  },
  tabText: {
    color: "#8E9BA0",
    fontSize: 16,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    width: "50%",
    height: 4,
    backgroundColor: "#4ADE80",
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  mainTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#4ADE80",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 8,
  },
  sectionDescription: {
    color: "#B0BEC5",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  introText: {
    color: "#B0BEC5",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  componentCard: {
    backgroundColor: "#1A2F36",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  mainComponentCard: {
    backgroundColor: "#1A2F36",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4ADE80",
  },
  componentTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  mainComponentTitle: {
    color: "#4ADE80",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subSectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 12,
  },
  subSection: {
    marginTop: 16,
    marginBottom: 16,
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: "#2A3B41",
  },
  subComponentTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  detailSection: {
    marginTop: 12,
    marginBottom: 12,
  },
  detailTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 6,
  },
  subComponentContainer: {
    marginTop: 12,
  },
  tariffItem: {
    marginBottom: 12,
  },
  tariffTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
  },
  tariffDescription: {
    color: "#B0BEC5",
    fontSize: 14,
    lineHeight: 20,
  },
  chargeItem: {
    marginBottom: 12,
  },
  chargeTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
  },
  taxItem: {
    marginBottom: 16,
  },
  taxTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
  },
  componentDescription: {
    color: "#B0BEC5",
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    color: "#B0BEC5",
    fontSize: 16,
    lineHeight: 24,
  },
  actorsList: {
    borderLeftWidth: 2,
    borderLeftColor: "#2A3B41",
    paddingLeft: 20,
  },
  actorItem: {
    marginBottom: 20,
  },
  actorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4ADE80",
    marginRight: 12,
    marginLeft: -24,
  },
  actorTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  actorDescription: {
    color: "#B0BEC5",
    fontSize: 15,
    lineHeight: 22,
    paddingLeft: 0,
  },
});
