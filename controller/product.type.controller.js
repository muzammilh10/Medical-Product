const ProductType = require(`../model/product.type.model`)
const AppError = require(`./../utils/AppError`)
const medicalProductModel = require(`./../model/product.model`)
const ObjectId = require('mongoose').Types.ObjectId;

exports.getAllProductsTypes = async (req, res) => {
    try {
        const productType = await ProductType.find({});
        res.status(200).json({
            status: `success`,
            data: {
                productType
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'not found',
            message: err
        })
    }
}

exports.createProductType = async (req, res, next) => {
    try {
        const name = req.body.name;

        const exist = await ProductType.findOne({ name })
        // console.log(exist)

        if (exist) {
            // console.log("exist")
            return next(new AppError("product type already exist", 400))
        }

        const newProductType = await ProductType.create({
            name,
            user: req.body.user
        })

        res.status(201).json({
            status: `success`,
            data: { newProductType }
        })

    } catch (err) {
        console.log("exist")
        res.status(500).json({
            status: 'fail',
            message: err
        })
    }
}


// Validator function
function isValidObjectId(id) {
    if (ObjectId.isValid(id)) {
        const objectId = new ObjectId(id)
        return objectId.equals(id);
    }
    return false;
}

exports.deleteProductType = async (req, res, next) => {
    try {
        const id = req.params.id;
        // console.log(id)
        if (!id) return next(new AppError("Please provide an id", 400))
        let productTypeExist;
        if (isValidObjectId(id)) {

            productTypeExist = await ProductType.findById(id);
            console.log(productTypeExist)
        } else {
            return next(new AppError("please provide a valid product id", 400))
        }

        if (!productTypeExist) return next(new AppError('ProductType does not exist', 400))

        if (productTypeExist.user.toString() !== req.user.id) {
            return next(new AppError(`user does not have permission to delete product`, 401))
        }
        const MedicalProductExists = await medicalProductModel.findOne({ productType: id })

        if (MedicalProductExists) {    
            return next(new AppError('Medical Product exists you can not delete this product type', 403))
  
        } else {
            const deleteOne = await ProductType.deleteOne(productTypeExist)

            if (deleteOne) {
                return res.status(200).json({
                    status: 'fail',
                    message: 'Product Type does not exist anymore'
                })
            } else {
                return next(new AppError('something went wrong while deleting this product type', 500))
            }
        }
    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err

        })
    }

}