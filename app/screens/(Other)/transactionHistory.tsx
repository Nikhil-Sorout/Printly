import { baseUrl } from '@/helper';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Modal, ScrollView, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApiError } from '@/app/hooks/useApiError';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/app/context/themeContext';
import { Feather } from '@expo/vector-icons';



const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const { isModalVisible, errorDetails, hideError, showError } = useApiError();
    const { theme } = useTheme();
    interface Transaction {
        id: string;
        created_at: string;
        // add other properties as needed
    }
    
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    interface TransactionDetail {
        name: string;
        quantity: number;
        subtotal: number;
    }

    const [transactionDetails, setTransactionDetails] = useState<TransactionDetail[]>([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const response = await axios.get(`${baseUrl}/transactions`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                if (response.status !== 200) {
                    showError(response.status)
                    return
                }
                setTransactions(response.data.data.transactions);
            } catch (err) {
                console.log(err);
                showError(undefined, "Network Error Occured")
            }
        };
        fetchTransactions();
    }, []);

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


    console.log(transactions)
    const renderTransaction = ({ item }: { item: { id: string; total_amount: number; created_at: string } }) => (
        <View style={[styles.transactionItem, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Text style={[styles.transactionText, { color: theme.text, fontWeight: 'bold' }]}>Transaction ID: {item.id}</Text>
            <Text style={styles.transactionText}>Total Amount: {item.total_amount}</Text>
            <Text style={styles.transactionText}>Date: {new Date(item.created_at).toLocaleDateString()}</Text>
            <Pressable style={{position:'absolute', right: 16, top: 16}} onPress={() => fetchTransactionDetails(item.id)}>
                <Feather name="info" size={22} color={theme.primary} />
            </Pressable>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.header, { color: theme.primary }]}>Transaction History</Text>
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
        // backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        // borderBottomColor: '#E5E7EB',
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
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
});

export default TransactionHistory;
