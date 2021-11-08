const express = require("express");

const router = express.Router();
const redis = require("../configs/redis");
const Product = require("../models/product.model");

router.post("/", async (req, res) => {
    let product = await Product.create(req.body);

    let products = await Product.find().lean().exec();

    redis.set("product-data", JSON.stringify(products));

    return res.status(201).send({product});
})


router.get("/", async (req, res) => {
    let page = +req.query.page;
        let size = +req.query.size;

    redis.get(`product-data${page}${size}`, async  function(err, product) {
        
        

        let offset = (page - 1) * size;


        if(err) console.log(err);

        if(product) return res.status(201).send(JSON.parse(product));

        let products = await Product.find().skip(offset).limit(size).lean().exec();


        redis.set("product-data", JSON.stringify(products));

        return res.status(200).send(products);




      });
});



router.get("/:id", async (req, res) => {
    redis.get(`product-data${req.params.id}`, async  function(err, product) {
        

        if(err) console.log(err);

        if(product) return res.status(201).send(JSON.parse(product));

        let productOne = await Product.findById(req.params.id).lean().exec();


        redis.set(`product-data${req.params.id}`, JSON.stringify(productOne));

        return res.status(200).send(productOne);




      });
});




router.patch("/:id", async (req, res) => {

    let product = await Product.findByIdAndUpdate(req.params.id, req.body, {new : true});

    redis.set(`product-data${req.params.id}`, JSON.stringify(product));

    let products = await Product.find().lean().exec();

    redis.set("product-data", JSON.stringify(products));

    return res.status(201).send(product);




})



router.delete("/:id", async(req, res) => {
    let product = await Product.findByIdAndDelete(req.params.id);

    redis.del(`product-data${req.params.id}`);

    let products = await Product.find().lean().exec();
    redis.set("product-data", JSON.stringify(products));

    return res.status(200).send(product);
})



module.exports = router;
