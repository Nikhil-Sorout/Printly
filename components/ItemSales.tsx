import { Text, View, StyleSheet, Dimensions, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Bar, CartesianChart, Pie, PolarChart, useChartPressState } from 'victory-native'
import { Circle, LinearGradient, useFont, vec } from '@shopify/react-native-skia'
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
import itemSalesThemedStyles from '@/app/styles/itemSalesThemedStyles'
import { useApiError } from '@/app/hooks/useApiError'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { baseUrl } from '@/helper'
import { useTheme } from '@/app/context/themeContext'
import { useCurrency } from '@/app/context/currencyContext'
import { UIActivityIndicator } from 'react-native-indicators'


type categorySalesItem = {
    category: string,
    total_revenue: number
}

const { width, height } = Dimensions.get("window")

const ItemSales = () => {


    const { isModalVisible, errorDetails, showError, hideError } = useApiError()

    const { currencySymbol, convertAmount } = useCurrency()
    const { theme, isDark } = useTheme()

    const [loading, setLoading] = useState(true)

    const styles = itemSalesThemedStyles()

    const fontSize = 10;
    const font = useFont(require('../assets/fonts/SpaceMono-Regular.ttf'), fontSize);
    const toolTipFont = useFont(require('../assets/fonts/SpaceMono-Regular.ttf'), fontSize + 2);

    const [selectedMonth, setSelectedMonth] = useState<null | number>(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [data, setData] = useState([])


    useEffect(() => {
        fetchData()
    }, [selectedYear, selectedMonth])



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

    const years = Array.from({ length: 6 }, (_, i) => 2025 + i);

    const fetchData = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken')
            console.log(token)
            const shopId = await AsyncStorage.getItem('shop_id')
            const response = await axios.get(`${baseUrl}/analytics/category-sales`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    month: selectedMonth,
                    year: selectedYear,
                    shopId: shopId
                }
            })
            setLoading(false)
            console.log('category-sales data: ', response.data.data.category_sales)
            setData(response.data.data.category_sales)
            if (response.status !== 200) {
                showError(response.status, response.data.message)
                return
            }
        }
        catch (err) {
            console.log(err)
            showError(undefined, 'Network Error Occured')
        }
    }


    // Function to group total sales by category_id
    const getCategoryData = () => {
        const categorySales: Record<string, number> = {};

        data
            .forEach((item: categorySalesItem) => {
                categorySales[item.category] = item.total_revenue;
            });

        return Object.keys(categorySales).map((category) => ({
            label: category + ` (${currencySymbol} ${convertAmount(categorySales[category]).toFixed(2)})`, // Show category_id
            value: convertAmount(categorySales[category]), // Total sales for that category
            color: generateRandomColor(isDark), // Random color
        }));
    };

    // Get filtered data
    const filteredData = getCategoryData();

    if (!font) {
        return null; // Font is still loading
    }



    // Handle year change
    const handleYearChange = (value: string) => {
        const year = parseInt(value, 10); // Convert to number
        if (!isNaN(year)) {
            setSelectedYear(year); // Update state
        }
    };

    // Handle month change
    const handleMonthChange = (value: string) => {
        setSelectedMonth(value === "null" ? null : parseInt(value, 10)); // Convert "null" to actual null
    };


    return (
        <>
            {loading ? (<UIActivityIndicator count={12} size={30} color={theme.primary} />) : (data.length > 0 ? <View style={styles.container}>
                <View style={styles.yearlySales}>
                    {/* Label */}
                    <Text style={styles.yearSalesLabel}>Top Category</Text>

                    <View style={styles.picker}>
                        {/* Year picker */}

                        <Select style={styles.yearPicker}
                            defaultValue={selectedYear.toString()}
                            onValueChange={(value) => handleYearChange(value)}>
                            <SelectTrigger style={[styles.trigger, { borderColor: theme.border }]} variant="outline" size="sm">
                                <SelectInput style={{ color: theme.text }} placeholder={selectedYear.toString()} />
                                <SelectIcon className="mr-3" as={ChevronDownIcon} color={theme.text} />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent style={{ backgroundColor: theme.background }}>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator style={{ backgroundColor: theme.neutralText }} />
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
                            <SelectTrigger style={[styles.trigger, { borderColor: theme.border }]} variant="outline" size="sm">
                                <SelectInput style={{ color: theme.text }} placeholder={selectedMonth?.toString()} />
                                <SelectIcon className="mr-3" as={ChevronDownIcon} color={theme.text} />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent style={{ backgroundColor: theme.background }}>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator style={{ backgroundColor: theme.neutralText }} />
                                    </SelectDragIndicatorWrapper>
                                    {months.map((item) => (
                                        <SelectItem key={item.value.toString()} label={`${item.label}`} value={item.value?.toString()} />
                                    ))}
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    </View>
                </View>
                <PolarChart
                    containerStyle={styles.chart}
                    data={filteredData} // 👈 specify your data
                    labelKey={"label"} // 👈 specify data key for labels
                    valueKey={"value"} // 👈 specify data key for values
                    colorKey={"color"} // 👈 specify data key for color
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
                                    <Pie.Label radiusOffset={0.5} font={font} color={theme.neutralText} />
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
                </PolarChart>
            </View> :
                <View style={styles.container}>
                    <View style={styles.yearlySales}>
                        {/* Label */}
                        <Text style={styles.yearSalesLabel}>Top Category</Text>

                        <View style={styles.picker}>
                            {/* Year picker */}

                            <Select style={styles.yearPicker}
                                defaultValue={selectedYear.toString()}
                                onValueChange={(value) => handleYearChange(value)}>
                                <SelectTrigger style={[styles.trigger, { borderColor: theme.border }]} variant="outline" size="sm">
                                    <SelectInput style={{ color: theme.text }} placeholder={selectedYear.toString()} />
                                    <SelectIcon className="mr-3" as={ChevronDownIcon} color={theme.text} />
                                </SelectTrigger>
                                <SelectPortal>
                                    <SelectBackdrop />
                                    <SelectContent style={{ backgroundColor: theme.background }}>
                                        <SelectDragIndicatorWrapper>
                                            <SelectDragIndicator style={{ backgroundColor: theme.neutralText }} />
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
                                <SelectTrigger style={[styles.trigger, { borderColor: theme.border }]} variant="outline" size="sm">
                                    <SelectInput style={{ color: theme.text }} placeholder={selectedMonth?.toString()} />
                                    <SelectIcon className="mr-3" as={ChevronDownIcon} color={theme.text} />
                                </SelectTrigger>
                                <SelectPortal>
                                    <SelectBackdrop />
                                    <SelectContent style={{ backgroundColor: theme.background }}>
                                        <SelectDragIndicatorWrapper>
                                            <SelectDragIndicator style={{ backgroundColor: theme.neutralText }} />
                                        </SelectDragIndicatorWrapper>
                                        {months.map((item) => (
                                            <SelectItem key={item.value.toString()} label={`${item.label}`} value={item.value?.toString()} />
                                        ))}
                                    </SelectContent>
                                </SelectPortal>
                            </Select>
                        </View>
                    </View>
                    <Text style={{ position: 'absolute', left: '50%', top: '50%', transform: [{ translateX: '-50%' }, { translateY: '-50%' }], textAlign: 'center', color:theme.neutralText }}>No sales in this period</Text>
                </View>)
            }
        </>
    )
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


export default ItemSales