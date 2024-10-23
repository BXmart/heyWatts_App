// 1 up
// 2 down
// 3 upDown
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { formatProposalDates } from "../formatProposalDates";
import { PowersDetail } from "@/components/proposals/utils/parsePowersDetails";

// Helper component for formatted date range
const DateRange = ({ details }: { details: PowersDetail }) => {
  const formattedDate =
    details.startDate && formatProposalDates(details.startDate)
      ? details.startDate !== details.endDate
        ? `${formatProposalDates(details.startDate)} hasta ${formatProposalDates(details.endDate)}`
        : formatProposalDates(details.startDate)
      : `${details.startDate} hasta ${details.endDate}`;

  return <Text style={styles.highlightText}>{formattedDate}</Text>;
};

export const setData = (powerType: number, details: PowersDetail) => {
  switch (powerType) {
    case 2:
      return {
        color: "green",
        icon: <MaterialCommunityIcons name="file-document-outline" size={24} color="#22C55E" />,
        title: "Modifique su potencia contratada",
        badgeText: "Posibilidad de ahorro",
        firstText: (
          <Text style={styles.baseText}>
            Evite gastos innecesarios disminuyendo su <Text style={styles.highlightText}>potencia contratada</Text>. Según los datos desde <DateRange details={details} />, deberías disminuir en los
            siguientes periodos:
          </Text>
        ),
        secondText: (
          <Text style={styles.baseText}>
            El coste del cambio es de <Text style={styles.highlightText}>{details.costPowChange ?? 0}€</Text>y te disminuirá el termino de potencia en solo{" "}
            <Text style={styles.highlightText}>{details.eurosSaving ?? 0}€</Text> al mes.
          </Text>
        ),
        showROI: true,
      };

    case 3:
      return {
        color: "green",
        icon: <MaterialCommunityIcons name="file-document-outline" size={24} color="#22C55E" />,
        title: "Modifique su potencia contratada",
        badgeText: "Posibilidad de ahorro",
        firstText: (
          <Text style={styles.baseText}>
            Evite posibles penalizaciones modificando su <Text style={styles.highlightText}>potencia contratada</Text>. Según los datos desde <DateRange details={details} />, deberías modificar en los
            siguientes periodos:
          </Text>
        ),
        secondText: (
          <View>
            <Text style={styles.baseText}>
              El coste del cambio es de <Text style={styles.highlightText}>{details.costPowChange ?? 0}€</Text>y te disminuirá el termino de potencia en solo{" "}
              <Text style={styles.highlightText}>{details.eurosSaving ?? 0}€</Text> al mes.
            </Text>
            {details.costPenalty && details.costPenalty > 0 && (
              <Text style={styles.baseText}>
                Sus costes por penalización han sido <Text style={styles.penaltyText}>{details.costPenalty ? (+details.costPenalty).toFixed(2) : 0}€</Text>.
              </Text>
            )}
          </View>
        ),
        showROI: true,
      };

    case 1:
      return {
        color: "red",
        icon: <MaterialCommunityIcons name="file-document-outline" size={24} color="#EF4444" />,
        badgeText: "Evite gastos innecesarios",
        title: "Modifique su potencia contratada",
        firstText: (
          <Text style={styles.baseText}>
            Evite posibles penalizaciones aumentando su <Text style={styles.highlightText}>potencia contratada</Text>. Según los datos desde <DateRange details={details} />, deberías aumentarla en los
            siguientes periodos:
          </Text>
        ),
        secondText: (
          <View>
            {details.costPenalty && details.costPenalty > 0 && (
              <Text style={styles.baseText}>
                Actualmente incurres en un coste de penalización por sobrepasar la potencia de <Text style={styles.penaltyText}>{details.costPenalty ? (+details.costPenalty).toFixed(2) : 0}€</Text>.
              </Text>
            )}
            <Text style={styles.baseText}>
              El coste del cambio es de <Text style={styles.highlightText}>{details.costPowChange ?? 0}€</Text>y te aumentará el termino de potencia en solo{" "}
              <Text style={styles.highlightText}>{details.eurosSaving ? (+details.eurosSaving).toFixed(2) : 0}€</Text> al mes.
            </Text>
          </View>
        ),
        showROI: true,
      };

    case 0:
    default:
      return {
        color: "green",
        icon: <MaterialCommunityIcons name="file-document-outline" size={24} color="#22C55E" />,
        title: "Su potencia contratada es óptima",
        badgeText: "Posibilidad de ahorro",
        firstText: <Text style={styles.baseText}>Sus potencias contratadas son óptimas y no necesita modificarla según sus datos</Text>,
        showROI: false,
      };
  }
};

const styles = {
  baseText: {
    fontSize: 14,
    color: "#DBFFE8", // mintGreen
    opacity: 0.9,
    lineHeight: 20,
  },
  highlightText: {
    fontWeight: "600",
    color: "#22C55E", // green
  },
  penaltyText: {
    fontWeight: "600",
    color: "#EF4444", // red
  },
};
