import * as React from "react";
import { Dimensions, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import CircularTimeRange from "./CircularTimeRange.component";
import { TimeSlot } from "../../utils/circularTimeRangeUtils";
import { Modal } from "react-native-paper";
import CircularTimeRangeWrapper from "./CircularTimeRangeWrapper.component";

const CircularTimeRangesSwiper = ({ energySlots, compSlots }: { energySlots: TimeSlot[]; compSlots: TimeSlot[] }) => {
  const width = Dimensions.get("window").width;

  const data = [
    { type: "energy", slots: energySlots },
    { type: "comp", slots: compSlots },
  ];

  return (
    <>
      {/* <Modal isVisible={visibleHelp.isOpen} onBackdropPress={() => setVisibleHelp({ isOpen: false, data: null })} style={styles.modal}>
        {renderModalContent()}
      </Modal> */}
      <View style={{ flex: 1 }}>
        <Carousel
          loop
          width={width / 1.7}
          height={width / 2}
          pagingEnabled={true}
          data={data}
          renderItem={({ item, index }) => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>{index == 0 ? "Precio de la luz" : "Compensación por excedentes"}</Text>
              <CircularTimeRangeWrapper slots={item.slots} type={index == 0 ? "energy" : "comp"} />
            </View>
          )}
        />
      </View>
    </>
  );
};

export default CircularTimeRangesSwiper;
