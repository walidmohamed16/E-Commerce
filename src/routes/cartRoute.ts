import express  from "express";
import { addItemToCart, getActiveCartForUser } from "../services/cartService.js";
import validateJwt from "../middlewares/validateJWT.js";
import type { ExtendRequest } from "../types/extendedRequest.js";

const router = express.Router();

router.get('/', validateJwt, async(req:ExtendRequest,res) =>{
    const userId = req.user._id
    const cart = await getActiveCartForUser({userId }) 
    res.status(200).send(cart);
})

router.post('/items', validateJwt, async(req:ExtendRequest, res) => {
    const userId = req.user._id
    const {productId, quantity} = req.body
    const response = await addItemToCart({userId, productId, quantity})
    res.status(response.statusCode).send(response.data)
})

export default router;