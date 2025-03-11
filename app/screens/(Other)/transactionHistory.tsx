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
import { useCurrency } from '@/app/context/currencyContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';



const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const { isModalVisible, errorDetails, hideError, showError } = useApiError();
    const { theme, isDark } = useTheme();
    interface Transaction {
        id: string;
        created_at: string;
        // Add other properties if needed
    }
    const { currencySymbol, convertAmount } = useCurrency()

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



    const downloadCSV = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const shopId = await AsyncStorage.getItem('shop_id');

            const response = await axios.get(`${baseUrl}/transactions/export`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    start_date: startDate ? startDate.toISOString() : null,
                    end_date: endDate ? endDate.toISOString() : null,
                    shopId: shopId
                },
                responseType: 'arraybuffer' // Use arraybuffer instead of blob
            });

            // Convert arraybuffer to string (CSV format)
            const csvData = new TextDecoder('utf-8').decode(new Uint8Array(response.data));

            // Define file path
            const fileUri = FileSystem.documentDirectory + 'transactions.csv';

            // Write data to file
            await FileSystem.writeAsStringAsync(fileUri, csvData, {
                encoding: FileSystem.EncodingType.UTF8
            });

            // Share the file
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                console.log("Sharing is not available on this device");
            }
        } catch (err) {
            console.error(err);
            showError(undefined, "Network Error Occurred");
        }
    };

    const fetchTransactions = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const shopId = await AsyncStorage.getItem('shop_id')
            const response = await axios.get(`${baseUrl}/transactions`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    start_date: startDate ? startDate.toISOString() : null,
                    end_date: endDate ? endDate.toISOString() : null,
                    shopId: shopId
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
            const shopId = await AsyncStorage.getItem('shop_id')
            const response = await axios.get(`${baseUrl}/transactions/${t_id}/receipt`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    shopId: shopId
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
            <Text style={[styles.transactionText, { color: theme.neutralText }]}>Total Amount: {currencySymbol + " " + Number(convertAmount(item.total_amount)).toFixed(2)}</Text>
            <Text style={[styles.transactionText, { color: theme.neutralText }]}>Date: {new Date(item.created_at).toLocaleDateString()}</Text>
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
                <UIActivityIndicator color={theme.primary} size={30} />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.header, { color: theme.primary }]}>Transaction History</Text>
            <View style={styles.datePickerContainer}>
                <Pressable onPress={() => setStartDatePickerVisibility(true)} style={[styles.datePickerButton, { backgroundColor: theme.buttonBackground }]}>
                    <Text style={{ color: theme.buttonText }}>Start Date: {startDate ? startDate.toLocaleDateString() : 'Select Date'}</Text>
                </Pressable>
                <Pressable onPress={() => setEndDatePickerVisibility(true)} style={[styles.datePickerButton, { backgroundColor: theme.buttonBackground }]}>
                    <Text style={{ color: theme.buttonText }}>End Date: {endDate ? endDate.toLocaleDateString() : 'Select Date'}</Text>
                </Pressable>
            </View>
            <DateTimePickerModal
                isDarkModeEnabled={isDark}
                isVisible={isStartDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmStartDate}
                onCancel={() => setStartDatePickerVisibility(false)}
            />
            <DateTimePickerModal
                isDarkModeEnabled={isDark}
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
            <Pressable style={{ backgroundColor: theme.buttonBackground, padding: 8, justifyContent: 'center', alignContent: 'center', borderRadius: 8 }} onPress={downloadCSV}>
                <Text style={{ color: theme.buttonText, textAlign: 'center' }}>Download CSV</Text>
            </Pressable>
            <Modal
                visible={!!selectedTransaction}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setSelectedTransaction(null)}
            >
                <SafeAreaView style={[styles.modalContainer]}>
                    <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
                        <Text style={[styles.modalHeader, { color: theme.text }]}>Transaction ID: {selectedTransaction?.id}</Text>
                        <Text style={[styles.modalHeader, { color: theme.text }]}>Date: {new Date(selectedTransaction?.created_at ?? '').toLocaleDateString()}</Text>
                        <ScrollView>
                            {transactionDetails.map((item, index) => (
                                <View key={index} style={styles.itemDetail}>
                                    <Text style={[styles.itemText, { color: theme.neutralText }]}>Name: {item.name}</Text>
                                    <Text style={[styles.itemText, { color: theme.neutralText }]}>Quantity: {item.quantity}</Text>
                                    <Text style={[styles.itemText, { color: theme.neutralText }]}>Total Price: {currencySymbol + ' ' + convertAmount(item.subtotal).toFixed(2)}</Text>
                                </View>
                            ))}
                        </ScrollView>
                        <Pressable onPress={() => setSelectedTransaction(null)} style={{ backgroundColor: theme.buttonBackground, padding: 10, borderRadius: 5, alignItems: 'center' }}>
                            <Text style={{ color: theme.buttonText, fontWeight: 'bold' }}>Close</Text>
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
    },
});

export default TransactionHistory;
