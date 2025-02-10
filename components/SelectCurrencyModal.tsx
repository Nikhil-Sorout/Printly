import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React, { useState } from 'react'
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalCloseButton,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@/components/ui/modal"
import {
    Select,
    SelectTrigger,
    SelectInput,
    SelectIcon,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectItem,
} from "@/components/ui/select"
import { Heading } from './ui/heading';
import { ChevronDownIcon, CloseIcon, Icon } from './ui/icon';
import { Button, ButtonText } from './ui/button';
import { useCurrency } from '@/app/context/currencyContext';


const { width, height } = Dimensions.get('window')

const SelectCurrencyModal = ({ isVisible, onClose }: { isVisible: boolean, onClose: () => void }) => {

    // Using currency context
    const { currency, setCurrency } = useCurrency();


    const handleCurrencyChange = (value: string) => {
        setCurrency(value as "INR" | "USD" | "EUR");
    };


    return (
        <Modal
            isOpen={isVisible}
            onClose={onClose}
            size="md"
        >
            <ModalBackdrop />
            <ModalContent style={styles.modalContent}>
                <ModalHeader>
                    <Heading size="md" className="text-typography-950">
                        Choose currency
                    </Heading>
                    <ModalCloseButton>
                        <Icon
                            as={CloseIcon}
                            size="md"
                            className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
                        />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <Select style={styles.select} selectedValue={currency} onValueChange={handleCurrencyChange} >
                        <SelectTrigger style={styles.trigger} variant="outline" size="md">
                            <SelectInput placeholder="Select currency" value={currency} />
                            <SelectIcon className="mr-3" as={ChevronDownIcon} />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator />
                                </SelectDragIndicatorWrapper>
                                <SelectItem label="INR (₹)" value="INR" />
                                <SelectItem label="USD ($)" value="USD" />
                                <SelectItem label="EUR (€)" value="EUR" />
                            </SelectContent>
                        </SelectPortal>
                    </Select>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="outline"
                        action="secondary"
                        onPress={onClose}
                    >
                        <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button
                        style={{ backgroundColor: '#9893DA' }}
                        onPress={onClose}
                    >
                        <ButtonText style={{ color: 'white' }}>Done</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContent: {
        gap: height * .02
    },
    select: {
        // height: height*.07,
    },
    trigger: {
        height: height * .05,
        justifyContent: 'space-between'
    },
})

export default SelectCurrencyModal