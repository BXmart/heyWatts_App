import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StyleSheet, Text } from 'react-native';

const UnderstandYourBillCTA = () => {
  const router = useRouter();

  const handleCTApress = () => {
    console.log('here');
    router.push('/understand-your-bill');
  };
  return (
    <TouchableOpacity style={styles.fab} onPress={handleCTApress} activeOpacity={0.8}>
      <Text style={styles.fabText}>Entiende tu factura</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#4ADE80', // green color
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 999,
  },
  fabText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
});
export default UnderstandYourBillCTA;
