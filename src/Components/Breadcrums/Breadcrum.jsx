import React from 'react'
import './Breadcrum.css'
import arrow_icon from '../Assets/breadcrum_arrow.png'

const Breadcrum = (props) => {
    const { product } = props;
    
    // Product undefined ise loading göster
    if (!product) {
        return (
            <div className='breadcrum'>
                HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" /> Loading...
            </div>
        );
    }

    return (
        <div className='breadcrum'>
            HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" /> {product.category} <img src={arrow_icon} alt="" /> {product.name}
        </div>
    )
}

export default Breadcrum