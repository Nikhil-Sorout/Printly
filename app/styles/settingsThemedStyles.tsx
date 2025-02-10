import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { useTheme } from '../context/themeContext'

const { width, height } = Dimensions.get('window')

const settingsThemedStyles = () => {

    const { theme } = useTheme();
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'flex-start',
            padding: width * .03,
            gap: height * .05
        },
        header: {
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'serif',
            textAlign: 'center',
            color: theme.primary
        },
        settingItem: {
            width: width * .9,
            padding: width * .03
        },
        itemName: {
            fontSize: 18,
            fontWeight: '600',
            fontFamily: 'sans'
        }
    })
}

export default settingsThemedStyles