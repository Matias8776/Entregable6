import { Router } from "express";
import usersModel from "../dao/models/users.js";
import { createHash, isValidPassword } from "../utils.js";

const router = Router();

router.post("/login", async (req, res) => {
    const { email, password } = await req.body;
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        req.session.user = {
            name: "Administrador",
            email: email,
            age: 35,
            role: "Admin",
        };
        return res.send({ status: "success", payload: req.session.user });
    } else {
        const user = await usersModel.findOne({ email });
        if (!user) {
            return res.status(401).send({
                status: "error",
                message: "Usuario no encontrado",
            });
        }
        if (!isValidPassword(user, password)) {
            return res.status(401).send({
                status: "error",
                message: "Constraseña incorrecta",
            });
        }
        delete user.password;
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: "Usuario",
        };
        res.send({ status: "success", payload: req.session.user });
    }
});

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    const exists = await usersModel.findOne({ email });
    if (exists) {
        return res.status(400).send({
            status: "error",
            message: "Ya existe un usuario con ese email",
        });
    }
    await usersModel.create({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
    });
    res.send({
        status: "success",
        message: "Usuario registrado correctamente",
    });
});

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al destruir la sesión:", err);
        }
        res.redirect("/");
    });
});

export default router;
