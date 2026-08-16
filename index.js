import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 4000;

let products = [];

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.get("/products", (req, res) => {
    res.send({ status: "success", data: products });
})


app.post("/add-product", (req, res) => {
    const productBody = req.body;
    if(!productBody?.title || !productBody?.price || !productBody?.description){
        res.send({ status: "error", message: "Required Parameter Missing"});
        return;

    }
    products.push({ id: new Date().getTime(), ...productBody})
    res.send({ status: "success", message: "Product Add Successfully"})

})

app.put("/product/:id", (req, res) => {
    const productId = req.params.id;
    const updatedBody = req.body;

    const productIndex = products.findIndex((eachProduct) => eachProduct.id == productId);

    if(productIndex === -1){
        res.status(404).send({ status: "error", message: "Product Not Found "});
        return;
    }

    products[productIndex] = {...products[productIndex], ...updatedBody };
    res.status(200).send({ status: "success", message: "Product Updated Successfully", data: products[productIndex] });
    
    

})


app.delete("/product/:id", (req, res) => {
    const productId = req.params.id;
    const productExist = products.find((eachProduct) => eachProduct.id == productId);
    if(!productExist){
        res.status(404).send({ status: "error", message: "Product Not Found"});
        return;
    }
    products = products.filter((eachProduct) => eachProduct.id != productId);
    res.status(200).send({ status: "success", message: "Product Deleted Successfully" })
})



















app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

