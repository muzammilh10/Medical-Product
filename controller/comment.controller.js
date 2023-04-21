const Apperror = require(`./../utils/AppError`)
const Comment = require('./../model/comment.model');
const MedicalProduct = require(`./../model/product.model`)

exports.comment = async (req, res, next) => {
    try {

        const id = req.params.id;
        // console.log(id)
        let product;
        product = await MedicalProduct.findById(id);


        if (!product) return next(new Apperror("Product does not exist", 403))
        // console.log(product)
        const addComment = new Comment({
            comment: req.body.comment,
            user: req.user.id,
            product: product.id
        })
        const createComment = await addComment.save()



        if (createComment) {

            res.status(201).json({
                status: 'success',
                msg: 'comment successfully added',
                comment: createComment
            })
        }
    } catch (err) {
        res.status(500).json({
            status: 'something went wrong while creating comment',
            msg: err
        })
    }
}

