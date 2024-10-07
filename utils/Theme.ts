import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#BB86FC',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    border: '#272729',
    notification: '#03DAC6',
  },
};

export const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200EE',
    background: '#FFFFFF',
    card: '#F5F5F5',
    text: '#000000',
    border: '#E0E0E0',
    notification: '#03DAC6',
  },
};
