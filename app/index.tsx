import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { menuData } from './data/menuData';
import { store } from './redux/store';
import { cartSlice } from './redux/cartSlice';

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

const Index: React.FC = () => {
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
        (item) => item.name.toLowerCase() === normalizedQuery
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
    <View style={styles.container}>
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
            {menuData.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => {
                  handleScrollToCategory(category.name);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalText}>{category.name}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FEFEFF',
  },
  searchBar: {
    height: 40,
    borderColor: '#9893DA',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color: '#000',
  },
  categoryContainer: {
    marginBottom: 20,
    backgroundColor: '#F6F6FF',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#9893DA',
    marginBottom: 10,
    fontFamily: 'cursive'
  },
  itemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemBlock: {
    width: '48%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#9893DA',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#9893DA',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#FEFEFF',
    padding: 15,
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
    bottom: 20,
    right: 20,
    backgroundColor: '#FEFEFF',
    borderColor: '#9893DA',
    borderWidth: 1,
    padding: 15,
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
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  modalText: {
    fontSize: 20,
    color: '#9893DA',
    paddingVertical: 10,
    textAlign: 'center',
    fontFamily: 'cursive'
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  quantityButton: {
    backgroundColor: '#9893DA',
    padding: 2,
    width: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
    color: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  cartItemText: {
    fontSize: 16,
    color: '#333',
  },
  cartSummary: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#CCC',
    paddingTop: 10,
  },
  cartSummaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  cartButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  discardButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  printButton: {
    backgroundColor: '#9893DA',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  

});



export default Index;
