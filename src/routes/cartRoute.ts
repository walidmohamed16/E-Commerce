import express  from "express";
import { getActiveCartForUser } from "../services/cartService.js";
import validateJwt, { type ExtendRequest } from "../middlewares/validateJWT.js";

const router = express.Router();

router.get('/', validateJwt, async(req:ExtendRequest,res) =>{
    const userId = req.user._id
    const cart = await getActiveCartForUser({userId }) 
    res.status(200).send(cart);
})

export default router;