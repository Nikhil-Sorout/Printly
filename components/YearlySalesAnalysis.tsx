import { Text, View, StyleSheet, Dimensions, FlatList } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Bar, CartesianChart, useChartPressState } from 'victory-native'
import { transactionItem, transactionsData } from '@/app/data/transactionsData'
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
import { useCurrency } from '@/app/context/currencyContext'
import yearlySalesAnalysisThemedStyles from '@/app/styles/yearlySalesAnalysisThemedStyles'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { baseUrl } from '@/helper'
import { useApiError } from '@/app/hooks/useApiError'
import { UIActivityIndicator } from 'react-native-indicators'
import { useTheme } from '@/app/context/themeContext'

const YearlySalesAnalysis = () => {

    const {theme} = useTheme()

    const { currency, currencySymbol } = useCurrency()

    const [loading, setLoading] = useState(true)

    const styles = yearlySalesAnalysisThemedStyles();

    const { showError, hideError, errorDetails, isModalVisible } = useApiError()

    const fontSize = 10;
    const font = useFont(require('../assets/fonts/SpaceMono-Regular.ttf'), fontSize);
    const toolTipFont = useFont(require('../assets/fonts/SpaceMono-Regular.ttf'), fontSize + 2);

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [yearlyData, setYearlyData] = useState([])

    const fetchData = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken')
            const response = await axios.get(`${baseUrl}/analytics/monthly`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        year: selectedYear
                    }
                }
            )
            console.log("yearly Data: ", response.data.data.monthly_sales)
            if (response.status !== 200) {
                showError(response.status, response.data.message)
                return
            }
            setLoading(false)
            setYearlyData(response.data.data.monthly_sales)
        }
        catch (err) {
            console.log("caught you ", err)
            showError(undefined, 'Network Error Occured')
        }
    }
    const monthlyData = transformToMonthlyData(yearlyData)

    useEffect(() => {
        fetchData()
    }, [selectedYear])

    function transformToMonthlyData(apiData: { month: string, total_sales: string }[]) {
        // Create an object to map months to sales amounts
        const salesByMonth: { [key: number]: number } = {};

        // Get current year
        const currentYear = new Date().getFullYear();

        // Process API data
        apiData.forEach(item => {
            // Parse the date from the API
            const date = new Date(item.month);

            // Get month number (1-12)
            const monthNum = date.getMonth() + 1;

            // Store the sales amount for this month
            salesByMonth[monthNum] = parseFloat(item.total_sales);
        });

        // Create the full 12-month array with zero values for missing months
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
            const month = i + 1;
            return {
                month,
                sales: salesByMonth[month] || 0,
                // Optional: You can also include month names if needed
                monthName: new Date(currentYear, i, 1).toLocaleString('default', { month: 'short' })
            };
        });

        return monthlyData;
    }

    const years = Array.from({ length: 6 }, (_, i) => 2022 + i);

    // Maintain the chart press state to make it interactive
    const { state, isActive } = useChartPressState({ x: 0, y: { sales: 0 } });

    const value = useDerivedValue(() => {
        return (state.y.sales.value.value.toString());
    })

    const textYPostion = useDerivedValue(() => {
        return state.y.sales.position.value - 15;
    }, [state])

    const textXPosition = useDerivedValue(() => {
        if (!toolTipFont) return 0
        return state.x.position.value - toolTipFont?.measureText(value.value.toString()).width / 2
    }, [state, toolTipFont])


    const maxSales = Math.max(...monthlyData.map((data) => data.sales), 100);

    if (!font) {
        return null; // Font is still loading
    }

    console.log("monthly data: ", monthlyData)

    const handleYearChange = (value: string) => {
        const year = parseInt(value, 10); // Convert to number
        if (!isNaN(year)) {
            setSelectedYear(year); // Update state
        }
    };




    return (
        <View style={styles.container}>
            <View style={styles.yearlySales}>
                {/* Label */}
                <Text style={styles.yearSalesLabel}>Monthly Sales in {currency}</Text>

                {/* Year picker */}
                <Select style={styles.yearPicker}
                    defaultValue={selectedYear.toString()}
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

            </View>

            {loading ? (
                <UIActivityIndicator size={30} color={theme.primary} />
            ) : (
                <>
                    {/* Bar Chart */}
                    < CartesianChart
                        data={monthlyData}
                        xKey={'month'}
                        yKeys={["sales"]}
                        chartPressState={state}
                        padding={5}
                        domain={{ y: [0, maxSales + 100] }}
                        domainPadding={{ left: 20, right: 20, top: 0 }}
                        axisOptions={{
                            font,
                            tickCount: 12,
                            labelColor: 'black',
                            lineColor: 'transparent',
                            formatXLabel: (value: any) => {
                                const date = new Date(2023, value - 1);
                                return date.toLocaleString("default", { month: "short" });
                            },
                        }}>
                        {({ points, chartBounds }) => (
                            <>
                                <Bar
                                    points={points.sales}
                                    chartBounds={chartBounds}
                                    animate={{ type: 'timing', duration: 1000 }}
                                    color="#9893DA"
                                    roundedCorners={{ topLeft: 5, topRight: 5 }}
                                    innerPadding={0.2}
                                    barCount={12}
                                >
                                    <LinearGradient
                                        start={vec(0, 0)} end={vec(0, 400)} colors={["#a78bfa", "#a78bfa50"]} />
                                </Bar>
                                {isActive ? (
                                    <>
                                        <SkiaText
                                            font={toolTipFont}
                                            color={'black'}
                                            x={textXPosition}
                                            y={textYPostion}
                                            text={value}
                                        />
                                        <Circle cx={state.x.position} cy={state.y.sales.position} r={5} color={'grey'} opacity={.8} />
                                    </>
                                ) : null}
                            </>
                        )}
                    </CartesianChart>
                </>
            )
            }
        </View >
    )
}



export default YearlySalesAnalysis