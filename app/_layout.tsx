import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Provider } from "react-redux";
import { store } from "./redux/store"; // Adjust this path to point to your store
import React from "react";
import { StatusBar } from "expo-status-bar";


export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light"><Provider store={store}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(Onboarding)"/>
        </Stack>
        <StatusBar style="dark"/>
      </Provider></GluestackUIProvider>
  );
}
