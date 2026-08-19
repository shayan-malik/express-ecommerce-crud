import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 4000;

let products = [];

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/products", (req, res) => {
    res.send({ status: "success", data: products });
});

const validateProduct = (body) => {
    const errors = {};

    if (!body?.title || typeof body.title !== "string" || body.title.trim() === "") {
        errors.title = "Title is required";
    }

    if (body?.price === undefined || body?.price === null || body?.price === "") {
        errors.price = "Price is required";
    } else if (isNaN(Number(body.price))) {
        errors.price = "Price must be a valid number";
    } else if (Number(body.price) <= 0) {
        errors.price = "Price must be greater than 0";
    }

    if (!body?.description || typeof body.description !== "string" || body.description.trim() === "") {
        errors.description = "Description is required";
    }

    return errors;
};

app.post("/add-product", (req, res) => {
    const productBody = req.body;
    const errors = validateProduct(productBody);

    if (Object.keys(errors).length > 0) {
        res.status(400).send({ status: "error", message: "Validation failed", errors });
        return;
    }

    products.push({
        id: new Date().getTime(),
        title: productBody.title.trim(),
        price: Number(productBody.price),
        description: productBody.description.trim(),
        imageUrl: productBody.imageUrl || "",
    });

    res.status(201).send({ status: "success", message: "Product Added Successfully" });
});

app.put("/product/:id", (req, res) => {
    const productId = req.params.id;
    const updatedBody = req.body;

    const productIndex = products.findIndex((eachProduct) => eachProduct.id == productId);

    if (productIndex === -1) {
        res.status(404).send({ status: "error", message: "Product Not Found" });
        return;
    }

    const errors = validateProduct(updatedBody);
    if (Object.keys(errors).length > 0) {
        res.status(400).send({ status: "error", message: "Validation failed", errors });
        return;
    }

    products[productIndex] = {
        ...products[productIndex],
        title: updatedBody.title.trim(),
        price: Number(updatedBody.price),
        description: updatedBody.description.trim(),
        imageUrl: updatedBody.imageUrl || products[productIndex].imageUrl || "",
    };

    res.status(200).send({ status: "success", message: "Product Updated Successfully", data: products[productIndex] });
});

app.delete("/product/:id", (req, res) => {
    const productId = req.params.id;
    const productExist = products.find((eachProduct) => eachProduct.id == productId);
    if (!productExist) {
        res.status(404).send({ status: "error", message: "Product Not Found" });
        return;
    }
    products = products.filter((eachProduct) => eachProduct.id != productId);
    res.status(200).send({ status: "success", message: "Product Deleted Successfully" });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});