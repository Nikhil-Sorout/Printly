import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { useTheme } from '../context/themeContext'

const { width, height } = Dimensions.get("window")

const homeThemedStyles = () => {

    const { theme } = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            paddingVertical: height * 0.01
        },
        searchBar: {
            height: height * 0.05,
            borderColor: theme.border,
            borderWidth: 1,
            marginBottom: height * 0.02,
            paddingHorizontal: width * 0.03,
            borderRadius: 8,
            backgroundColor: theme.background,
            color: theme.neutralText,
        },
        categoryContainer: {
            marginBottom: height * 0.025,
            backgroundColor: theme.cardBackground,
            borderRadius: 8,
            padding: width * 0.04,
            elevation: 2
        },
        categoryTitle: {
            fontSize: width * 0.06,
            fontWeight: 'semibold',
            color: theme.text,
            marginBottom: height * 0.015,
            fontFamily: 'serif',
        },
        itemsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        itemBlock: {
            width: '48%',
            padding: width * 0.04,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 8,
            backgroundColor: theme.background,
            marginBottom: height * 0.015,
        },
        actionButtons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: height * 0.015,
        },
        addButton: {
            backgroundColor: theme.buttonBackground,
            paddingVertical: height * 0.01,
            paddingHorizontal: width * 0.03,
            borderRadius: 8,
            alignItems: 'center',
        },
        floatingButton: {
            position: 'absolute',
            bottom: height * 0.01,
            left: width * 0.05,
            backgroundColor: theme.background,
            padding: width * 0.04,
            borderRadius: 30,
            alignItems: 'center',
            borderColor: theme.border,
            borderWidth: 1,
        },
        cartButton: {
            position: 'absolute',
            bottom: height * 0.01,
            right: width * 0.05,
            backgroundColor: theme.background,
            borderColor: theme.border,
            borderWidth: 1,
            padding: width * 0.04,
            borderRadius: 30,
            alignItems: 'center',
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },
        modalContent: {
            width: '80%',
            backgroundColor: theme.background,
            borderRadius: 10,
            padding: width * 0.05,
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
        },
        modalText: {
            fontSize: width * 0.05,
            color: theme.text,
            paddingVertical: height * 0.015,
            textAlign: 'center',
            fontFamily: 'serif',
        },
        quantityContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            width: '100%',
        },
        quantityButton: {
            backgroundColor: theme.buttonBackground,
            padding: height * 0.005,
            width: width * 0.08,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
        },
        quantityText: {
            fontSize: width * 0.04,
            fontWeight: 'bold',
            marginHorizontal: width * 0.02,
            color: theme.neutralText,
        },
        modalTitle: {
            fontSize: width * 0.05,
            fontWeight: 'bold',
            color: theme.neutralText,
            marginBottom: height * 0.015,
            textAlign: 'center',
        },
        cartItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: height * 0.015,

        },
        cartItemText: {
            fontSize: width * 0.04,
            color: theme.neutralText,
        },
        cartSummary: {
            marginTop: height * 0.025,
            paddingTop: height * 0.015,
        },
        cartSummaryText: {
            fontSize: width * 0.045,
            fontWeight: 'bold',
            color: theme.neutralText,
            textAlign: 'center',
            marginBottom: height * 0.01,
        },
        cartButtons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: height * 0.025,
        },
        discardButton: {
            backgroundColor: '#FF6B6B',
            padding: height * 0.015,
            borderRadius: 8,
            flex: 1,
            marginRight: width * 0.02,
            alignItems: 'center',
        },
        printButton: {
            backgroundColor: theme.buttonBackground,
            padding: height * 0.015,
            borderRadius: 8,
            flex: 1,
            marginLeft: width * 0.02,
            alignItems: 'center',
        },
        itemsText:{
            color: theme.neutralText,
            fontFamily: 'serif'
          },
    })
}

export default homeThemedStyles