const express = require(`express`);
const uploadPhoto = require("./../middleware/uploadPhoto")
const productController = require(`./../controller/product.controller`)
const likeDislikeController = require(`./../controller/likeDislikeController`)
const  validate = require(`./../middleware/validateToken`)
const comment = require(`./../controller/comment.controller`)



const router = express.Router();


// from productController
router.route(`/`)
                .get(productController.getAllProducts)
                .post(validate,uploadPhoto,productController.createProduct)    

router.route(`/:id`).delete(validate,productController.deleteProduct)
router.route(`/updateMedicalProduct/:id`).post(validate,uploadPhoto,productController.updateProduct)
                
router.route(`/getProductByType/:id`).get(productController.getproductsByType)
router.route(`/getMostRecentProduct`).get(productController.getMostRecentProduct)

// from likeDislikeController
router.route(`/like/:id`).post(validate,likeDislikeController.like)
router.route(`/dislike/:id`).post(validate,likeDislikeController.disLike)
router.route(`/mostLikedProduct`).get(likeDislikeController.mostLikedPRoduct)
router.route(`/mostDislikeProduct`).get(likeDislikeController.mostDislikedProduct)


// comment controller
router.route('/comments/:id').post(validate,comment.comment)



module.exports = router;
