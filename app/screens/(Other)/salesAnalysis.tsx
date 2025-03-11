import { Text, View, StyleSheet, Dimensions, FlatList, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import YearlySalesAnalysis from '@/components/YearlySalesAnalysis'
import ItemSales from '@/components/ItemSales'
import TopSellingItems from '@/components/TopSellingItems'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import analyseSalesThemedStyles from '@/app/styles/analyseSalesThemedStyles'
import { useTheme } from '@/app/context/themeContext'



// Dimensions of screen

const { width, height } = Dimensions.get("window")

const salesAnalysis = () => {
    const {theme} = useTheme()

    const styles = analyseSalesThemedStyles()

    return (
        <SafeAreaView style={styles.container}>
            <Pressable style={{alignSelf: 'flex-start'}} onPress={()=>router.back()}>
                <Ionicons name='arrow-back-circle-outline' size={30} color={theme.primary} />
            </Pressable>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
                <YearlySalesAnalysis />
                <ItemSales />
                <TopSellingItems />
            </ScrollView>
        </SafeAreaView>
    )
}


export default salesAnalysis