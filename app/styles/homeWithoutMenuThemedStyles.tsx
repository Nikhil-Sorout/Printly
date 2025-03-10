import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { useTheme } from '../context/themeContext'

const { width, height } = Dimensions.get("window")

const homeWithoutMenuThemedStyles = () => {

  const { theme } = useTheme();
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      padding: width * 0.03,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
      padding: height * .04,
      justifyContent: 'center',
      alignItems: 'center',
      gap: height * .02
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
      itemsText: {
      color: theme.neutralText,
      fontFamily: 'serif'
    },
    addItemsTxt: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.neutralText
    },
    addItemsBtn: {
      backgroundColor: theme.buttonBackground
    },
    modalBody: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      padding: 5
    },
    formControl: {
      width: width * .5
    },
    label: {
      color: theme.text,
      fontWeight: 'bold'
    },
    input: {
      borderColor: theme.border
    },
  })
}

export default homeWithoutMenuThemedStyles