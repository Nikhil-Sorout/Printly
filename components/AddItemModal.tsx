import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { AddIcon, AlertCircleIcon, CloseIcon, Icon } from '@/components/ui/icon';
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';


const { width, height } = Dimensions.get('window')

const AddItemModal = ({ isVisible, onClose}: { isVisible: boolean, onClose: ()=>void}) => {

  
    const saveItem = () => {
        const isCategoryInvalid = category.length <= 0
        const isPriceInvalid = price.length <= 0
        const isItemInvalid = item.length <= 0

        setIsCategoryInvalid(isCategoryInvalid)
        setIsItemInvalid(isItemInvalid)
        setIsPriceInvalid(isPriceInvalid)

        if (!isCategoryInvalid && !isItemInvalid && !isPriceInvalid) {
            onClose();
        }
    }


    const [category, setCategory] = useState('')
    const [item, setItem] = useState('')
    const [price, setPrice] = useState('')

    const [isCategoryInvalid, setIsCategoryInvalid] = React.useState(false)
    const [isItemInvalid, setIsItemInvalid] = React.useState(false)
    const [isPriceInvalid, setIsPriceInvalid] = React.useState(false)

    return (
        <>
            {/* Add items modal */}
            <Modal isOpen={isVisible} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#9893DA' }}>Add Item</Text>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} size="md" />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody contentContainerStyle={styles.modalBody}>

                        {/* Category */}
                        <FormControl
                            style={styles.formControl}
                            isInvalid={isCategoryInvalid}
                            size="md"
                            isDisabled={false}
                            isReadOnly={false}
                            isRequired={false}
                        >
                            <FormControlLabel>
                                <FormControlLabelText style={styles.label}>Category</FormControlLabelText>
                            </FormControlLabel>
                            <Input style={styles.input} size='md'>
                                <InputField
                                    placeholder="Enter category of item"
                                    value={category}
                                    onChangeText={(text) => setCategory(text)}
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
                            isDisabled={false}
                            isReadOnly={false}
                            isRequired={false}
                        >
                            <FormControlLabel>
                                <FormControlLabelText style={styles.label}>Name</FormControlLabelText>
                            </FormControlLabel>
                            <Input style={styles.input} size='md'>
                                <InputField
                                    placeholder="Enter name of item"
                                    value={item}
                                    onChangeText={(text) => setItem(text)}
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
                                <FormControlLabelText style={styles.label}>Price</FormControlLabelText>
                            </FormControlLabel>
                            <Input style={styles.input} size='md'>
                                <InputField
                                    keyboardType='numeric'
                                    placeholder="Enter price of item"
                                    value={price}
                                    onChangeText={(text) => setPrice(text)}
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
                        <Button style={styles.addItemsBtn} size="md" variant="solid" action="primary" onPress={saveItem}>
                            <ButtonText>Done</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal></>
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
        color: "#9893DA",
        fontWeight: 'bold'
    },
    input: {
        borderColor: '#9893DA'
    },
    addItemsBtn: {
        backgroundColor: '#9893DA'
    },
})


export default AddItemModal