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

export default index