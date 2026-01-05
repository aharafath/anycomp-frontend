import { createTheme } from "@mui/material/styles";
import { Red_Hat_Display } from "next/font/google";

const redHatDisplay = Red_Hat_Display({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});
const theme = createTheme({
  palette: {
    primary: {
      main: "#222222",
    },
    secondary: {
      main: "#002f70",
    },
  },
  typography: {
    fontFamily: redHatDisplay.style.fontFamily,
  },
});

export { theme, redHatDisplay };
