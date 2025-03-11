import { View, Text, StyleSheet, Dimensions, FlatList, Pressable } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { settingsOptions } from '@/app/data/settingsOptions'
import { settingsOption } from '@/app/data/settingsOptions'
import { Divider } from '@/components/ui/divider'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogBody,
    AlertDialogBackdrop,
} from "@/components/ui/alert-dialog"
import { Button, ButtonText } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import AddItemModal from '@/components/AddItemModal'
import SelectCurrencyModal from '@/components/SelectCurrencyModal'
import settingsThemedStyles from '@/app/styles/settingsThemedStyles'
import ToggleThemeModal from '@/components/ToggleThemeModal'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { useTheme } from '@/app/context/themeContext'



const settings = () => {

    const styles = settingsThemedStyles()
    const {theme} = useTheme()
    // Log out alert
    const [showAlertDialog, setShowAlertDialog] = React.useState(false)
    const handleClose = () => setShowAlertDialog(false)

    // Items Modal logic
    const [itemsModal, setItemsModal] = useState(false)
    const handleAddItem = () => setItemsModal(true);
    const closeItemModal = () => setItemsModal(false)

    // Currency Modal Logic
    const [currModal, setCurrModal] = useState(false)
    const handleSelectCurrency = ()=>setCurrModal(true)
    const closeCurrModal = ()=>setCurrModal(false)

    
    // Theme Modal Logic
    const [themeModal, setThemeModal] = useState(false)
    const handleToggleTheme = ()=>setThemeModal(true)
    const closeThemeModal = ()=>setThemeModal(false)

    // Transaction History navigation
    const handleTransactionHistory = () => {
        router.push('/screens/(Other)/transactionHistory');
    }

    // Handle log out
    const handleLogOut = async() => {
        await AsyncStorage.removeItem('userToken')
        router.replace('/screens/(Onboarding)/logIn')  
        console.log('logging out')
    }

    // Get settings options and pass `handleAddItem`
    const settingsOptionsList = settingsOptions(handleAddItem, handleSelectCurrency, handleToggleTheme);  
    settingsOptionsList.push({
        id: settingsOptionsList.length + 1,
        name: 'Transaction History',
        onPress: handleTransactionHistory
    });

    // Function to render setting options
    const renderOption = ({ item }: { item: settingsOption }) =>
    (
        <>
            <Pressable style={styles.settingItem} onPress={item.onPress}>
                <Text style={styles.itemName}>{item.name}</Text>
            </Pressable>
            <Divider />
        </>
    )

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Settings</Text>

            {/* Options */}
            <FlatList
                data={settingsOptionsList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderOption}
            />
            {/* Logout button */}
            <Button onPress={() => setShowAlertDialog(true)} style={{ backgroundColor: theme.buttonBackground }}>
                <ButtonText style={{color: theme.buttonText}}>Log Out</ButtonText>
            </Button>
            <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
                <AlertDialogBackdrop />
                <AlertDialogContent style={{backgroundColor: theme.background}}>
                    <AlertDialogHeader>
                        <Heading className="text-typography-950 font-semibold" size="md" style={{color: theme.neutralText}}>
                            Are you sure you want to log out?
                        </Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody className="mt-3 mb-4">
                    </AlertDialogBody>
                    <AlertDialogFooter className="">
                        <Button
                            variant="outline"
                            action="secondary"
                            onPress={handleClose}
                            size="sm"
                            style={{backgroundColor: theme.$light.primary}}
                        >
                            <ButtonText style={{ color: theme.buttonText }}>No</ButtonText>
                        </Button>
                        <Button style={{ backgroundColor: theme.$light.error }} size="sm" onPress={handleLogOut}>
                            <ButtonText style={{color: theme.buttonText}}>Yes</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            {/* Add items modal */}
            <AddItemModal isVisible={itemsModal} onClose={closeItemModal} addItem={true} />

            {/* Select currency modal */}
            <SelectCurrencyModal isVisible={currModal} onClose={closeCurrModal}/>

            {/* Toggle Theme modal*/}
            <ToggleThemeModal isVisible={themeModal} onClose={closeThemeModal}/>
        </SafeAreaView>
    )
}


export default settings