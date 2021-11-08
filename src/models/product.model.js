const mongoose = require("mongoose");



const productSchema = new mongoose.Schema({
    name : {type : String, required : true},
    price : {type : Number, required : true},
    size : {type : String, required : true}
})


module.exports = mongoose.model("product", productSchema);