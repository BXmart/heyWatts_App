import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from '@expo/vector-icons/Entypo';

interface BillImages {
  [key: string]: ImageSourcePropType;
}

const billImages: BillImages = {
  page1: require('@/assets/images/bills/real-bill-iberdrola-01.png'),
  page2: require('@/assets/images/bills/real-bill-iberdrola-02.png'),
};

interface TourData {
  popupTitle: string;
  popupText?: string;
  text?: string;
}

interface Position {
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
}

interface TourPopupProps {
  data: TourData;
  visible: boolean;
  position: Position;
}

interface TourPointProps {
  number: string;
  position: Position;
  isActive: boolean;
  onPress: () => void;
}

interface NavigationControlsProps {
  activeSection: number;
  totalPoints: number;
  onNext: () => void;
  onPrev: () => void;
}

interface TourPoint {
  id: number;
  number: string;
  position: Position;
  popupPosition: Position;
}

interface PageConfig {
  points: TourPoint[];
}

interface TourConfig {
  pages: {
    [key: string]: PageConfig;
  };
}

interface BillTourProps {
  activeSection: number;
  onClickTourPoint: (id: number) => void;
  billData: {
    iberdrola: TourData[];
  };
}

const TourPopup: React.FC<TourPopupProps> = ({ data, visible, position }) => {
  if (!visible) return null;
  const isLongContent = data.isLongContent;
  console.log(position);
  return (
    <View style={[styles.popupContainer, position, isLongContent && styles.popupContainerLarge]}>
      <View style={[styles.popup, { position: 'relative', top: 0 }, isLongContent && styles.popupLarge]}>
        <Text style={styles.popupTitle}>{data.popupTitle}</Text>
        <ScrollView style={[styles.popupScrollView, isLongContent && styles.popupScrollViewLarge]} showsVerticalScrollIndicator={true}>
          <Text style={[styles.popupText, isLongContent && styles.popupTextLarge]}>{data.popupText || data.text}</Text>
        </ScrollView>
      </View>
    </View>
  );
};

const TourPoint: React.FC<TourPointProps> = ({ number, position, isActive, onPress }) => (
  <TouchableOpacity style={[styles.tourPoint, position, isActive && styles.tourPointActive]} onPress={onPress}>
    <Text style={styles.tourPointText}>{number}</Text>
  </TouchableOpacity>
);

const NavigationControls: React.FC<NavigationControlsProps> = ({ activeSection, totalPoints, onNext, onPrev }) => (
  <View style={styles.navigationContainer}>
    <View style={styles.navigationContent}>
      <TouchableOpacity style={[styles.navButton, activeSection === 1 && styles.navButtonDisabled]} onPress={onPrev} disabled={activeSection === 1}>
        <Entypo name="chevron-left" size={24} color={activeSection === 1 ? '#94A3B8' : '#FFFFFF'} />
        <Text style={[styles.navButtonText, activeSection === 1 && styles.navButtonTextDisabled]}>Anterior</Text>
      </TouchableOpacity>

      <View style={styles.pageIndicator}>
        <Text style={styles.pageIndicatorText}>
          {activeSection} de {totalPoints}
        </Text>
      </View>

      <TouchableOpacity style={[styles.navButton, activeSection === totalPoints && styles.navButtonDisabled]} onPress={onNext} disabled={activeSection === totalPoints}>
        <Text style={[styles.navButtonText, activeSection === totalPoints && styles.navButtonTextDisabled]}>Siguiente</Text>
        <Entypo name="chevron-right" size={24} color={activeSection === totalPoints ? '#94A3B8' : '#FFFFFF'} />
      </TouchableOpacity>
    </View>
  </View>
);

const TOUR_CONFIG: TourConfig = {
  pages: {
    page1: {
      points: [
        { id: 1, number: '1', position: { top: '15%', left: '24%' }, popupPosition: { top: 130, right: 5 } },
        { id: 2, number: '2', position: { top: '35%', left: '24%' }, popupPosition: { top: 242, right: 5 } },
      ],
    },
    page2: {
      points: [
        { id: 3, number: '3', position: { top: '1%', right: '45%' }, popupPosition: { top: 40, right: 14 } },
        { id: 4, number: '4', position: { top: '25%', right: '45%' }, popupPosition: { top: 185, left: 20 } },
        { id: 5, number: '5', position: { bottom: '38%', left: '23%' }, popupPosition: { top: 75, right: 0 } },
      ],
    },
  },
};

const BillTour: React.FC<BillTourProps> = ({ activeSection, onClickTourPoint, billData }) => {
  const getActivePage = (): string => {
    if ([1, 2].includes(activeSection)) return 'page1';
    if ([3, 4, 5].includes(activeSection)) return 'page2';
    return 'page1';
  };

  const totalPoints = Object.values(TOUR_CONFIG.pages).reduce((acc, page) => acc + page.points.length, 0);

  const handleNext = () => {
    if (activeSection < totalPoints) {
      onClickTourPoint(activeSection + 1);
    }
  };

  const handlePrev = () => {
    if (activeSection > 1) {
      onClickTourPoint(activeSection - 1);
    }
  };

  const activePage = getActivePage();
  const currentPagePoints = TOUR_CONFIG.pages[activePage].points;

  const tourData = billData.iberdrola;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {currentPagePoints.map((point) => (
            <TourPopup key={point.id} data={tourData[point.id - 1]} visible={activeSection === point.id} position={point.popupPosition} />
          ))}

          <ImageBackground source={billImages[activePage]} style={styles.billImage} resizeMode="contain">
            {currentPagePoints.map((point) => (
              <TourPoint key={point.id} number={point.number} position={point.position} isActive={activeSection === point.id} onPress={() => onClickTourPoint(point.id)} />
            ))}
            <Text style={styles.pageNumber}>Página {activePage.replace('page', '')}</Text>
          </ImageBackground>
        </View>
      </ScrollView>

      <NavigationControls activeSection={activeSection} totalPoints={totalPoints} onNext={handleNext} onPrev={handlePrev} />
    </View>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    zIndex: 10,
    width: '80%',
    maxwidth: 250,
  },

  popupContainerLarge: {
    width: '90%',
    maxWidth: 400,
    zIndex: 20, // Higher z-index for the larger popup
  },

  popup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: 300,
  },

  popupLarge: {
    maxHeight: 400,
    padding: 20,
  },

  popupScrollView: {
    maxHeight: 250,
  },

  popupScrollViewLarge: {
    maxHeight: 350,
  },

  popupText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    flexShrink: 1,
  },

  popupTextLarge: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },

  popupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },

  // Adjust your scrollContent style to account for the navigation bar
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 80, // Add padding to account for navigation bar
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    aspectRatio: 0.7,
    position: 'relative',
    backgroundColor: '#F5F5F5',
    height: 'auto',
  },
  billImage: {
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'relative',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    color: '#94A3B8',
    fontSize: 14,
  },
  tourPoint: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4ADE80',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tourPointActive: {
    backgroundColor: '#2563EB',
    transform: [{ scale: 1.2 }],
  },
  tourPointText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0F242A',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#2A3B41',
  },
  navigationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  navButtonDisabled: {
    backgroundColor: '#1F2937',
    opacity: 0.5,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 8,
  },
  navButtonTextDisabled: {
    color: '#94A3B8',
  },
  pageIndicator: {
    backgroundColor: '#1A2F36',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  pageIndicatorText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default BillTour;
