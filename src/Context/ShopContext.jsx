import React, { createContext, useState } from 'react'
import all_product from '../Components/Assets/all_product';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    // Her ürün için cart içinde 0 değeri ata
    for (let index = 0; index < all_product.length + 1; index++) {
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(getDefaultCart());

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    }

    // getTotalCartAmount fonksiyonu ekleyelim
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
           
        }
        return totalAmount; 
    }

      const getTotalCartItems = () =>{
        let totalItem = 0;
       for(const item in cartItems) 
       {
         if(cartItems[item]>0){
          totalItem += cartItems[item]
         }
       }
          return totalItem;
      }

    const contextValue = { 
        getTotalCartItems,
        all_product, 
        cartItems, 
        addToCart, 
        removeFromCart, 
        getTotalCartAmount 
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider