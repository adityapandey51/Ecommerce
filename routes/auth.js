import  express from "express";
import { registerController,loginController,forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController } from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddlewares.js";

// Router Object
const router =express.Router()


// REGISTER ROUTE
router.post("/register",registerController)
// LOGIN ROUTE
router.post("/login",loginController)


router.post("/forgot-password",forgotPasswordController)

// protected route auth
router.get("/user-auth",requireSignIn,(req,res)=>{
    res.status(200).send({ok:true})
})
router.get("/admin-auth",requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})




//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;