const like = require(`../model/like.model`)
const disLike = require(`../model/dislike.model`)
const MedicalProduct = require(`../model/product.model`)
const AppError = require(`../utils/AppError`)

exports.like = async (req, res, next) => {
    try {
        const id = req.params.id
        let product;
        product = await MedicalProduct.findById(id);
        // console.log(product)
        if (!product) return next(new AppError("Product does not exists", 404));

        console.log(req.user.id)
        const isAlreadyLiked = await like.findOne({
            user: req.user.id,
            // user:"643e6a62ea6bd347ad211c86",
            product: product.id
        })
        console.log(isAlreadyLiked)

        if (isAlreadyLiked) {
            return res.status(400).json({
                message: "You have already liked the product",
            });
        }
        const addLike = new like({
            user: req.user.id,
            product: product.id
        });
        const created = await addLike.save();

        // deleting dislike
        if (created) {
            await disLike.findOneAndDelete({
                user: req.user.id,
                product: product.id,
            });

            res.json({
                msg: "U have successfully like the product",
            });
        } else {
            return next(new AppError("Something went wrong", 500));
        }

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            msg: err
        })
    }
}

exports.disLike = async (req, res, next) => {
    const id = req.params.id;
    let product;
    product = await MedicalProduct.findById(id);

    // const product = await MedicalProduct.findById(id);

    if (!product) return next(new AppError("Product does not exists", 403));

    const existingDislike = await disLike.findOne({
        user: req.user.id,
        product: product.id,
    });

    if (existingDislike)
        return res.status(400).json({
            message: "Product already disliked by this user",
        });

    const addDislike = new disLike({
        user: req.user.id,
        product: product.id,
    });
    const created = await addDislike.save();

    if (created) {
        // deleting like

        await like.findOneAndDelete({
            user: req.user.id,
            product: product.id,
        });

        res.json({
            msg: "U have successfully dislike the product",
        });
    } else {
        return next(new AppError("Something went wrong", 500));
    }
}



exports.mostLikedPRoduct = async (req, res, next) => {

    const query = 1
    if (isNaN(query)) return next(new AppError("query must be a number"))

    const data = await like.aggregate([
        {
            $group: {
                _id: "$product",
                count: { $sum: 1 }
            },
        },
        {
            $sort: { count: -1 }
        },
        {
            $limit: +query
        }
    ]).exec()

    // console.log(data)

    console.log(data)
    res.status(200).json({
        status: 'success',
        data

    })
}
exports.mostDislikedProduct = async (req, res, next) => {
    const query = req.query.limit || 1;
    if (isNaN(query)) return next(new Apperror("Query must be a Number"));
    const data = await disLike.aggregate([
        {
            $group: {
                _id: "$product",
                count: { $sum: 1 },
            },
        },
        {
            $sort: { count: -1 },
        },
        {
            $limit: +query,
        }
    ]).exec();

    if (data) {
        res.json({
            output: data,
        });
    } else {
        return next(new Apperror("Something went wrong", 500));
    }
};