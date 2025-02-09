import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native'
import React from 'react'
import { Avatar } from './ui/avatar'
import { Icon } from './ui/icon'
import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'


const { width, height } = Dimensions.get('window')

const Header = () => {

    // Handle press on user icon
    const handlePress = ()=>{
        router.push('/screens/(Other)/settings')
    }

    return (
        <View style={styles.container}>
            <Text style={styles.appName}>Printly</Text>
            <Pressable onPress={handlePress}>
                <Avatar size='md' style={{ backgroundColor: '#9893DA' }}>
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
        color: '#9893DA',
        fontFamily: 'serif'
    }
})

export default Header