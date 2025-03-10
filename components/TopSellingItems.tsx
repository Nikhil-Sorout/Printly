import { Text, View, StyleSheet, Dimensions, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Bar, CartesianChart, Pie, PolarChart, useChartPressState } from 'victory-native'
import { itemSalesData } from '@/app/data/itemSalesData'
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
import { transactionItem, transactionsData } from '@/app/data/transactionsData'
import itemSalesThemedStyles from '@/app/styles/itemSalesThemedStyles'
import { useTheme } from '@/app/context/themeContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { baseUrl } from '@/helper'
import { useApiError } from '@/app/hooks/useApiError'
import { useCurrency } from '@/app/context/currencyContext'
import { UIActivityIndicator } from 'react-native-indicators'



type bestSellingItem = {
    name: string;
    total_revenue: number;
}

const { width, height } = Dimensions.get('window')

const TopSellingItems = () => {

    const { isDark, theme } = useTheme()

    const [loading, setLoading] = useState(true)

    const { currency, currencySymbol } = useCurrency()

    const styles = itemSalesThemedStyles()

    const { isModalVisible, errorDetails, hideError, showError } = useApiError()

    const fontSize = 10;
    const font = useFont(require('../assets/fonts/SpaceMono-Regular.ttf'), fontSize);
    const toolTipFont = useFont(require('../assets/fonts/SpaceMono-Regular.ttf'), fontSize + 2);


    const months = [
        { label: "Jan", value: 1 },
        { label: "Feb", value: 2 },
        { label: "Mar", value: 3 },
        { label: "Apr", value: 4 },
        { label: "May", value: 5 },
        { label: "Jun", value: 6 },
        { label: "Jul", value: 7 },
        { label: "Aug", value: 8 },
        { label: "Sep", value: 9 },
        { label: "Oct", value: 10 },
        { label: "Nov", value: 11 },
        { label: "Dec", value: 12 },
    ];

    const years = Array.from({ length: 6 }, (_, i) => 2022 + i);

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<null | number>(new Date().getMonth() + 1);
    const [data, setData] = useState<bestSellingItem[]>([])



    const fetchData = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken')
            const response = await axios.get(`${baseUrl}/analytics/best-sellers`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    month: selectedMonth,
                    year: selectedYear
                }
            })
            console.log("Top Selling Items: ", response.data.data.best_sellers)
            if (response.status !== 200) {
                showError(response.status, response.data.message)
                return
            }
            setLoading(false)
            setData(response.data.data.best_sellers)
        }
        catch (err) {
            console.log("caught you ", err)
            showError(undefined, 'Network Error Occured')
        }
    }

    useEffect(() => {
        fetchData()
    }, [selectedYear, selectedMonth])


    const getTopSellingItems = (data: bestSellingItem[], selectedYear: number, selectedMonth: number | null) => {
        const itemSales: Record<string, number> = {}; // Store total sales per item

        // Filter transactions by selected year and month
        data
            .forEach((item: bestSellingItem) => {
                itemSales[item.name] = item.total_revenue;
            });

        // Convert to array and sort by total sales (descending order)
        const sortedItems = Object.entries(itemSales)
            .map(([name, totalSales]) => ({ label: name + `(${currencySymbol + itemSales[name]})`, value: totalSales, color: generateRandomColor(isDark) }))

        return sortedItems;
    };



    const topItemsData = getTopSellingItems(data, selectedYear, selectedMonth);


    // Handle month change
    const handleMonthChange = (value: string) => {
        setSelectedMonth(value === "null" ? null : parseInt(value, 10)); // Convert "null" to actual null
    };


    // Handle year change
    const handleYearChange = (value: string) => {
        const year = parseInt(value, 10); // Convert to number
        if (!isNaN(year)) {
            setSelectedYear(year); // Update state
        }
    };


    return (
        <>
            {loading ? (
                <UIActivityIndicator count={12} size={30} color={theme.primary} />
            ) : (data.length > 0 ? <View style={styles.container}>
                <View style={styles.yearlySales}>
                    {/* Label */}
                    <Text style={styles.yearSalesLabel}>Top Items</Text>

                    <View style={styles.picker}>
                        {/* Year picker */}

                        <Select style={styles.yearPicker}
                            defaultValue={new Date().getFullYear().toString()}
                            onValueChange={(value) => handleYearChange(value)}>
                            <SelectTrigger style={styles.trigger} variant="outline" size="sm">
                                <SelectInput placeholder={selectedYear.toString()} />
                                <SelectIcon className="mr-3" as={ChevronDownIcon} />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    {years.map((item) => (
                                        <SelectItem key={item.toString()} label={`${item}`} value={item.toString()} />
                                    ))}
                                </SelectContent>
                            </SelectPortal>
                        </Select>

                        {/* month picker */}
                        <Select style={styles.yearPicker}
                            defaultValue={months[new Date().getMonth()].label}
                            onValueChange={(value) => handleMonthChange(value)}>
                            <SelectTrigger style={styles.trigger} variant="outline" size="sm">
                                <SelectInput placeholder={selectedMonth?.toString()} />
                                <SelectIcon className="mr-3" as={ChevronDownIcon} />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    {months.map((item) => (
                                        <SelectItem key={item.value.toString()} label={`${item.label}`} value={item.value?.toString()} />
                                    ))}
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    </View>
                </View>

                {/* Pie chart */}
                {<PolarChart
                    data={topItemsData} // Use top-selling items data
                    labelKey={"label"} // Item names as labels
                    valueKey={"value"} // Total sales amount
                    colorKey={"color"} // Unique color per item
                    containerStyle={styles.chart}
                >
                    <Pie.Chart>
                        {({ slice }) => {
                            // ☝️ render function of each slice object for each pie slice with props described below
                            const { startX, startY, endX, endY } = calculateGradientPoints(
                                slice.radius,
                                slice.startAngle,
                                slice.endAngle,
                                slice.center.x,
                                slice.center.y
                            );

                            return (
                                <Pie.Slice>
                                    <Pie.Label font={font} color={"white"} />
                                    <LinearGradient
                                        start={vec(startX, startY)}
                                        end={vec(endX, endY)}
                                        colors={[slice.color, `${slice.color}50`]}
                                        positions={[0, 1]}
                                    />
                                </Pie.Slice>
                            );
                        }}
                    </Pie.Chart>
                </PolarChart>}
            </View> :
                <View style={styles.container}>
                    <View style={styles.yearlySales}>
                        {/* Label */}
                        <Text style={styles.yearSalesLabel}>Top Items</Text>

                        <View style={styles.picker}>
                            {/* Year picker */}

                            <Select style={styles.yearPicker}
                                defaultValue={new Date().getFullYear().toString()}
                                onValueChange={(value) => handleYearChange(value)}>
                                <SelectTrigger style={styles.trigger} variant="outline" size="sm">
                                    <SelectInput placeholder={selectedYear.toString()} />
                                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                                </SelectTrigger>
                                <SelectPortal>
                                    <SelectBackdrop />
                                    <SelectContent>
                                        <SelectDragIndicatorWrapper>
                                            <SelectDragIndicator />
                                        </SelectDragIndicatorWrapper>
                                        {years.map((item) => (
                                            <SelectItem key={item.toString()} label={`${item}`} value={item.toString()} />
                                        ))}
                                    </SelectContent>
                                </SelectPortal>
                            </Select>

                            {/* month picker */}
                            <Select style={styles.yearPicker}
                                defaultValue={months[new Date().getMonth()].label}
                                onValueChange={(value) => handleMonthChange(value)}>
                                <SelectTrigger style={styles.trigger} variant="outline" size="sm">
                                    <SelectInput placeholder={selectedMonth?.toString()} />
                                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                                </SelectTrigger>
                                <SelectPortal>
                                    <SelectBackdrop />
                                    <SelectContent>
                                        <SelectDragIndicatorWrapper>
                                            <SelectDragIndicator />
                                        </SelectDragIndicatorWrapper>
                                        {months.map((item) => (
                                            <SelectItem key={item.value.toString()} label={`${item.label}`} value={item.value?.toString()} />
                                        ))}
                                    </SelectContent>
                                </SelectPortal>
                            </Select>
                        </View>
                    </View>
                    <Text style={{ position: 'absolute', left: '50%', top: '50%', transform: [{ translateX: '-50%' }, { translateY: '-50%' }], textAlign: 'center' }}>No sales in this period</Text>
                </ View >
            )
            }
        </>
    )
}

// function generateRandomColor(): string {
//     // Generating a random number between 0 and 0xFFFFFF
//     const randomColor = Math.floor(Math.random() * 0xffffff);
//     // Converting the number to a hexadecimal string and padding with zeros
//     return `#${randomColor.toString(16).padStart(6, "0")}`;
// }

function generateRandomColor(
    isDarkTheme: boolean,
    options?: {
        saturation?: number,    // 0-100, default 70
        lightness?: number,     // 0-100, default 50
        variation?: number,     // 0-30, default 15
        hue?: number            // specific hue (0-360) or undefined for random
    }
): string {
    // Default values
    const saturation = options?.saturation ?? 70;
    const baseLightness = options?.lightness ?? 50;
    const variation = options?.variation ?? 15;

    // Generate random hue (0-360) or use specified hue
    const hue = options?.hue ?? Math.floor(Math.random() * 360);

    // Calculate appropriate lightness range based on theme
    let minLightness, maxLightness;
    if (isDarkTheme) {
        // For dark theme: brighter colors (55-85%)
        minLightness = 55;
        maxLightness = 85;
    } else {
        // For light theme: darker colors (30-60%)
        minLightness = 30;
        maxLightness = 60;
    }

    // Start with base lightness adjusted for theme
    let lightness = isDarkTheme ? baseLightness + 10 : baseLightness - 5;

    // Add random variation
    lightness += (Math.random() * variation * 2) - variation;

    // Ensure lightness stays within appropriate range for the theme
    lightness = Math.max(minLightness, Math.min(maxLightness, lightness));

    // Convert HSL to hex
    return hslToHex(hue, saturation, lightness);
}

/**
 * Converts HSL color values to hex string
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns Hex color string
 */
function hslToHex(h: number, s: number, l: number): string {
    // Convert saturation and lightness to fractions
    s /= 100;
    l /= 100;

    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };

    return `#${f(0)}${f(8)}${f(4)}`;
}



function calculateGradientPoints(
    radius: number,
    startAngle: number,
    endAngle: number,
    centerX: number,
    centerY: number
) {
    // Calculate the midpoint angle of the slice for a central gradient effect
    const midAngle = (startAngle + endAngle) / 2;

    // Convert angles from degrees to radians
    const startRad = (Math.PI / 180) * startAngle;
    const midRad = (Math.PI / 180) * midAngle;

    // Calculate start point (inner edge near the pie's center)
    const startX = centerX + radius * 0.5 * Math.cos(startRad);
    const startY = centerY + radius * 0.5 * Math.sin(startRad);

    // Calculate end point (outer edge of the slice)
    const endX = centerX + radius * Math.cos(midRad);
    const endY = centerY + radius * Math.sin(midRad);

    return { startX, startY, endX, endY };
}


export default TopSellingItems