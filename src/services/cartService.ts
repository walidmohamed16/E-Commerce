import { cartModel } from "../models/cartModel.js";
import { orderModel, type IOrderItem } from "../models/orderModel.js";
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
interface ClearCart{
    userId : string;
}

export const clearCart =async({userId}: ClearCart) =>{
    const cart = await getActiveCartForUser({userId});
    cart.items = [];
    cart.totalAmount = 0;
   
    const updatedCart = await cart.save();
    return {data: updatedCart , statusCode : 200}
}

interface AddItemToCart {
    productId : any,
    quantity : number,
    userId : string
}

export const addItemToCart = async({userId, quantity, productId}: AddItemToCart) => {
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
    const updatedCart = await cart.save();
    return {data: updatedCart , statusCode : 200}
}
interface UpdateItemInCart {
    productId : any,
    quantity : number,
    userId : string
}

export const updateItemInCart = async({productId,quantity,userId}:UpdateItemInCart)=>{
   
    const cart = await getActiveCartForUser({userId});
    const existsInCart = cart.items.find((p) => p.product.toString() === productId);
    
    if(!existsInCart){
        return{data: "item is not exist in cart",statusCode : 400}

    }
    const product =await productModel.findById(productId);
    if(!product){
        return{data: "product not found", statusCode : 400};
    }
    if(product.stock < quantity){
        return {data : "low stock for this item ", statusCode : 400}
    }


    const otherItemsInCart = cart.items.filter((p) => p.product.toString() !== productId);

    let total = otherItemsInCart.reduce((sum, product) => {
        sum += product.quantity * product.unitPrice;
        return sum 
    },0)
    existsInCart.quantity = quantity;
    total += existsInCart.quantity * existsInCart.unitPrice;
    cart.totalAmount = total;
    const updatedCart = await cart.save();
    return{data : updatedCart , statusCode:200};

}
interface DeleteItemInCart {
    productId : any,
    userId : string
}
export const deleteItemInCart = async ({userId, productId} : DeleteItemInCart) => {
   
    const cart = await getActiveCartForUser({userId});
   
    const existsInCart = cart.items.find((p) => p.product.toString() === productId);
    
    if(!existsInCart){
        return{data: "item is not exist in cart",statusCode : 400}

    }
     const otherItemsInCart = cart.items.filter((p) => p.product.toString() !== productId);

    const total = otherItemsInCart.reduce((sum, product) => {
        sum += product.quantity * product.unitPrice;
        return sum 
    },0)

    cart.items = otherItemsInCart;
    
    cart.totalAmount = total;
    
    const updatedCart = await cart.save();
    
    return{data : updatedCart , statusCode:200};
}

interface Checkout {
    userId : string,
    address : string
}

export const checkout = async({userId, address}: Checkout) => {
    
    if(!address) {
        return {data : "please add the address", statusCode : 400}
    }

    const cart  = await getActiveCartForUser({userId})

    const orderItems: IOrderItem[] = [];

  // Loop cartItems and create orderItems
  for (const item of cart.items) {
    const product = await productModel.findById(item.product);

    if (!product) {
      return { data: "Product not found", statusCode: 400 };
    }

    const orderItem: IOrderItem = {
      productTitle: product.title,
      productImage: product.image,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    };

    orderItems.push(orderItem);
  }

  const order = await orderModel.create({
    orderItems,
    total: cart.totalAmount,
    address,
    userId,
  });

     console.log (order);

    await order.save();

    cart.status = "completed";
    
    await cart.save();

    return {data : order , statusCode : 200}
}

