import mongoose,{Schema,Document, type ObjectId} from "mongoose";
import type { IProduct } from "./productModels.js";

const cartStatusEnum =["active","completed"]

export interface ICartItem {
    product : IProduct,
    unitPrice : number,
    quantity : number
}

export interface ICart extends Document{
    userId : ObjectId | string,
    items : ICartItem[],
    totalAmount : number,
    status : "active" | "completed"
}

const cartItemSchema = new Schema<ICartItem>({
    product : {type: Schema.Types.ObjectId, ref:"product",required:true},
    unitPrice : {type: Number,required: true},
    quantity : {type: Number, required: true, default: 1}
})

const cartSchema = new Schema<ICart>({
    userId : {type: Schema.Types.ObjectId,ref:"user", required: true},
    items : [cartItemSchema],
    totalAmount : {type:Number,required: true},
    status : {type :String,enum:cartStatusEnum, default: "active" }
})

export const cartModel = mongoose.model<ICart>("Cart",cartSchema)