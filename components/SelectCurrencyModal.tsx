import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
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
import { useTheme } from '@/app/context/themeContext';


const { width, height } = Dimensions.get('window')

const SelectCurrencyModal = ({ isVisible, onClose }: { isVisible: boolean, onClose: () => void }) => {

    // Using currency context
    const { currency, setCurrency } = useCurrency();

    const {theme} = useTheme()

    const currRef = useRef(currency);

    const handleCurrencyChange = (value: string) => {
        setCurrency(value as "INR" | "USD" | "EUR");
    };

    const onCancel = ()=>{
        setCurrency(currRef.current as "INR" | "USD" | "EUR");
        onClose();
    }

    return (
        <Modal
            isOpen={isVisible}
            onClose={onClose}
            size="md"
        >
            <ModalBackdrop />
            <ModalContent style={[styles.modalContent, {backgroundColor: theme.background}]}>
                <ModalHeader>
                    <Heading size="md" className="text-typography-950" style={{ color: theme.text }}>
                        Choose currency
                    </Heading>
                </ModalHeader>
                <ModalBody>
                    <Select style={[styles.select]} selectedValue={currency} onValueChange={handleCurrencyChange} >
                        <SelectTrigger style={[styles.trigger,{borderColor: theme.border}]} variant="outline" size="md">
                            <SelectInput style={{color:theme.neutralText}} placeholder="Select currency" value={currency} />
                            <SelectIcon className="mr-3" as={ChevronDownIcon} color={theme.text} />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent style={{backgroundColor: theme.background}}>
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator style={{backgroundColor: theme.neutralText}} />
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
                        // variant="outline"
                        action="secondary"
                        onPress={onCancel}
                        style={{backgroundColor: theme.$light.warning}}
                    >
                        <ButtonText style={{color:theme.buttonText}}>Cancel</ButtonText>
                    </Button>
                    <Button
                        style={{ backgroundColor: theme.$light.secondary }}
                        onPress={onClose}
                    >
                        <ButtonText style={{ color: theme.buttonText }}>Done</ButtonText>
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
        height: height*.05,
    },
    trigger: {
        height: height * .05,
        justifyContent: 'space-between',
    },
})

export default SelectCurrencyModal