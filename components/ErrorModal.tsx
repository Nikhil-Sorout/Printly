import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/app/context/themeContext';

type ErrorModalProps = {
    isVisible: boolean;
    statusCode?: number;
    message?: string;
    onClose: () => void;
};

const { width } = Dimensions.get('window');

export const ErrorModal = ({ isVisible, statusCode, message, onClose }: ErrorModalProps) => {
    const { theme } = useTheme();

    const getErrorMessage = (code?: number) => {
        switch (code) {
            case 400:
                return 'Bad Request: Please check your input';
            case 401:
                return 'Unauthorized: Please login again';
            case 403:
                return 'Forbidden: You don\'t have permission';
            case 404:
                return 'Not Found: Resource doesn\'t exist';
            case 500:
                return 'Server Error: Please try again later';
            default:
                return message || 'Something went wrong';
        }
    };

    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContainer: {
            width: width * 0.8,
            maxWidth: 300,
            backgroundColor: theme.background,
            borderRadius: 10,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        modalContent: {
            alignItems: 'center',
        },
        errorCode: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.primary,
            marginBottom: 10,
        },
        errorMessage: {
            fontSize: 16,
            color: theme.text,
            textAlign: 'center',
            marginBottom: 20,
        },
        closeButton: {
            backgroundColor: theme.primary,
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 5,
        },
        closeButtonText: {
            color: theme.background,
            fontSize: 16,
            fontWeight: '500',
        },
    });

    return (
        <Modal
            transparent={true}
            visible={isVisible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.errorCode}>
                            {statusCode ? `Error ${statusCode}` : 'Error'}
                        </Text>
                        <Text style={styles.errorMessage}>
                            {getErrorMessage(statusCode)}
                        </Text>
                        <Pressable
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}; 