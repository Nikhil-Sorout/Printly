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
            <ModalContent style={[styles.modalContent, {backgroundColor: theme.background}]}>
                <ModalHeader>
                    <Heading size="md" className="text-typography-950" style={{color: theme.text}}>
                        Change Theme
                    </Heading>
                    <ModalCloseButton>
                        <Icon
                            as={CloseIcon}
                            size="md"
                            color={theme.text}
                        />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody contentContainerStyle={styles.modalBody}>
                    <Switch
                        size="lg"
                        isDisabled={false}
                        trackColor={{ true: theme.border, false: theme.border }}
                        thumbColor={theme.primary}
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