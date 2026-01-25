import { userModel } from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
interface registerParams {
    firstName : string ,
    lastName : string ,
    email : string ,
    password : string
}
export const register = async ({ firstName, lastName ,email,password}:registerParams) => {
    
    const findUser = await userModel.findOne({email})
    
    if(findUser) {
        return { data :"user already exists!", statusCode:400 }
    }
    const hashedPassword =await  bcrypt.hash(password,10)
    const newUser = new userModel({firstName, lastName ,email,password :hashedPassword })

    await newUser.save()
    return { data : genrateJWT({firstName, lastName,email}), statusCode: 200}
}

interface loginParams {
    
    email: string,
    password : string
}
export const login = async({ email, password }: loginParams) =>{

    const findUser = await userModel.findOne({email})
    
    if(!findUser){
        return { data : "incorect email or password", statusCode:400}
    }
    const passwordMatch = await bcrypt.compare(password, findUser.password)
    
    if(passwordMatch){
        return {data : genrateJWT({email, firstName : findUser.firstName , lastName: findUser.lastName}), statusCode:200 }
    }
    return { data : "incorect email or password", statusCode:400}

}

const genrateJWT = (data:any)=>{
    return jwt.sign(data,"wba5310d87SgTJaTntbf5qeJJKl7vewC")
}