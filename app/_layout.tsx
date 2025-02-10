import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Provider } from "react-redux";
import { store } from "./redux/store"; // Adjust this path to point to your store
import React from "react";
import { StatusBar } from "expo-status-bar";
import { CurrencyProvider } from "./context/currencyContext";
import { ThemeProvider } from "./context/themeContext";


export default function RootLayout() {
  return (
    <CurrencyProvider>
      <GluestackUIProvider mode="light">
        <Provider store={store}>
          <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(Onboarding)" />
            </Stack>
          </ThemeProvider>
          <StatusBar style="dark" />
        </Provider>
      </GluestackUIProvider>
    </CurrencyProvider>
  );
}
