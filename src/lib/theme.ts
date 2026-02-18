import type { ThemeConfig } from "antd";

export const theme: ThemeConfig = {
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
