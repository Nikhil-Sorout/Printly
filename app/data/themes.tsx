export type ThemeType = {
  background: string;
  cardBackground: string;
  buttonBackground: string;
  text: string;
  primary: string;
  border: string;
  shadow: string;
  buttonText: string;
  neutralText: string;
  // Gluestack specific colors
  $light: {
    primary: string;
    secondary: string;
    tertiary: string;
    success: string;
    error: string;
    warning: string;
    muted: string;
  };
  $dark: {
    primary: string;
    secondary: string;
    tertiary: string;
    success: string;
    error: string;
    warning: string;
    muted: string;
  };
};

export const lightTheme: ThemeType = {
  // Main app colors - Using a teal/mint palette
  background: '#F8FAFB',
  cardBackground: '#FFFFFF',
  buttonBackground: "#2DD4BF",
  text: "#0F766E",
  primary: "#2DD4BF",
  border: "#CBD5E1",
  shadow: "#64748B20",
  buttonText: "#FFFFFF",
  neutralText: "#475569",
  
  // Gluestack specific tokens
  $light: {
    primary: '#2DD4BF',
    secondary: '#0F766E',
    tertiary: '#E2E8F0',
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
    muted: '#64748B'
  },
  $dark: {
    primary: '#2DD4BF',
    secondary: '#0F766E',
    tertiary: '#1E293B',
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
    muted: '#94A3B8'
  }
};

export const darkTheme: ThemeType = {
  // Main app colors - Dark mode version
  background: "#0F172A",
  cardBackground: "#1E293B",
  buttonBackground: "#2DD4BF",
  text: "#F8FAFC",
  primary: "#2DD4BF",
  border: "#334155",
  shadow: "#00000040",
  buttonText: "#FFFFFF",
  neutralText: "#CBD5E1",
  
  // Gluestack specific tokens
  $light: {
    primary: '#2DD4BF',
    secondary: '#0F766E',
    tertiary: '#E2E8F0',
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
    muted: '#64748B'
  },
  $dark: {
    primary: '#2DD4BF',
    secondary: '#0F766E',
    tertiary: '#1E293B',
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
    muted: '#94A3B8'
  }
};