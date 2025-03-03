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


const { width, height } = Dimensions.get("window")

const ItemSales = () => {


    const styles = itemSalesThemedStyles()

    const fontSize = 10;
    const font = useFont(require('../assets/fonts/SpaceMono-Regular.ttf'), fontSize);
    const toolTipFont = useFont(require('../assets/fonts/SpaceMono-Regular.ttf'), fontSize + 2);

    const [selectedMonth, setSelectedMonth] = useState<null | number>(1);
    const [selectedYear, setSelectedYear] = useState(2024);

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


    // Function to group total sales by category_id
    const getCategoryData = () => {
        const categorySales: Record<string, number> = {};

        transactionsData
            .filter((item) => {
                const date = new Date(item.date);
                return date.getFullYear() === selectedYear && (!selectedMonth || date.getMonth() + 1 === selectedMonth);
            })
            .forEach((transaction) => {
                transaction.items.forEach((item) => {
                    categorySales[item.category_name] = (categorySales[item.category_name] || 0) + item.total_price;
                });
            });

        return Object.keys(categorySales).map((category) => ({
            label: category, // Show category_id
            value: categorySales[category], // Total sales for that category
            color: generateRandomColor(), // Random color
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
        <View style={styles.container}>
            <View style={styles.yearlySales}>
                {/* Label */}
                <Text style={styles.yearSalesLabel}>Items Sales</Text>

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
            </PolarChart>
        </View>
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


function generateRandomColor(): string {
    // Generating a random number between 0 and 0xFFFFFF
    const randomColor = Math.floor(Math.random() * 0xffffff);
    // Converting the number to a hexadecimal string and padding with zeros
    return `#${randomColor.toString(16).padStart(6, "0")}`;
}



export default ItemSales