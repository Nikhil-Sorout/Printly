import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalCloseButton,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@/components/ui/modal"
import { Heading } from './ui/heading'
import { CloseIcon, Icon } from './ui/icon'
import { Switch } from "@/components/ui/switch"
import { useTheme } from '@/app/context/themeContext'

const {width, height} = Dimensions.get('window')

const ToggleThemeModal = ({ isVisible, onClose }: { isVisible: boolean, onClose: () => void }) => {
    const {theme, isDark, toggleTheme} = useTheme()

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
                        Change Theme
                    </Heading>
                    <ModalCloseButton>
                        <Icon
                            as={CloseIcon}
                            size="md"
                            className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
                        />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody contentContainerStyle={styles.modalBody}>
                    <Switch
                        size="lg"
                        isDisabled={false}
                        trackColor={{ false: 'grey', true: "white" }}
                        thumbColor={"#9893DA"}
                        onToggle={toggleTheme}
                        value={isDark}
                    />

                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContent:{
        gap: height*.02
    },
    modalBody: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ToggleThemeModal