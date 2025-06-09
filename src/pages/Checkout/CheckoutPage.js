import React from 'react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { createOrder } from '../../services/orderService';
import classes from './checkoutPage.module.css';
import { FaLock, FaArrowRight } from 'react-icons/fa';
import Map from '../../components/Map/Map';

export default function CheckoutPage() {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState({ ...cart });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const submit = async data => {
    if (!order.addressLatLng) {
      toast.warning('Please select your location on the map');
      return;
    }
    // Build the order object as expected by backend
    const orderToSend = {
      name: data.name,
      address: data.address,
      addressLatLng: order.addressLatLng,
      totalPrice: cart.totalPrice,
      items: cart.items.map(item => ({
        product: item.food._id, // must be the MongoDB _id
        size: item.size,
        price: item.price,
        quantity: item.quantity
      }))
      // user will be set by backend from auth token
    };
    console.log('Order data sent:', orderToSend);
    await createOrder(orderToSend);
    navigate('/payment');
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1>Complete Your Order</h1>
        <p>Please review your items and provide your delivery details to proceed with your purchase</p>
      </div>
      
      <div className={classes.form_container}>
        <div className={classes.form_section}>
          <h2 className={classes.section_title}>Delivery Information</h2>
          <form onSubmit={handleSubmit(submit)}>
            <div className={classes.inputs}>
              <div className={classes.input_group}>
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  className={classes.input_field}
                  defaultValue={user.name}
                  placeholder="Enter your full name"
                  {...register('name', { required: true })}
                />
                {errors.name && <span className={classes.error}>Name is required</span>}
              </div>
              
              <div className={classes.input_group}>
                <label htmlFor="address">Delivery Address</label>
                <input
                  id="address"
                  className={classes.input_field}
                  defaultValue={user.address}
                  placeholder="Enter your delivery address"
                  {...register('address', { required: true })}
                />
                {errors.address && <span className={classes.error}>Address is required</span>}
              </div>
            </div>
            
            <h2 className={classes.section_title} style={{ marginTop: '2rem' }}>Select Delivery Location</h2>
            <div className={classes.map_container}>
              <Map
                location={order.addressLatLng}
                onChange={latlng => {
                  setOrder({ ...order, addressLatLng: latlng });
                }}
              />
            </div>
            
            <div className={classes.buttons_container}>
              <div className={classes.buttons}>
                <button type="submit" className={classes.payment_button}>
                  Proceed to Payment <FaArrowRight />
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <div className={classes.form_section}>
          <div className={classes.summary_header}>
            <h2 className={classes.summary_title}>Order Summary</h2>
            <span>{cart.totalCount} items</span>
          </div>
          
          <div className={classes.order_summary}>
            <div className={classes.item_list}>
              {cart.items.map(item => (
                <div key={`${item.food._id}-${item.size}`} className={classes.item}>
                  <div className={classes.item_image}>
                    <img src={item.food.images?.[0]} alt={item.food.name} />
                  </div>
                  <div className={classes.item_info}>
                    <div className={classes.item_name}>{item.food.name} <span className={classes.size}>({item.size})</span></div>
                    <div className={classes.item_details}>
                      <span>Qty: {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={classes.total_summary}>
              <div className={classes.total_row}>
                <span>Subtotal:</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className={classes.total_row}>
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className={classes.total_row}>
                <span>Tax:</span>
                <span>${(cart.totalPrice * 0.08).toFixed(2)}</span>
              </div>
              <div className={classes.total_row}>
                <span>Total:</span>
                <span>${(cart.totalPrice * 1.08).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className={classes.secure_checkout}>
            <FaLock className={classes.lock_icon} />
            <span>Secure SSL Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}