// theme.ts

// 1. import `extendTheme` function
import {extendTheme, type ThemeConfig} from '@chakra-ui/react';

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const styles = {
  global: {
    body: {
      bg: 'black',
      color: 'white',
    },
  },
};

// 3. extend the theme
export const appTheme: ThemeConfig = extendTheme({config, styles});
