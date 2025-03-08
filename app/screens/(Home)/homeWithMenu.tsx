import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, FlatList, Dimensions, TouchableWithoutFeedback, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { menuData } from '../../data/menuData';
import { cartSlice } from '../../redux/cartSlice';
import { Divider } from '@/components/ui/divider';
import { useCurrency } from '@/app/context/currencyContext';
import homeThemedStyles from '@/app/styles/homeThemedStyles';
import { Entypo } from '@expo/vector-icons';
import EditItemModal from '@/components/editItemModal';

interface ProcessedMenuItem {
    id: number;
    name: string;
    category: string;
    price: number; // Converted to number
    created_at: string;
    updated_at: string;
}

// Category group structure
interface CategoryGroup {
    id: string;
    name: string;
    items: ProcessedMenuItem[];
}

type MenuData = OldMenuItem[] | CategoryGroup[];

interface OldMenuItem {
    id: number;
    name: string;
    category: string;
    price: number;
    created_at: string;
    updated_at: string;
  }

interface Item {
    name: string;
    price: number;
}

interface CartItem {
    name: string;
    price: number;
    quantity: number;
}

interface CartState {
    items: Record<string, CartItem>;
    total: number;
    itemCount: number;
}

const { width, height } = Dimensions.get('window')

const home = ({ menuData }: { menuData: CategoryGroup[] }) => {

    console.log(menuData)

    const transformMenuData = (menuData: MenuData): CategoryGroup[]  => {
        if (Array.isArray(menuData) && menuData.length > 0 && 'category' in menuData[0]) {
            const oldMenu = menuData as OldMenuItem[];
            const groupedData: Record<string, CategoryGroup> = {};

            oldMenu.forEach(({ category, id, name, price, created_at, updated_at }) => {
                if (!groupedData[category]) {
                    groupedData[category] = {
                        id: category,
                        name: category,
                        items: [],
                    };
                }
                groupedData[category].items.push({ id, name, category, price, created_at, updated_at });
            });

            return Object.values(groupedData);
        }

        return menuData as CategoryGroup[];
    };

    // Use this function inside useMemo to avoid unnecessary recalculations
    const processedMenuData: CategoryGroup[] = useMemo(() => transformMenuData(menuData), [menuData]);





    const styles = homeThemedStyles()

    const { currency, currencySymbol, convertAmount } = useCurrency();


    const dispatch = useDispatch();
    const cart = useSelector((state: { cart: CartState }) => state.cart);

    const [editItemModal, setEditItemModal] = useState(false)

    const [updateItemModal, setUpdateItemModal] = useState(false)

    const [modalVisible, setModalVisible] = useState(false);
    const [cartModalVisible, setCartModalVisible] = useState(false);

    const flatListRef = useRef<FlatList<any> | null>(null);


    const handleDiscardCart = () => {
        dispatch(cartSlice.actions.clearCart());
        setCartModalVisible(false);
    };


    const renderCartItem = (item: CartItem) => (
        <View style={styles.cartItem}>
            <Text style={styles.cartItemText}>{item.name}</Text>
            <Text style={styles.cartItemText}>x{item.quantity}</Text>
            <Text style={styles.cartItemText}>{currencySymbol} {Number(convertAmount(item.price).toFixed(2)) * item.quantity}</Text>
        </View>
    );

    const handleScrollToCategory = (query: string) => {
        const normalizedQuery = query.trim().toLowerCase();

        // Check if the query matches a category name
        const categoryIndex = processedMenuData.findIndex(
            (cat) => cat.name.toLowerCase() === normalizedQuery
        );

        if (categoryIndex !== -1) {
            flatListRef.current?.scrollToIndex({ index: categoryIndex, animated: true });
            return;
        }

        // Check if the query matches a dish name
        for (let i = 0; i < menuData.length; i++) {
            const category = menuData[i];
            const itemIndex = category.items.findIndex(
                (cat) => cat.name.toLowerCase().includes(normalizedQuery)
            );

            if (itemIndex !== -1) {
                flatListRef.current?.scrollToIndex({ index: i, animated: true });
                // Optionally: Highlight the dish (update state to re-render UI)
                // setHighlightedDish({ categoryIndex: i, itemName: category.items[itemIndex].name });
                return;
            }
        }

        // If no matches found
        alert('No matching category or dish found');
    };




    const handleUpdateItem = () => {

    }

    const handleAddToCart = (item: Item) => {
        dispatch(cartSlice.actions.addItem(item));
    };

    const handleRemoveFromCart = (itemName: string) => {
        dispatch(cartSlice.actions.removeItem(itemName));
    };

    const renderMenuItem = (item: Item) => {
        const itemQuantity = cart.items[item.name]?.quantity || 0;
        return (

            <View style={styles.itemBlock}>
                <Pressable style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => setEditItemModal(true)}>
                    <Entypo name='dots-three-vertical' color={'#2DD4BF'} size={14} />
                </Pressable>
                <Text style={styles.itemsText}>{item.name}</Text>
                <Text style={styles.itemsText}>{currencySymbol} {convertAmount(item.price)}</Text>
                <View style={styles.actionButtons}>
                    {itemQuantity > 0 ? (
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.quantityButton,
                                    itemQuantity === 0 && { opacity: 0.5 },
                                ]}
                                onPress={() => handleRemoveFromCart(item.name)}
                                disabled={itemQuantity === 0}
                            >
                                <Text style={{ color: '#FFF', fontSize: 18 }}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{itemQuantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => handleAddToCart(item)}
                            >
                                <Text style={{ color: '#FFF', fontSize: 18 }}>+</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => handleAddToCart(item)}
                        >
                            <Text style={{ color: '#FFF' }}>Add</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    }

    const renderCategory = ({ item: category }: { item: typeof menuData[0] }) => (
        <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category.name}</Text>
            <FlatList
                data={category.items}
                keyExtractor={(item, idx) => `${category.id}-${idx}`}
                renderItem={({ item }) => renderMenuItem(item)}
                numColumns={2}
                columnWrapperStyle={styles.itemsContainer}
            />
        </View>
    );


    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search for items or categories"
                onSubmitEditing={(e) => handleScrollToCategory(e.nativeEvent.text)}
            />
            <FlatList
                ref={flatListRef}
                data={processedMenuData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCategory}
                showsVerticalScrollIndicator={false}
            />

            {/* Floating Menu Button */}
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={{ color: '#9893DA' }}>Menu</Text>
            </TouchableOpacity>

            {/* Cart Summary Button */}
            <TouchableOpacity style={styles.cartButton} onPress={() => setCartModalVisible(true)}>
                <Text style={{ color: '#9893DA' }}>Cart: {cart.itemCount} items (${cart.total})</Text>
            </TouchableOpacity>

            {/* Modal for Categories */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Divider />
                                {processedMenuData.map((category) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        onPress={() => {
                                            handleScrollToCategory(category.name);
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Text style={styles.modalText}>{category.name}</Text>
                                        <Divider />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Cart Modal */}

            <Modal
                visible={cartModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setCartModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setCartModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Cart</Text>
                                <Divider />
                                <FlatList
                                    data={Object.values(cart.items)}
                                    keyExtractor={(item) => item.name}
                                    renderItem={({ item }) => renderCartItem(item)}
                                />
                                <Divider />
                                <View style={styles.cartSummary}>
                                    <Text style={styles.cartSummaryText}>
                                        Total Items: {cart.itemCount}
                                    </Text>
                                    <Text style={styles.cartSummaryText}>
                                        Total Price: {currencySymbol} {convertAmount(cart.total).toFixed(2)}
                                    </Text>
                                </View>
                                <View style={styles.cartButtons}>
                                    <TouchableOpacity
                                        style={styles.discardButton}
                                        onPress={handleDiscardCart}
                                    >
                                        <Text style={{ color: '#FFF' }}>Discard</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.printButton}
                                        onPress={() => {
                                            alert('Print functionality coming soon!');
                                        }}
                                    >
                                        <Text style={{ color: '#FFF' }}>Print</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Edit Item Modal */}

            {/* <EditItemModal visible={editItemModal} onClose={()=>setEditItemModal(false)} onUpdatePrice={} onDelete={}/> */}

        </View>
    )
}


export default home