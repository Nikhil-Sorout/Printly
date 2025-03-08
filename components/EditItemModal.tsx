import { useTheme } from '@/app/context/themeContext';
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const EditItemModal = ({ visible, onClose, onUpdatePrice, onDelete}:{visible: boolean, onClose: ()=>void, onUpdatePrice:()=>void, onDelete:()=>void}) => {
    
    const { theme } = useTheme();   
    
    return (
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
                    
                    <TouchableOpacity style={[styles.button, { backgroundColor: theme.$light.error }]} onPress={onDelete}>
                        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Delete</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={[styles.cancelText, { color: theme.neutralText }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
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
    }
});

export default EditItemModal;
