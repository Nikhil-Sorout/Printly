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



// Dimensions
const { width, height } = Dimensions.get('window')


const settings = () => {

    // Log out alert
    const [showAlertDialog, setShowAlertDialog] = React.useState(false)
    const handleClose = () => setShowAlertDialog(false)

    // Modal logic
    const [showModal, setShowModal] = useState(false)
    const handleAddItem = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false)

    // Handle log out
    const handleLogOut = () => {
        console.log('logging out')
    }

    // Get settings options and pass `handleAddItem`
    const settingsOptionsList = settingsOptions(handleAddItem);  

    // Function to render setting options
    const renderOption = ({ item }: { item: settingsOption }) =>
    (
        <>
            <Divider />
            <Pressable style={styles.settingItem} onPress={item.onPress}>
                <Text style={styles.itemName}>{item.name}</Text>
            </Pressable>
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
            <Button onPress={() => setShowAlertDialog(true)} style={{ backgroundColor: '#9893DA' }}>
                <ButtonText>Log Out</ButtonText>
            </Button>
            <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
                <AlertDialogBackdrop />
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <Heading className="text-typography-950 font-semibold" size="md">
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
                        >
                            <ButtonText style={{ color: '#9893DA' }}>No</ButtonText>
                        </Button>
                        <Button style={{ backgroundColor: '#9893DA' }} size="sm" onPress={handleLogOut}>
                            <ButtonText>Yes</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            {/* Add items modal */}
            <AddItemModal isVisible={showModal} onClose={handleCloseModal} />
        </SafeAreaView>
    )
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: width * .03,
        gap: height * .05
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'serif',
        textAlign: 'center',
        color: '#9893DA'
    },
    settingItem: {
        width: width * .9,
        padding: width * .03
    },
    itemName: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'sans'
    }
})

export default settings