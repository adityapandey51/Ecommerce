import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddlewares.js";
import formidable from "express-formidable";
import { createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFiltersController, productListController, productPhotoController,realtedProductController,searchProductController,updateProductController } from "../controllers/productController.js";

const router = express.Router();

//routes
router.post(
    "/create-product",
    requireSignIn,
    isAdmin,
    formidable(),
    createProductController
  );

router.get("/get-product",getProductController)

router.get("/get-product/:slug",getSingleProductController)

router.get("/product-photo/:pid",productPhotoController)

router.delete("/delete-product/:pid", deleteProductController);

//routes
router.put(
    "/update-product/:pid",
    requireSignIn,
    isAdmin,
    formidable(),
    updateProductController
  );

  //filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

  
//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);


//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);



export default router;

