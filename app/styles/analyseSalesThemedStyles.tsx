import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { useTheme } from '../context/themeContext'

const {width, height} = Dimensions.get('window')

const analyseSalesThemedStyles = () => {
    const {theme} = useTheme();

  return StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: height * .01,
        gap: height * .02,
        backgroundColor: theme.background,
    },
    scrollView: {
        gap: height * .02
    },
  })
}

export default analyseSalesThemedStyles