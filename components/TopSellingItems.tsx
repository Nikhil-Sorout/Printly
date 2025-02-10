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


const { width, height } = Dimensions.get('window')

const TopSellingItems = () => {

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

    const years = Array.from({ length: 6 }, (_, i) => 2020 + i);



    const getTopSellingItems = (transactionsData: transactionItem[], selectedYear: number, selectedMonth: number | null) => {
        const itemSales: Record<string, number> = {}; // Store total sales per item

        // Filter transactions by selected year and month
        transactionsData
            .filter((transaction) => {
                const date = new Date(transaction.date);
                return date.getFullYear() === selectedYear && date.getMonth() + 1 === selectedMonth;
            })
            .forEach((transaction) => {
                transaction.items.forEach((item) => {
                    itemSales[item.name] = (itemSales[item.name] || 0) + item.total_price;
                });
            });

        // Convert to array and sort by total sales (descending order)
        const sortedItems = Object.entries(itemSales)
            .map(([name, totalSales]) => ({ label: name, value: totalSales, color: generateRandomColor() }))
            .sort((a, b) => b.value - a.value) // Sort by sales (highest first)
            .slice(0, 5); // Get top 5 items

        return sortedItems;
    };

    const [selectedYear, setSelectedYear] = useState(2024);
    const [selectedMonth, setSelectedMonth] = useState<null | number>(1);

    const topItemsData = getTopSellingItems(transactionsData, selectedYear, selectedMonth);


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
    // if (topItemsData.length == 0) {
    //     return (<Text>Nothing to show here...</Text>)
    // }


    return (
        <View style={styles.container}>
            <View style={styles.yearlySales}>
                {/* Label */}
                <Text style={styles.yearSalesLabel}>Best sellers</Text>

                <View style={styles.picker}>
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

                    {/* month picker */}
                    <Select style={styles.yearPicker}
                        defaultValue={"Jan"}
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
        </View>
    )
}

function generateRandomColor(): string {
    // Generating a random number between 0 and 0xFFFFFF
    const randomColor = Math.floor(Math.random() * 0xffffff);
    // Converting the number to a hexadecimal string and padding with zeros
    return `#${randomColor.toString(16).padStart(6, "0")}`;
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


const styles = StyleSheet.create({
    container: {
        height: height * .5,
        width: width * .95,
        justifyContent: 'center',
        gap: height * .02,
        backgroundColor: '#F6F6FF',
        padding: height*.01,
        borderRadius: width*.02,
        elevation: 2
    },
    yearSalesLabel: {
        fontSize: 18,
        fontFamily: 'serif',
        textAlign: 'left'
    },
    yearlySales: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    yearPicker: {
        width: width * .2,
    },
    trigger: {
        height: height * .05
    },
    chart: {
        width: width * .8,
        height: height * .5,
        alignSelf: 'center',
    },
    picker: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: width * .01
    }
})

export default TopSellingItems