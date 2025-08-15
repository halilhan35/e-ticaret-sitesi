import React, { createContext, useEffect, useState } from 'react'
import all_product_json from '../Components/Assets/all_product' // JSON dosyanızı import edin

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }
  return cart;
}


const ShopContextProvider = (props) => {
  const [all_product, setAll_Products] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());

useEffect(() => {
    const loadProducts = async () => {
        try {
            console.log("JSON products:", all_product_json);
            // API'den admin ürünlerini al
            const response = await fetch('http://localhost:4000/allproducts');
            const apiProducts = await response.json();
            console.log("API products:", apiProducts);
            
            // JSON ürünlerine yeni ID'ler ver (admin ürünlerinden sonra)
            const maxApiId = apiProducts.length > 0 ? Math.max(...apiProducts.map(p => p.id)) : 0;
            const processedJsonProducts = all_product_json.map((product, index) => ({
                ...product,
                id: maxApiId + index + 1, // API ürünlerinden sonraki ID'ler
            }));
            
            // İki listeyi birleştir: önce JSON, sonra API ürünleri
            const combinedProducts = [...processedJsonProducts, ...apiProducts];
            console.log("Combined products:", combinedProducts);
            console.log("Total products:", combinedProducts.length);
            setAll_Products(combinedProducts);
        } catch (error) {
            console.error("Error loading API products:", error);
            // API başarısız olursa sadece JSON'u kullan
            console.log("Using only JSON products");
            setAll_Products(all_product_json);
        }
    };

    const loadCart = () => {
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/getcart',{
                method:'POST',
                headers:{
                    Accept:'application/json', // 'application/form-data' yerine 'application/json'
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:"",
            }).then((response)=>response.json())
            .then((data)=>setCartItems(data))
            .catch((error)=>console.error('Error loading cart:', error));
        }
    };

    loadProducts();
    loadCart(); // Cart'ı da yükle

}, []);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    
    if(localStorage.getItem('auth-token')){
        fetch('http://localhost:4000/addtocart',{
            method:'POST',
            headers:{
                Accept:'application/json', // 'application/form-data' yerine 'application/json'
                'auth-token':`${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({"itemId":itemId})
        })
        .then((response)=>response.json())
        .then((data)=>console.log(data))
        .catch((error)=>console.error('Error adding to cart:', error));
    }
}

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if(localStorage.getItem('auth-token')){
      fetch('http://localhost:4000/removefromcart',{
            method:'POST',
            headers:{
                Accept:'application/json', // 'application/form-data' yerine 'application/json'
                'auth-token':`${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({"itemId":itemId})
        })
    }
  }

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

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
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