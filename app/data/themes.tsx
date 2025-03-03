export type ThemeType = {
  background: string;
  cardBackground: string;
  buttonBackground: string;
  text: string;
  primary: string;
  border: string;
  shadow: string;
  buttonText: string;
  neutralText: string
};

export const lightTheme: ThemeType = {
  background: '#FEFEFF',
  cardBackground: '#F6F6FF',
  buttonBackground: "#9893DA",
  text: "#9893DA",
  primary: "#9893DA",
  border: "#9893DA",
  shadow: "#00000050",
  buttonText: "#FFFFFF",
  neutralText: "grey"
};

export const darkTheme: ThemeType = {
  background: "#1E1E1E",
  cardBackground: "#2D2D2D",
  buttonBackground: "#9893DA",
  text: "#FFFFFF",
  primary: "#9893DA",
  border: "#9893DA",
  shadow: "#00000090",
  buttonText: "#FFFFFF",
  neutralText: "white"
};