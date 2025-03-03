import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { useTheme } from '../context/themeContext'

const { width, height } = Dimensions.get('window')

const itemSalesThemedStyles = () => {

    const {theme} = useTheme()

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
            alignItems: 'center'
        },
        yearPicker: {
            width: width * .2,
        },
        trigger: {
            height: height * .05
        },
        chart: {
            width: width * .8,
            height: height * .5,
            alignSelf: 'center'
        },
        picker: {
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: width * .01
        }
    })
}

export default itemSalesThemedStyles