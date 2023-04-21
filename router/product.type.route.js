const express = require(`express`)
const router = express.Router()
const productTypeController = require(`./../controller/product.type.controller`)
const validate = require(`./../middleware/validateToken`)


// from productType controller
router.route(`/`)
                .get(productTypeController.getAllProductsTypes)
                .post(validate,productTypeController.createProductType)
router.route(`/:id`)
                .delete(validate,productTypeController.deleteProductType)



module.exports = router