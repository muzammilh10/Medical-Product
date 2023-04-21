const express = require(`express`);
const app =express();

const globalErrorHandler = require("./middleware/global.middleware");
const productTypeRouter = require(`./router/product.type.route`)
const medicalProduct = require(`./router/product.route`)
const userRoutes = require(`./router/userRoutes`);
const path = require("path");


app.use(express.json())
app.use(express.static(path.join(__dirname, "..", "public/imageMedical")))

app.use(`/api/v1/productTypes`,productTypeRouter)
app.use(`/api/v1/products`,medicalProduct)
app.use(`/api/v1/users`,userRoutes)

app.use(globalErrorHandler)


module.exports = app;

