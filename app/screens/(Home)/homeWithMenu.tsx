import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { menuData } from '../../data/menuData';
import { cartSlice } from '../../redux/cartSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider } from '@/components/ui/divider';



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

const home = () => {

    const dispatch = useDispatch();
    const cart = useSelector((state: { cart: CartState }) => state.cart);

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
            <Text style={styles.cartItemText}>${item.price * item.quantity}</Text>
        </View>
    );

    const handleScrollToCategory = (query: string) => {
        const normalizedQuery = query.trim().toLowerCase();

        // Check if the query matches a category name
        const categoryIndex = menuData.findIndex(
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
                <Text style={{ fontFamily: 'serif' }}>{item.name}</Text>
                <Text>${item.price}</Text>
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
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search for items or categories"
                onSubmitEditing={(e) => handleScrollToCategory(e.nativeEvent.text)}
            />
            <FlatList
                ref={flatListRef}
                data={menuData}
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
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Divider />
                        {menuData.map((category) => (
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
                </View>
            </Modal>

            {/* Cart Modal */}

            <Modal
                visible={cartModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setCartModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Cart</Text>
                        <FlatList
                            data={Object.values(cart.items)}
                            keyExtractor={(item) => item.name}
                            renderItem={({ item }) => renderCartItem(item)}
                        />
                        <View style={styles.cartSummary}>
                            <Text style={styles.cartSummaryText}>
                                Total Items: {cart.itemCount}
                            </Text>
                            <Text style={styles.cartSummaryText}>
                                Total Price: ${cart.total.toFixed(2)}
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
                </View>
            </Modal>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.03,
        backgroundColor: '#FEFEFF'
    },
    searchBar: {
        height: height * 0.05,
        borderColor: '#9893DA',
        borderWidth: 1,
        marginBottom: height * 0.02,
        paddingHorizontal: width * 0.03,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        color: '#000',
    },
    categoryContainer: {
        marginBottom: height * 0.025,
        backgroundColor: '#F6F6FF',
        borderRadius: 8,
        padding: width * 0.04,
        elevation: 2
    },
    categoryTitle: {
        fontSize: width * 0.06,
        fontWeight: 'semibold',
        color: '#9893DA',
        marginBottom: height * 0.015,
        fontFamily: 'serif',
    },
    itemsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemBlock: {
        width: '48%',
        padding: width * 0.04,
        borderWidth: 1,
        borderColor: '#9893DA',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        marginBottom: height * 0.015,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: height * 0.015,
    },
    addButton: {
        backgroundColor: '#9893DA',
        paddingVertical: height * 0.01,
        paddingHorizontal: width * 0.03,
        borderRadius: 8,
        alignItems: 'center',
    },
    floatingButton: {
        position: 'absolute',
        bottom: height * 0.03,
        left: width * 0.05,
        backgroundColor: '#FEFEFF',
        padding: width * 0.04,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        alignItems: 'center',
        borderColor: '#9893DA',
        borderWidth: 1,
    },
    cartButton: {
        position: 'absolute',
        bottom: height * 0.03,
        right: width * 0.05,
        backgroundColor: '#FEFEFF',
        borderColor: '#9893DA',
        borderWidth: 1,
        padding: width * 0.04,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#FEFEFF',
        borderRadius: 10,
        borderColor: '#9893DA',
        borderWidth: 2,
        padding: width * 0.05,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    modalText: {
        fontSize: width * 0.05,
        color: '#9893DA',
        paddingVertical: height * 0.015,
        textAlign: 'center',
        fontFamily: 'serif',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%',
    },
    quantityButton: {
        backgroundColor: '#9893DA',
        padding: height * 0.005,
        width: width * 0.08,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityText: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
        marginHorizontal: width * 0.02,
        color: '#333',
    },
    modalTitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: height * 0.015,
        textAlign: 'center',
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: height * 0.015,
        borderBottomWidth: 1,
        borderBottomColor: '#CCC',
    },
    cartItemText: {
        fontSize: width * 0.04,
        color: '#333',
    },
    cartSummary: {
        marginTop: height * 0.025,
        borderTopWidth: 1,
        borderTopColor: '#CCC',
        paddingTop: height * 0.015,
    },
    cartSummaryText: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: height * 0.01,
    },
    cartButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: height * 0.025,
    },
    discardButton: {
        backgroundColor: '#FF6B6B',
        padding: height * 0.015,
        borderRadius: 8,
        flex: 1,
        marginRight: width * 0.02,
        alignItems: 'center',
    },
    printButton: {
        backgroundColor: '#9893DA',
        padding: height * 0.015,
        borderRadius: 8,
        flex: 1,
        marginLeft: width * 0.02,
        alignItems: 'center',
    },
});

export default home