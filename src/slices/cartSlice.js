import { createSlice } from "@reduxjs/toolkit";
import {toast} from "react-hot-toast";

const initialState = {
    cart: localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("resetCart")) : [],
    totalItems: localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")) : 0,
    total: localStorage.getItem("total") ? JSON.parse(localStorage.getItem("total")) : 0,
};

const cartSlice = createSlice({
    name:"cart",
    initialState: initialState,
    reducers: {
        setTotalItems(state, value) {
            state.token = value.payload;
        },
        //add to cart
        addToCart(state, value) {
            const course = value.payload;
            const index = state.cart.findIndex((item) => item._id === course._id)
            if(index >= 0) {
                toast.error("Course already in cart")
                return
            }
            //add to cart if it is not present
            state.cart.push(course);
            //update the total quantity and price
            state.totalItems++
            state.total += course.price
            //update local storage
            localStorage.setItem("cart", JSON.stringify(state.cart))
            localStorage.setItem("total", JSON.stringify(state.total))
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems)) 
            //show toast on success
            toast.success("Course added to Cart")
        },
        //remove from cart
        removeFromCart(state, value) {
            const courseId = value.payload
            const index = state.cart.findIndex((item) => item._id === courseId)
            if(index >= 0) {
                state.totalItems--
                state.cart.splice(index,1)
                //update localstorage
                localStorage.setItem("cart",JSON.stringify(state.cart))
                localStorage.setItem("total",JSON.stringify(state.total))
                localStorage.setItem("totalItems", JSON.stringify(state.total))
                //Show toast
                toast.success("Course Removed Successfully..")
            }
        },
        //reset cart
        ResetCart(state, value) {
            state.cart = []
            state.total = 0
            state.totalItems = 0
            //update to locastorage
            localStorage.removeItem("cart")
            localStorage.removeItem("total")
            localStorage.removeItem("totalItems")
        }
    },
});

export const {setTotalItems, addToCart, removeFromCart, ResetCart} = cartSlice.actions;
export default cartSlice.reducer;
