import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { AddIcon, AlertCircleIcon, CloseIcon, Icon } from '@/components/ui/icon';
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { useCurrency } from '@/app/context/currencyContext';
import axios from 'axios';
import { baseUrl } from '@/helper';
import { ErrorModal } from './ErrorModal';
import { useApiError } from '@/app/hooks/useApiError';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/app/context/themeContext';

const { width, height } = Dimensions.get('window')

const AddItemModal = ({ isVisible, onClose, fetchData, addItem, ItemName, ItemCategory }: { isVisible: boolean, onClose: () => void, fetchData?: () => void, addItem: boolean, ItemName?: string, ItemCategory?: string }) => {

    const { theme } = useTheme()

    const { isModalVisible, errorDetails, showError, hideError } = useApiError();

    const { currency } = useCurrency()

    const [category, setCategory] = useState('')
    const [item, setItem] = useState('')
    const [price, setPrice] = useState('')

    const [isCategoryInvalid, setIsCategoryInvalid] = React.useState(false)
    const [isItemInvalid, setIsItemInvalid] = React.useState(false)
    const [isPriceInvalid, setIsPriceInvalid] = React.useState(false)


    const [localPrice, setLocalPrice] = useState('');
    const [localItem, setLocalItem] = useState('');
    const [localCategory, setLocalCategory] = useState('');


    // Debounce effect to update the main state after user stops typing
    useEffect(() => {
        const timeout = setTimeout(() => {
            setPrice(localPrice);
        }, 300); // 300ms delay

        return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }, [localPrice]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setItem(localItem);
        }, 300);

        return () => clearTimeout(timeout);
    }, [localItem]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCategory(localCategory);
        }, 300);

        return () => clearTimeout(timeout);
    }, [localCategory]);

    const updateItem = async () => {
        // const isCategoryInvalid = category.length <= 0
        const isPriceInvalid = price.length <= 0
        // const isItemInvalid = item.length <= 0

        // setIsCategoryInvalid(isCategoryInvalid)
        // setIsItemInvalid(isItemInvalid)
        setIsPriceInvalid(isPriceInvalid)


        const token = await AsyncStorage.getItem('userToken');
        const shopId = await AsyncStorage.getItem('shop_id')
        const api = axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }, params: {
                shopId: shopId
            }
        })
        if (!isPriceInvalid) {
            try {
                console.log(item, category, price, ItemName, ItemCategory)
                const response = await api.put(`/items/${ItemName}/${ItemCategory}`,
                    {
                        name: ItemName,
                        category: ItemCategory,
                        price: price
                    },

                )
                fetchData?.()
                if (response.status !== 200) {
                    showError(response.status)
                    return;
                }
                onClose()
            }
            catch (err) {
                console.log("Caught the error ", err);
                showError(undefined, "Network error occured");
            }
        }
    }



    const saveItem = async () => {
        const isCategoryInvalid = category.length <= 0
        const isPriceInvalid = price.length <= 0
        const isItemInvalid = item.length <= 0

        setIsCategoryInvalid(isCategoryInvalid)
        setIsItemInvalid(isItemInvalid)
        setIsPriceInvalid(isPriceInvalid)


        const token = await AsyncStorage.getItem('userToken');
        const shopId = await AsyncStorage.getItem('shop_id')
        const api = axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            params: {
                shopId: shopId
            }
        })

        if (!isCategoryInvalid && !isItemInvalid && !isPriceInvalid) {
            try {

                const response = await api.post(`/items`,
                    {
                        name: item,
                        price: price,
                        category: category,
                    }
                );
                // console.log(response);
                fetchData?.()
                if (response.status !== 201) {
                    showError(response.status)
                    return;
                }
                setCategory('')
                setPrice('')
                setItem('')
                onClose();

            }
            catch (err) {
                console.log("Caught the error ", err);
                showError(undefined, "Network error occured");
            }




        }
    }




    return (
        <>
            {/* Add items modal */}
            <Modal isOpen={isVisible} onClose={onClose}>
                <ModalContent style={{ backgroundColor: theme.background }}>
                    <ModalHeader>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}>{addItem ? 'Add Item' : 'Update Item'}</Text>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} size="md" color={theme.text} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody contentContainerStyle={styles.modalBody}>

                        {/* Category */}
                        <FormControl
                            style={styles.formControl}
                            isInvalid={isCategoryInvalid}
                            size="md"
                            isDisabled={addItem ? false : true}
                            isReadOnly={addItem ? false : true}
                            isRequired={false}
                        >
                            <FormControlLabel>
                                <FormControlLabelText style={[styles.label, { color: theme.text }]}>Category</FormControlLabelText>
                            </FormControlLabel>
                            <Input style={[{ borderColor: theme.border }]} size='md'>
                                <InputField
                                    placeholder={addItem ? "Enter category of item" : ItemCategory}
                                    value={category}
                                    placeholderTextColor={theme.neutralText}
                                    onChangeText={(text) => setCategory(text)}
                                    style={{ color: theme.neutralText }}
                                />
                            </Input>
                            <FormControlError>
                                <FormControlErrorIcon as={AlertCircleIcon} />
                                <FormControlErrorText>
                                    Category name is required.
                                </FormControlErrorText>
                            </FormControlError>
                        </FormControl>

                        {/* Item Name */}
                        <FormControl
                            style={styles.formControl}
                            isInvalid={isItemInvalid}
                            size="md"
                            isDisabled={addItem ? false : true}
                            isReadOnly={addItem ? false : true}
                            isRequired={false}
                        >
                            <FormControlLabel>
                                <FormControlLabelText style={[styles.label, { color: theme.text }]}>Name</FormControlLabelText>
                            </FormControlLabel>
                            <Input style={[{ borderColor: theme.border }]} size='md'>
                                <InputField
                                    placeholder={addItem ? "Enter name of item" : ItemName}
                                    value={item}
                                    onChangeText={(text) => setItem(text)}
                                    placeholderTextColor={theme.neutralText}
                                    style={{ color: theme.neutralText }}
                                />
                            </Input>
                            <FormControlError>
                                <FormControlErrorIcon as={AlertCircleIcon} />
                                <FormControlErrorText>
                                    Item name is required.
                                </FormControlErrorText>
                            </FormControlError>
                        </FormControl>

                        {/* Price */}
                        <FormControl
                            style={styles.formControl}
                            isInvalid={isPriceInvalid}
                            size="md"
                            isDisabled={false}
                            isReadOnly={false}
                            isRequired={false}
                        >
                            <FormControlLabel>
                                <FormControlLabelText style={[styles.label, { color: theme.text }]}>Price ({currency})</FormControlLabelText>
                            </FormControlLabel>
                            <Input style={[{ borderColor: theme.border }]} size='md'>
                                <InputField
                                    keyboardType='numeric'
                                    placeholder="Enter price of item"
                                    value={price}
                                    onChangeText={(text) => setPrice(text)}
                                    placeholderTextColor={theme.neutralText}
                                    style={{ color: theme.neutralText }}
                                />
                            </Input>
                            <FormControlError>
                                <FormControlErrorIcon as={AlertCircleIcon} />
                                <FormControlErrorText>
                                    Price of item is required.
                                </FormControlErrorText>
                            </FormControlError>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={[{ backgroundColor: theme.buttonBackground }]} size="md" variant="solid" action="primary" onPress={addItem ? saveItem : updateItem}>
                            <ButtonText style={{ color: theme.buttonText }}>Done</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <ErrorModal
                isVisible={isModalVisible}
                statusCode={errorDetails.statusCode}
                message={errorDetails.message}
                onClose={hideError}
            />
        </>
    )
}

const styles = StyleSheet.create({
    modalBody: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        padding: 5
    },
    formControl: {
        width: width * .5
    },
    label: {
        fontWeight: 'bold'
    }
})


export default AddItemModal