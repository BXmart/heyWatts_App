import * as React from "react";
import { Dimensions, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import CircularTimeRange from "./CircularTimeRange.component";
import { TimeSlot } from "../../utils/circularTimeRangeUtils";
import { Modal } from "react-native-paper";
import CircularTimeRangeWrapper from "./CircularTimeRangeWrapper.component";
const CircularTimeRangesSwiper = ({ energySlots, compSlots }: { energySlots: TimeSlot[]; compSlots: TimeSlot[] }) => {
  const width = Dimensions.get("window").width;
  const [index, setIndex] = React.useState<number>(0);

  const data = [
    { type: "energy", slots: energySlots },
    { type: "comp", slots: compSlots },
  ];

  return (
    <>
      {/* <Modal isVisible={visibleHelp.isOpen} onBackdropPress={() => setVisibleHelp({ isOpen: false, data: null })} style={styles.modal}>
        {renderModalContent()}
      </Modal> */}
      <View style={{ flexDirection: "column", alignItems: "center", alignContent: "center", justifyContent: "center" }}>
        <Carousel
          loop
          width={width / 1.7}
          height={width / 2}
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
    </>
  );
};

export default CircularTimeRangesSwiper;
