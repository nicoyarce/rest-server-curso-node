const { response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../middlewares/generar-jwt");
const login = async (req, res = response) => {
    const { correo, password } = req.body;
    try {
        //Verificar si el email si existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: "Usuario/Password no son correctos - correo",
            });
        }
        //Verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: "Usuario/Password no son correctos - inactivo",
            });
        }
        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Usuario/Password no son correctos - password",
            });
        }
        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.status(500).json({
            usuario,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Login OK",
        });
    }
};

module.exports = {
    login,
};
