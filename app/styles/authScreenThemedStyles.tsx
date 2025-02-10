import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { useTheme } from '../context/themeContext'

const { width, height } = Dimensions.get('window')

const authScreenThemedStyles = () => {
    const { theme } = useTheme()
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            alignItems: 'center',
            justifyContent: 'center',
            gap: height * .02,
            padding: width * .05
        },
        img: {
            width: width * .4,
            height: height * .2,
            borderRadius: (width * .2) / 2,
        },
        appName: {
            fontSize: 22,
            fontFamily: 'serif',
            color: theme.text,
            fontWeight: 'bold'
        },
        formControl: {
            width: width * .9
        },
        label: {
            color: theme.text,
            fontWeight: 'bold'
        },
        input: {
            borderColor: theme.border
        },
        signInBtn: {
            backgroundColor: theme.buttonBackground,
        },
        footerTxt: {
            fontSize: 15,
            color: theme.neutralText,
            top: 15
        },
        loginTxt: {
            fontWeight: 'bold',
            color: theme.text
        }
    })
}


export default authScreenThemedStyles