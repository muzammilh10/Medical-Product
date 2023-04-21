const MedicalProduct = require(`./../model/product.model`);
const ProductType = require(`./../model/product.type.model`)
const AppError = require(`./../utils/AppError`)
// const ObjectId = require('mongoose').Types.ObjectId;

// Validator function
// function isValidObjectId(id) {
//     if (ObjectId.isValid(id)) {
//         const objectId = new ObjectId(id);
//         return objectId.equals(id);
//     }
//     return false;
// }

exports.getAllProducts = async (req, res) => {
    try {
        const allProduct = await MedicalProduct.find({})
        res.status(200).json({
            status: `success`,
            maxLength: allProduct.length,
            dataL: {
                allProduct
            }
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err
        })
    }
}

exports.createProduct = async (req, res, next) => {
    const { name, productType, expiryDate } = req.body
    // console.log(req.file)
    const imageFiles = req.files["image"]
    console.log(imageFiles)

    // 1) checck if product type is exist or not
    try {
        const proType = await ProductType.findOne({ name: productType }) 
        if (!proType) {
            return next(new AppError('product type is not exist please create before creating product'))
        }

        // 2) check medical product is exist or not
        const productExist = await MedicalProduct.findOne({ name: name })

        if (productExist) {
            return next(new AppError(`cannot create product because it already exist`))
        }
        // 3) if productTYpe not exist create new product
        const newProduct = new MedicalProduct({
            name: name,
            productType: proType._id,
            image: (imageFiles.map((file) => file.filename)).toString(),
            expiryDate: expiryDate,
            user: req.user.id
            // user: "643e2155f80d15c233676647"

        })
        console.log(newProduct)
        const product = await newProduct.save()



        res.status(201).json({
            status: `success`,
            message: product
        })
    } catch (err) {
        res.status(500).json({
            status: `fail`,
            message: err
        })
    }
}

exports.updateProduct = async (req, res, next) => {
    const id = req.params.id;
    console.log(id)
    const { name, productType, expiryDate } = req.body;
    const file = req.files;
    // console.log(file)

    if (!id) return next(new AppError("id required"))
    try {
        let productExist;
        productExist = await MedicalProduct.findById(id);

        if (!productExist) return next(new AppError(`product not exist`, 400))
        console.log(file)
        const updateProduct = await MedicalProduct.findByIdAndUpdate(id, {
            name,
            productType,
            expiryDate,
            image: file.filename
        },
        )
        // console.log(file)
        if (updateProduct) {
            res.status(200).json({
                status: "success",
                message: "update"
            })
        }


    } catch (err) {
        res.status(500).json({
            status: `error`,
            message: err
        })
    }
}

exports.deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) return next(new AppError('id is not present in the parameter', 400))
        // console.log(id)
        let productExist;
        productExist = await MedicalProduct.findById(id);
        if (!productExist) {
            return new AppError(`product doesn not exist please enter valid id`)
        }
        console.log(productExist)

        // if(productExist.user.toString() !== req.user.id){
        //     return next(new AppError(`user does not have permission to delete product`,401))
        // }

        const deleteOne = await MedicalProduct.deleteOne(productExist);
        productExist.isdeleted = true;
        console.log(productExist)

        res.status(200).json({
            status: "success",
            message: deleteOne
        })
    } catch (err) {
        res.status(500).json({
            status: 'something wnet wrong please update again',
            message: err
        })
    }

}


exports.getproductsByType = async (req, res, next) => {
    const id = req.params.id;
    // console.log(id)
    try {
        // 1 check type exist 
        const type = await ProductType.findById(id)
        if (!type) return next(new AppError(`product type does not exist`))
        console.log(id)

        // 2 finding all product having same productType
        const medicalProducts = await MedicalProduct.find({ productType: id })
        // console.log(medicalProducts)
        if (medicalProducts) {
            res.status(200).json({
                status: 'success',
                data: medicalProducts
            })
        } else {
            return next(new AppError('does not have any product with this type', 400))
        }
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'something went wrong while getting product by type'
        })
    }

}



exports.getMostRecentProduct = async(req,res,next)=>{
    try{
        const recentProduct = await MedicalProduct.find({}).sort({createdAt:-1}).limit(1)
        res.status(200).json({
            status:'success',
            recentProduct
        })
    }catch(err){
        res.status(500).json({
            status:'fail',
            message:'something went wrong '
        })
    }
}


