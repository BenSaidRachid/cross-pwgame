import { theme as defaultTheme } from "@chakra-ui/core";

export default {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: {
      50: "#F4F9FE",
      100: "#E9F3FC",
      200: "#C7E1F9",
      300: "#A5CFF5",
      400: "#62ACED",
      500: "#1E88E5",
      600: "#1B7ACE",
      700: "#125289",
      800: "#0E3D67",
      900: "#092945",
    },
    dark: {
      50: "#F4F4F4",
      100: "#E9E9E9",
      200: "#C8C8C8",
      300: "#A6A6A6",
      400: "#646464",
      500: "#212121",
      600: "#1E1E1E",
      700: "#141414",
      800: "#0F0F0F",
      900: "#0A0A0A",
    },
  },
};
