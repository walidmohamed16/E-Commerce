import mongoose,{Schema,Document} from "mongoose"

export interface IUser extends Document{
    firstName : "string",
    lastName : "string",
    email : "string",
    password : "srting" 
 }

 const userSchema = new Schema<IUser>({
    firstName : {type:"String", required: true},
    lastName : {type: "String",required: true},
    email :{type:"String",required: true},
    password : {type:"string",required:true }
 })

export  const userModel = mongoose.model<IUser>('user',userSchema)