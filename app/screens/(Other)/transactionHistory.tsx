import { baseUrl } from '@/helper';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Modal, ScrollView, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApiError } from '@/app/hooks/useApiError';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/app/context/themeContext';
import { Feather } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { UIActivityIndicator } from 'react-native-indicators';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const { isModalVisible, errorDetails, hideError, showError } = useApiError();
    const { theme } = useTheme();
    interface Transaction {
        id: string;
        created_at: string;
        // Add other properties if needed
    }

    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    interface TransactionDetail {
        name: string;
        quantity: number;
        subtotal: number;
    }

    const [transactionDetails, setTransactionDetails] = useState<TransactionDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
    useEffect(() => {
        fetchTransactions();
    }, [startDate, endDate]);

    const fetchTransactions = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${baseUrl}/transactions`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    start_date: startDate ? startDate.toISOString() : null,
                    end_date: endDate ? endDate.toISOString() : null
                }
            });
            console.log(response)
            if (response.status !== 200) {
                showError(response.status);
                return;
            }
            setLoading(false);
            setTransactions(response.data.data.transactions);
        } catch (err) {
            console.log(err);
            showError(undefined, "Network Error Occured");
        }
    };

    const fetchTransactionDetails = async (t_id: string) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${baseUrl}/transactions/${t_id}/receipt`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status !== 200) {
                showError(response.status);
                return;
            }
            setSelectedTransaction(response.data.data.receipt);
            setTransactionDetails(response.data.data.receipt.items);
        } catch (err) {
            console.log(err);
            showError(undefined, "Network Error Occured");
        }
    };

    const renderTransaction = ({ item }: { item: { id: string; total_amount: number; created_at: string } }) => (
        <View style={[styles.transactionItem, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Text style={[styles.transactionText, { color: theme.text, fontWeight: 'bold' }]}>Transaction ID: {item.id}</Text>
            <Text style={styles.transactionText}>Total Amount: {item.total_amount}</Text>
            <Text style={styles.transactionText}>Date: {new Date(item.created_at).toLocaleDateString()}</Text>
            <Pressable style={{ position: 'absolute', right: 16, top: 16 }} onPress={() => fetchTransactionDetails(item.id)}>
                <Feather name="info" size={22} color={theme.primary} />
            </Pressable>
        </View>
    );

    const handleConfirmStartDate = (date: Date) => {
        setStartDatePickerVisibility(false);
        setStartDate(date);
    };

    const handleConfirmEndDate = (date: Date) => {
        setEndDatePickerVisibility(false);
        setEndDate(date);
    };

    console.log("TransactionHistory : ", transactions);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <UIActivityIndicator color={theme.primary} size={30}/>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.header, { color: theme.primary }]}>Transaction History</Text>
            <View style={styles.datePickerContainer}>
                <Pressable onPress={() => setStartDatePickerVisibility(true)} style={styles.datePickerButton}>
                    <Text style={{ color: theme.text }}>Start Date: {startDate ? startDate.toLocaleDateString() : 'Select Date'}</Text>
                </Pressable>
                <Pressable onPress={() => setEndDatePickerVisibility(true)} style={styles.datePickerButton}>
                    <Text style={{ color: theme.text }}>End Date: {endDate ? endDate.toLocaleDateString() : 'Select Date'}</Text>
                </Pressable>
            </View>
            <DateTimePickerModal
                isVisible={isStartDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmStartDate}
                onCancel={() => setStartDatePickerVisibility(false)}
            />
            <DateTimePickerModal
                isVisible={isEndDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmEndDate}
                onCancel={() => setEndDatePickerVisibility(false)}
            />
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTransaction}
            />
            <Modal
                visible={!!selectedTransaction}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setSelectedTransaction(null)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
                        <Text style={[styles.modalHeader, { color: theme.text }]}>Transaction ID: {selectedTransaction?.id}</Text>
                        <Text style={[styles.modalHeader, { color: theme.text }]}>Date: {new Date(selectedTransaction?.created_at ?? '').toLocaleDateString()}</Text>
                        <ScrollView>
                            {transactionDetails.map((item, index) => (
                                <View key={index} style={styles.itemDetail}>
                                    <Text style={[styles.itemText, { color: theme.text }]}>Name: {item.name}</Text>
                                    <Text style={[styles.itemText, { color: theme.text }]}>Quantity: {item.quantity}</Text>
                                    <Text style={[styles.itemText, { color: theme.text }]}>Total Price: {item.subtotal}</Text>
                                </View>
                            ))}
                        </ScrollView>
                        <Pressable onPress={() => setSelectedTransaction(null)} style={{ backgroundColor: theme.primary, padding: 10, borderRadius: 5, alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
                        </Pressable>
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    transactionItem: {
        padding: 16,
        borderBottomWidth: 1,
        marginBottom: 8,
        borderRadius: 8,
        elevation: 2
    },
    transactionText: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    modalContent: {
        width: '90%',
        padding: 20,
        borderRadius: 10,
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    itemDetail: {
        marginBottom: 10,
    },
    itemText: {
        fontSize: 16,
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    datePickerButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#E5E7EB',
    },
});

export default TransactionHistory;
