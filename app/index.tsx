import { View, Text, Dimensions, StyleSheet, Image, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'
import OnboardingThemedStyles from './styles/OnboardingThemedStyles'

// Dimensions of screen
const { width, height } = Dimensions.get('window')

const index = () => {

    // Handle Get Started
    const handlePress = ()=>{
        router.replace('/screens/(Onboarding)/signUp')
    }
    
    const styles = OnboardingThemedStyles()

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../assets/images/Onboarding.jpg')} style={styles.img} />
            <Text style={styles.welcomeText}>Welcome to Printly! Simplify billing, track sales, and manage your shop effortlessly.</Text>
            <Pressable style={styles.button} onPress={handlePress}>
                    <Text style={styles.buttonText}>Get Started</Text>     
            </Pressable>
        </SafeAreaView>
    )
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