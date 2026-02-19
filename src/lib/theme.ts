import type { ThemeConfig } from "antd";
import { theme as antdTheme } from "antd";

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: "#000000",
    borderRadius: 4,
    fontFamily: "inherit",
  },
  components: {
    Button: {
      primaryColor: "#ffffff",
      colorPrimary: "#000000",
      algorithm: true,
    },
    Table: {
      headerBg: "#ffffff",
      borderColor: "#f0f0f0",
    },
    Input: {
      activeBorderColor: "#000000",
      hoverBorderColor: "#000000",
    },
  },
};

export const darkTheme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: "#1677ff",
    borderRadius: 4,
    fontFamily: "inherit",
  },
  components: {
    Button: {
      algorithm: true,
    },
  },
};

// Default theme for non-dashboard pages (public form, login, thank-you)
export const theme = lightTheme;

