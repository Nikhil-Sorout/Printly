import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { useTheme } from '../context/themeContext'

const { width, height } = Dimensions.get('window')

const yearlySalesAnalysisThemedStyles = () => {
    const {theme} = useTheme();

    return StyleSheet.create({
        container: {
            height: height * .5,
            width: width * .95,
            justifyContent: 'center',
            gap: height * .02,
            backgroundColor: theme.cardBackground,
            padding: height * .01,
            borderRadius: width * .02,
            elevation: 2
        },
        yearSalesLabel: {
            fontSize: 18,
            fontFamily: 'serif',
            color: theme.neutralText
        },
        yearlySales: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        yearPicker: {
            width: width * .2,
        },
        trigger: {
            height: height * .05
        }
    })
}

export default yearlySalesAnalysisThemedStyles