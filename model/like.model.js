const mongoose = require(`mongoose`)


const LikeSchema = new mongoose.Schema({
    user : {
        type:mongoose.Schema.Types.ObjectId,
        ref:`User`
    },
    product: {
        type:mongoose.Schema.Types.ObjectId,
        ref:`MedicalProduct`
    }
})

module.exports = new mongoose.model(`Likes`,LikeSchema);