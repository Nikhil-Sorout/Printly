import { router } from "expo-router"

export interface settingsOption{
    id: number,
    name: string,
    onPress: () => void
}
export const settingsOptions = (onShowItemsModal: () => void, onShowCurrModal:()=>void, onShowThemeModal:()=>void): settingsOption[] =>  [
    { id: 1, name: "Analyze Sales", onPress: () => router.push('/screens/(Other)/salesAnalysis') },
    { id: 2, name: "Add more items", onPress: onShowItemsModal },
    { id: 3, name: "Notifications", onPress: () => console.log("Profile") },
    { id: 4, name: "Privacy", onPress: () => console.log("Profile") },
    { id: 5, name: "Theme", onPress: onShowThemeModal},
    { id: 6, name: "Currency", onPress: onShowCurrModal },
]