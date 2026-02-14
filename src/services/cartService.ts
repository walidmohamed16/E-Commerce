import { cartModel } from "../models/cartModel.js";
import productModel from "../models/productModels.js";

interface createCartForUser {
    userId : string;
}

const createCartForUser = async({userId}:createCartForUser ) =>{
    const cart = await cartModel.create({userId, totalAmount: 0})
    await cart.save();
    return cart;
}

interface getActiveCartForUser{
    userId : string;
}

 export const getActiveCartForUser = async ({userId}: getActiveCartForUser)=>{
   
    let cart = await cartModel.findOne({userId ,status:"active"})

    if(!cart){
        cart = await createCartForUser({userId})
    }

    return cart;
}

interface addItemToCart {
    productId : any,
    quantity : number,
    userId : string
}

export const addItemToCart = async({userId, quantity, productId}: addItemToCart) => {
    const cart = await getActiveCartForUser({userId})

    const existsInCart = cart.items.find((p) => p.product.toString() === productId);
    
    if(existsInCart){
        return{data: "Item is already exists in the cart", statusCode: 400};
    }
    const product =await productModel.findById(productId);
    if(!product){
        return{data: "product not found", statusCode : 400};
    }
    if(product.stock < quantity){
        return {data : "low stock for this item ", statusCode : 400}
    }
    cart.items.push({
        product: productId,
        unitPrice: product.price,
        quantity
    })
    cart.totalAmount += product.price * quantity;
    const updateCart = await cart.save();
    return {data: updateCart , statusCode : 200}
}

