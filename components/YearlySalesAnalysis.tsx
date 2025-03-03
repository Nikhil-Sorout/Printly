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



const YearlySalesAnalysis = () => {

    const styles = yearlySalesAnalysisThemedStyles();

    const fontSize = 10;
    const font = useFont(require('../assets/fonts/SpaceMono-Regular.ttf'), fontSize);
    const toolTipFont = useFont(require('../assets/fonts/SpaceMono-Regular.ttf'), fontSize + 2);

    const [selectedYear, setSelectedYear] = useState(2024);

    const years = Array.from({ length: 6 }, (_, i) => 2020 + i);

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


    

    // Filter sales data based on the selected year
    const filteredData: Record<number, number> = transactionsData
        .filter((item) => new Date(item.date).getFullYear() === selectedYear)
        .reduce((acc, curr) => {
            const month = new Date(curr.date).getMonth() + 1; // Months are 0-indexed
            acc[month] = (acc[month] || 0) + curr.total_amount;
            return acc;
        }, {} as Record<number, number>);

    // Format data for the chart
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        sales: filteredData[i + 1] || 0, // Fill missing months with zero sales
    }));

    const maxSales = Math.max(...monthlyData.map((data) => data.sales), 100);

    if (!font) {
        return null; // Font is still loading
    }
   
    

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
                <Text style={styles.yearSalesLabel}>Yearly Sales</Text>

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

            {/* Bar Chart */}
            <CartesianChart
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
        </View>
    )
}



export default YearlySalesAnalysis