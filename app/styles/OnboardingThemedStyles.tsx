import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { useTheme } from '../context/themeContext'

const {width, height} = Dimensions.get('window')

const OnboardingThemedStyles = () => {
    
    const {theme} = useTheme();
    
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            alignItems: 'center',
            justifyContent: 'center',
            gap: height * .05,
            padding: width * .05
        },
        welcomeText: {
            color: theme.text,
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 15
        },
        img: {
            height: height * .4,
            width: width * .7,
            borderRadius: (width * .5) / 5,
        },
        button: {
            backgroundColor: theme.buttonBackground,
            padding: (width * .03),
            borderRadius: (width * .05) / 4
        },
        buttonText: {
            color: theme.buttonText,
            fontFamily: 'serif',
            fontSize: 15
        }
    })
}

export default OnboardingThemedStyles