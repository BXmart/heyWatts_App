import { useTabsContext } from '@/context/TabsContext';
import useAuthStore from '@/stores/useAuthStore';
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Dropdown } from 'react-native-element-dropdown';

const PropertySelector = () => {
  const { currentProperty, setCurrentProperty } = useAuthStore();
  const { propertiesList } = useTabsContext();

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={propertiesList}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={'Sectiona una propiedad'}
      searchPlaceholder="Search..."
      value={currentProperty}
      onChange={(item) => {
        setCurrentProperty(item.value);
      }}
    />
  );
};

export default PropertySelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0F242A',
  },
  dropdown: {
    height: 30,
    width: 'auto',
    borderColor: '#DBFFE8',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    color: '#DBFFE8',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#DBFFE8',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#DBFFE8',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
