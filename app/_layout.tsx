import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "./redux/store"; // Adjust this path to point to your store


export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
}
