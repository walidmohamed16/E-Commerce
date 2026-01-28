import productModel from "../models/productModels.js";

export const getAllProducts =async ()=>{
    return await productModel.find();
}

export const seedIntialProducts = async ()=> {
    const products = [
        {title : "Dell laptop", image : "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSKx7pb139A7B4xTPlk1UGnTr2u_X06DXku0uV9Z8eWd3lsO209xKpGHUGTGLgfYMUUe5BnfBbE0Zc3LMfdtb2z_8zpWRcgdZYsOlTAV4piyJddA1R5q3e3Ta1gii3R&usqp=CAc", price: 20000,stock:10}
    ];

    const exsitingProducts = await getAllProducts();

    if(exsitingProducts.length === 0){
        await productModel.insertMany(products);
    }

};