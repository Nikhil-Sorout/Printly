import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface Item {
  name: string;
  price: number;
}

interface CartState {
  items: Record<string, CartItem>;
  total: number;
  itemCount: number;
}

const initialCartState: CartState = {
  items: {},
  total: 0,
  itemCount: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCartState,
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      if (state.items[item.name]) {
        state.items[item.name].quantity += 1;
      } else {
        state.items[item.name] = { ...item, quantity: 1 };
      }
      state.total += item.price;
      state.itemCount += 1;
    },
    removeItem: (state, action) => {
      const itemName = action.payload;
      const item = state.items[itemName];
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          delete state.items[itemName];
        }
        state.total -= item.price;
        state.itemCount -= 1;
      }
    },
    clearCart: (state) => {
      state.items = {};
      state.itemCount = 0;
      state.total = 0;
    },

  },
});

export const { addItem, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
