import { router } from "expo-router"

export interface settingsOption{
    id: number,
    name: string,
    onPress: () => void
}
export const settingsOptions = (onShowItemsModal: () => void, onShowCurrModal:()=>void): settingsOption[] =>  [
    { id: 1, name: "Analyze Sales", onPress: () => router.push('/screens/(Other)/salesAnalysis') },
    { id: 2, name: "Add more items", onPress: onShowItemsModal },
    { id: 3, name: "Update/Delete item", onPress: onShowItemsModal },
    { id: 4, name: "Notifications", onPress: () => console.log("Profile") },
    { id: 5, name: "Privacy", onPress: () => console.log("Profile") },
    { id: 6, name: "Theme", onPress: () => console.log("Profile") },
    { id: 7, name: "Currency", onPress: onShowCurrModal },
]