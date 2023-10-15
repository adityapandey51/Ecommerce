import { hashPassword,comparePassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js"
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken";

export const registerController=async (req,res)=>{
    try {

        const {name,email,password,phone,address,answer}=req.body;

        // validations
           if (!name){
            return res.send({error:"name is required"})
           }   
           if (!email){
            return res.send({error:"email is required"})
           }  
           if (!password){
            return res.send({error:"password is required"})
           } 
           if (!phone){
            return res.send({error:"phone is required"})
           }   
           if (!address){
            return res.send({error:"address is required"})
           }  
           if (!answer){
            return res.send({error:"answer is required"})
           }  
           
        //    existing Email

        const existingEmail=await userModel.findOne({email})

        if (existingEmail){
            return res.status(200).send({
                success:false,
                message:"Already Registered please login"
            })
        }

        // Register User

        const hashedPassword= await hashPassword(password)

        // saving to database

        const user=await new userModel({name,email,phone,address,password:hashedPassword,answer}).save()

        res.status(201).send({
            success:true,
            messgae:"User Registered Successfully",
            user
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"ERROR IN REGISTRATION",
            error
        })
    }
}


export const loginController=async (req,res)=>{
   try {
    const {email,password}=req.body

    // validation
    if (!email){
        return res.status(404).send({
            error:"Email is required"
        })}
    if (!password){
        return res.status(404).send({
            error:"Email is required"
        })
    }

    // Find the email

    const user=await userModel.findOne({email})

    if(!user){
        return res.status(404).send({
            success:false,
            error:"USER NOT FOUND"
        })
    }

    const match=await comparePassword(password,user.password)

    if (!match){
        return res.status(200).send({
            success:false,
            message:"INVALID PASSWORD",
        })
    }

    // TOKEN
    const token=await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

    res.status(200).send({
        success:true,
        message:"LOGIN SUCCESSFULL",
        user:{
            _id:user._id,
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
            role:user.role
        },
        token
    })


   } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"ERROR IN LOGIN",
        error
    })
   }
}




export const forgotPasswordController=async(req,res)=>{
    try {
        const {email,answer,newPassword}=req.body
        if (!email){
            res.status(400).send({error:"Email not found"})
        }
        if (!answer){
            res.status(400).send({error:"question not found"})
        }
        if (!newPassword){
            res.status(400).send({error:"Password not found"})
        }

        const user=await userModel.findOne({email,answer})

        if (!user){
            res.status(404).send({
                success:false,
                message:"wrong email or answer"
            })
        }

        const hash=await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password:hash})
        res.status(200).send({
            success:true,
            message:"Password reet successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            error
        })
    }
}

//update prfole
export const updateProfileController = async (req, res) => {
    try {
      const { name, email, password, address, phone } = req.body;
      const user = await userModel.findById(req.user._id);
      //password
      if (password && password.length < 6) {
        return res.json({ error: "Passsword is required and 6 character long" });
      }
      const hashedPassword = password ? await hashPassword(password) : undefined;
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
          phone: phone || user.phone,
          address: address || user.address,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated SUccessfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Update profile",
        error,
      });
    }
  };
  
  //orders
  export const getOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({ buyer: req.user._id })
        .populate("products", "-photo")
        .populate("buyer", "name");
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };
  //orders
  export const getAllOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        .sort({ createdAt: "-1" });
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };
  
  //order status
  export const orderStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const orders = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Updateing Order",
        error,
      });
    }
  };