import express  from "express";
import { addItemToCart, checkout, clearCart, deleteItemInCart, getActiveCartForUser, updateItemInCart } from "../services/cartService.js";
import validateJwt from "../middlewares/validateJWT.js";
import type { ExtendRequest } from "../types/extendedRequest.js";

const router = express.Router();

router.get('/', validateJwt, async(req:ExtendRequest,res) =>{
    const userId = req.user._id
    const cart = await getActiveCartForUser({userId }) 
    res.status(200).send(cart);
})
router.delete('/', validateJwt, async(req:ExtendRequest, res) =>{
    const userId = req.user._id;
    const response = await clearCart({userId});
    res.status(response.statusCode).send(response.data);
})
router.post('/items', validateJwt, async(req:ExtendRequest, res) => {
    const userId = req.user._id
    const {productId, quantity} = req.body
    const response = await addItemToCart({userId, productId, quantity})
    res.status(response.statusCode).send(response.data)
})
router.put('/items', validateJwt, async(req: ExtendRequest,res)=>{
    const userId = req.user.id
    const {productId, quantity} = req.body
    const response = await updateItemInCart({userId, productId, quantity})
    res.status(response.statusCode).send(response.data)
})
router.delete('/items/:productId', validateJwt, async(req: ExtendRequest,res)=>{
    const userId = req.user.id;
    const {productId} = req.params;
    const response = await deleteItemInCart({userId, productId});
    res.status(response.statusCode).send(response.data);
})
router.post('/checkout', validateJwt, async(req: ExtendRequest,res)=>{
    const userId = req.user.id;
    const { address } = req.body
    const response = await checkout ({userId, address});
    res.status(response.statusCode).send(response.data);
})

export default router;