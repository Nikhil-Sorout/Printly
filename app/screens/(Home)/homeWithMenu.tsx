import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, FlatList, Dimensions, TouchableWithoutFeedback, Pressable, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { cartSlice } from '../../redux/cartSlice';
import { Divider } from '@/components/ui/divider';
import { useCurrency } from '@/app/context/currencyContext';
import homeThemedStyles from '@/app/styles/homeThemedStyles';
import { Entypo } from '@expo/vector-icons';
import EditItemModal from '@/components/EditItemModalComp';
import axios from 'axios';
import { baseUrl } from '@/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApiError } from '@/app/hooks/useApiError';


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
    category: string
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

const home = ({ menuData, fetchData }: { menuData: CategoryGroup[], fetchData: () => void }) => {


    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData?.(); // Fetch updated data
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    console.log(menuData)
    const { isModalVisible, errorDetails, showError, hideError } = useApiError();

    function convertToTransactionFormat(foodItems:any) {
        // Initialize an array to store the formatted items
        const items = [];
        
        // Iterate through each food item in the object
        for (const itemName in foodItems) {
          const item = foodItems[itemName];
          
          // Create a new object with the required structure
          items.push({
            item_id: item.id,
            quantity: item.quantity
          });
        }
        
        // Return the formatted data
        return {
          items: items
        };
      }
      




    const transformMenuData = (menuData: MenuData): CategoryGroup[] => {
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
    
    const [selectedItem, setSelectedItem] = useState<Item | null>(null)
    
    const [editItemModal, setEditItemModal] = useState(false)
    
    const [updateItemModal, setUpdateItemModal] = useState(false)
    
    const [deleteItemModal, setDeleteItemModal] = useState(false)
    
    
    const [modalVisible, setModalVisible] = useState(false);
    const [cartModalVisible, setCartModalVisible] = useState(false);
    
    const flatListRef = useRef<FlatList<any> | null>(null);
    
    
    const handleDiscardCart = () => {
        dispatch(cartSlice.actions.clearCart());
        setCartModalVisible(false);
    };
    console.log("items: ", cart.items)

    const handleSaveTransaction = async () => {
        try {
            const modifiedData = convertToTransactionFormat(cart.items)
            console.log(modifiedData)
            const token = await AsyncStorage.getItem('userToken')
            const response = await axios.post(`${baseUrl}/transactions`,
                {
                    items: modifiedData.items
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })
            console.log(response)
            if(response.status !== 201){
                showError(response.status)
                return
            }
            dispatch(cartSlice.actions.clearCart())
            setCartModalVisible(false)

        }
        catch(err){
            console.log("caught you ", err)
            showError(undefined, 'Network Error Occured')
        }
    }






    const handleDeleteItem = async () => {
        setEditItemModal(false)
        try {
            const token = await AsyncStorage.getItem('userToken')
            console.log(selectedItem?.name, selectedItem?.price)
            const response = await axios.delete(`${baseUrl}/items/delete/${selectedItem?.name}/${selectedItem?.price}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
            console.log(response)
            setDeleteItemModal(false)
            fetchData()
            if (response.status !== 201) {
                showError(response.status)
                return
            }
        }
        catch (err) {
            console.log("Caught you ", err)
            showError(undefined, "Network Error Occured")
        }
    }


    const handleUpdateItem = () => {
        setEditItemModal(false)
        setUpdateItemModal(true)
    }


    const renderCartItem = (item: CartItem) => (
        <View style={styles.cartItem}>
            <Text style={styles.cartItemText}>{item.name}</Text>
            <Text style={styles.cartItemText}>x{item.quantity}</Text>
            <Text style={styles.cartItemText}>{currencySymbol} {Number(convertAmount(item.price)) * item.quantity}</Text>
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
        for (let i = 0; i < processedMenuData.length; i++) {
            const category = processedMenuData[i];
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


    console.log(cart.items)


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
                <Pressable style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => {
                    setSelectedItem(item)
                    setEditItemModal(true)
                }}>
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
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
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
                <Text style={{ color: '#9893DA' }}>Cart: {cart.itemCount} items ({currencySymbol}{cart.total})</Text>
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
                                        Total Price: {currencySymbol} {convertAmount(cart.total)}
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
                                        onPress={handleSaveTransaction}
                                    >
                                        <Text style={{ color: '#FFF' }}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Edit Item Modal */}

            <EditItemModal visible={editItemModal} onClose={() => setEditItemModal(false)} onUpdatePrice={handleUpdateItem} onDelete={handleDeleteItem} deleteModalVisible={deleteItemModal} updateModalVisible={updateItemModal} selectedItem={selectedItem} setDeleteModalVisible={setDeleteItemModal} setUpdatedModalVisible={setUpdateItemModal} fetchData={fetchData} />




        </View>
    )
}


export default home