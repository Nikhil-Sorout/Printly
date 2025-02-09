import { Text, View, StyleSheet, Dimensions, FlatList, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Bar, CartesianChart, useChartPressState } from 'victory-native'
import { salesData } from '@/app/data/salesData'
import { Circle, LinearGradient, useFont, vec } from '@shopify/react-native-skia'
import { SharedValue, useDerivedValue, useSharedValue } from 'react-native-reanimated'
import { Text as SkiaText } from '@shopify/react-native-skia'
import {
    Select,
    SelectTrigger,
    SelectInput,
    SelectIcon,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectItem,
} from "@/components/ui/select"
import { ChevronDownIcon } from '@/components/ui/icon'
import YearlySalesAnalysis from '@/components/YearlySalesAnalysis'
import ItemSales from '@/components/ItemSales'
import TopSellingItems from '@/components/TopSellingItems'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'



// Dimensions of screen

const { width, height } = Dimensions.get("window")

const salesAnalysis = () => {


    return (
        <SafeAreaView style={styles.container}>
            <Pressable style={{alignSelf: 'flex-start'}} onPress={()=>router.back()}>
                <Ionicons name='arrow-back-circle-outline' size={30} color={"#9893DA"} />
            </Pressable>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
                <YearlySalesAnalysis />
                <ItemSales />
                <TopSellingItems />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: height * .01,
        gap: height * .02,
        backgroundColor: '#F6F6FF',
    },
    scrollView: {
        gap: height * .02
    },
})

export default salesAnalysis