import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native'
import React from 'react'
import { Avatar } from './ui/avatar'
import { Icon } from './ui/icon'
import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useTheme } from '@/app/context/themeContext'


const { width, height } = Dimensions.get('window')

const Header = () => {

    const {theme} = useTheme()

    // Handle press on user icon
    const handlePress = ()=>{
        router.push('/screens/(Other)/settings')
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.appName, {color: theme.primary}]}>Printly</Text>
            <Pressable onPress={handlePress}>
                <Avatar size='md' style={{ backgroundColor: theme.primary }}>
                    <Feather name='user' size={18} color={'white'} />
                </Avatar>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    appName: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'serif'
    }
})

export default Header