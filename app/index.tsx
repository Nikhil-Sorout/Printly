import { View, Text, Dimensions, StyleSheet, Image, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router, Redirect } from 'expo-router'
import OnboardingThemedStyles from './styles/OnboardingThemedStyles'
import { useAuth } from './context/AuthContext'

// Dimensions of screen
const { width, height } = Dimensions.get('window')

const index = () => {
    const { userToken, isLoading } = useAuth()
    console.log(userToken);
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    // Redirect to the appropriate screen based on authentication state
    if (userToken) {
        return <Redirect href="/screens/(Home)" />
    }

    return <Redirect href="/screens/(Onboarding)/logIn" />
}

// // StyleSheet
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F6F6FF',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: height * .05,
//         padding: width * .05
//     },
//     welcomeText: {
//         color: "#9893DA",
//         fontWeight: 'bold',
//         textAlign: 'center',
//         fontSize: 15
//     },
//     img: {
//         height: height * .4,
//         width: width * .7,
//         borderRadius: (width * .5) / 5,
//     },
//     button: {
//         backgroundColor: "#9893DA",
//         padding: (width * .03),
//         borderRadius: (width * .05) / 4
//     },
//     buttonText: {
//         color: '#FFFFFF',
//         fontFamily: 'serif',
//         fontSize: 15
//     }
// })

export default index