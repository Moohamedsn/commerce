import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const key = `${action.payload.productId}-${action.payload.color}-${action.payload.size}`;
      const existing = state.items.find(i => i.key === key);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.key === key ? { ...i, quantity: i.quantity + action.payload.quantity } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, key }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.key !== action.payload) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.key === action.payload.key ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const saved = JSON.parse(localStorage.getItem('edge_cart') || '{"items":[]}');
  const [state, dispatch] = useReducer(cartReducer, saved);

  useEffect(() => {
    localStorage.setItem('edge_cart', JSON.stringify(state));
  }, [state]);

  const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart: state, dispatch, total, count }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
