import * as React from "react";
import { Dimensions, Text, View, StyleSheet } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import CircularTimeRange from "./CircularTimeRange.component";
import { TimeSlot } from "../../utils/circularTimeRangeUtils";
import { Modal } from "react-native-paper";
import CircularTimeRangeWrapper from "./CircularTimeRangeWrapper.component";
const width = Dimensions.get("window").width;

const CircularTimeRangesSwiper = ({ energySlots, compSlots, showCompSlots = false }: { energySlots: TimeSlot[]; compSlots: TimeSlot[]; showCompSlots: boolean }) => {
  const [index, setIndex] = React.useState<number>(0);

  const data = showCompSlots
    ? [
        { type: "energy", slots: energySlots },
        { type: "comp", slots: compSlots },
      ]
    : [{ type: "energy", slots: energySlots }];

  return (
    <>
      {/* <Modal isVisible={visibleHelp.isOpen} onBackdropPress={() => setVisibleHelp({ isOpen: false, data: null })} style={styles.modal}>
        {renderModalContent()}
      </Modal> */}
      {showCompSlots ? (
        <View style={styles.card}>
          <Carousel
            loop
            width={width / 2.3}
            pagingEnabled={true}
            data={data}
            defaultIndex={0}
            onProgressChange={(index, slideProgress) => {
              if (slideProgress % 1 === 0) {
                setIndex(slideProgress);
              }
            }}
            renderItem={({ item, index }) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularTimeRangeWrapper slots={item.slots} type={index == 0 ? "energy" : "comp"} />
              </View>
            )}
          />
          <View style={{ flexDirection: "row", gap: 5, alignItems: "center", alignContent: "space-between" }}>
            {Array.from({ length: data.length }).map((_, i) => (
              <View
                key={`pagination-${i}`}
                style={{
                  backgroundColor: i === index ? "white" : "lightgray",
                  borderRadius: 5,
                  width: 8,
                  height: 8,
                }}
              />
            ))}
          </View>
        </View>
      ) : (
        <View
          style={{
            width: width / 1.7,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularTimeRangeWrapper slots={energySlots} type={"energy"} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: width / 2.7,
    height: "100%",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
  },
});

export default CircularTimeRangesSwiper;
