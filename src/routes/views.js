import ProductManager from "../dao/mongoDb/ProductManager.js";
import CartManager from "../dao/mongoDb/CartManager.js";
import { Router } from "express";
import __dirname from "../utils.js";

const router = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

const publicAccess = (req, res, next) => {
    if (req.session.user) {
        return res.redirect("/products");
    }
    next();
};

const privateAccess = (req, res, next) => {
    if (!req.session.user) {
        return res.status(403).redirect("/");
    }
    next();
};

router.get("/", publicAccess, (req, res) => {
    res.render("login", {
        style: "login.css",
        title: "Ecommerce - Login",
    });
});

router.get("/register", publicAccess, (req, res) => {
    res.render("register", {
        style: "register.css",
        title: "Ecommerce - Registro",
    });
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts", {
        style: "realTimeProducts.css",
        title: "Ecommerce - Productos en tiempo real",
    });
});

router.get("/chat", (req, res) => {
    res.render("chat", {
        style: "chat.css",
        title: "Ecommerce - Chat",
    });
});

router.get("/products", privateAccess, async (req, res) => {
    const limit = req.query.limit;
    const page = req.query.page;
    const category = req.query.category;
    const disponibility = req.query.disponibility;
    let sort = req.query.sort;

    if (sort === "asc") {
        sort = 1;
    } else if (sort === "desc") {
        sort = -1;
    }

    const products = await productManager.getProducts(
        limit || 10,
        page || 1,
        category,
        disponibility,
        sort
    );

    if (products.totalPages < page) {
        res.render("404", { style: "404.css", title: "Ecommerce - 404" });
        return;
    }

    const plainProducts = products.docs.map((doc) => doc.toObject());
    res.render("products", {
        products,
        plainProducts,
        user: req.session.user,
        style: "products.css",
        title: "Ecommerce - Productos",
    });
});

router.get("/products/:pid", privateAccess, async (req, res) => {
    const pid = req.params.pid;
    const plainProduct = await productManager.getProductById(pid);

    res.render("product", {
        plainProduct,
        style: "product.css",
        title: `Ecommerce - ${plainProduct.title}`,
    });
});

router.get("/carts/:cid", privateAccess, async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartManager.getCartById(cid);
    const plainProducts = cart.products;
    res.render("carts", {
        plainProducts,
        style: "carts.css",
        title: "Ecommerce - Carrito",
    });
});

export default router;
