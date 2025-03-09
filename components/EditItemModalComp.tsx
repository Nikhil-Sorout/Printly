import { useTheme } from '@/app/context/themeContext';
import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AddItemModal from './AddItemModal';



interface Item {
    name: string;
    price: number;
    category: string
}


const EditItemModal = ({ visible, onClose, onUpdatePrice, onDelete, deleteModalVisible, updateModalVisible, selectedItem, setDeleteModalVisible, setUpdatedModalVisible, fetchData }: { visible: boolean, onClose: () => void, onUpdatePrice: () => void, onDelete: () => void, deleteModalVisible: boolean, updateModalVisible: boolean, selectedItem:Item |null, setDeleteModalVisible:(visible:boolean)=>void, setUpdatedModalVisible:(visible:boolean)=>void, fetchData:()=>void}) => {


    const { theme } = useTheme();

    console.log('selected item' ,selectedItem)



    return (
        <>
            <Modal
                transparent
                visible={visible}
                animationType="slide"
                onRequestClose={onClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Select an option</Text>

                        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={onUpdatePrice}>
                            <Text style={[styles.buttonText, { color: theme.buttonText }]}>Update Price</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, { backgroundColor: theme.$light.error }]} onPress={()=>{
                            onClose()
                            setDeleteModalVisible(true)
                        }}>
                            <Text style={[styles.buttonText, { color: theme.buttonText }]}>Delete</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={[styles.cancelText, { color: theme.neutralText }]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            {/* Update Item modal */}
            <AddItemModal isVisible={updateModalVisible} onClose={()=>setUpdatedModalVisible(false)} fetchData={fetchData} addItem={false} ItemName={selectedItem?.name} ItemCategory={selectedItem?.category}/>

            {/* Delete Item Modal */}

            <Modal
                visible={deleteModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => { deleteModalVisible = false }}
            >
                <View style={[styles.backdrop,{backgroundColor: theme.shadow}]}>
                    <View style={[styles.deleteItemModalContainer,{backgroundColor: theme.cardBackground, // Theme-based card color
        borderColor: theme.border,}]}>
                        <Text style={[styles.heading,{ color: theme.text,}]}>Delete Item</Text>
                        <Text style={[styles.message,{color: theme.neutralText,}]}>
                            Are you sure you want to delete this item? This action cannot be undone.
                        </Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[styles.cancelButtonDeleteItem,{backgroundColor: theme.$light.muted, }]} onPress={() => {setDeleteModalVisible(false)}}>
                                <Text style={[styles.cancelButtonText,{ color: theme.buttonText,}]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.deleteButton,{ backgroundColor: theme.$light.error,}]} onPress={onDelete}>
                                <Text style={[styles.deleteButtonText,{ color: theme.buttonText,}]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15
    },
    button: {
        width: '100%',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600'
    },
    cancelButton: {
        marginTop: 10
    },
    cancelText: {
        fontSize: 14,
        fontWeight: '500'
    },
    backdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // Use theme shadow for backdrop
    },
    deleteItemModalContainer: {
        width: 300,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center', // Theme border color
        borderWidth: 1,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        // Theme text color
    },
    message: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
         // Theme neutral text color
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    cancelButtonDeleteItem: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
        alignItems: 'center',
        // Theme muted color for cancel
    },
    deleteButton: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        // Theme error color for delete
    },
    cancelButtonText: {
        fontWeight: 'bold',
        // Theme text color
    },
    deleteButtonText: {
        fontWeight: 'bold',
         // Theme button text color
    },
});

export default EditItemModal;
