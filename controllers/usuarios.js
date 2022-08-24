const { response, request } = require("express");

const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).limit(Number(limite)).skip(Number(desde)),
    ]);

    res.json({
        total,
        usuarios,
    });
};

const usuariosPost = async (req = request, res = response) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    //Verificar si el correo existe

    //Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardar en BD
    await usuario.save();

    res.json({
        usuario,
    });
};

const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body;

    //Validar contra bd
    if (password) {
        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
};

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: "Patch API - controlador",
    });
};

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;
    //Borrado fisico
    //const usuario = await Usuario.findByIdAndDelete(id);

    //Borrado logico
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        usuario,
    });
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
};
