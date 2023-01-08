const { Router } = require("express");
const { check } = require("express-validator");

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole,
} = require("../middlewares");

const {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
} = require("../helpers/db-validators");

const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch,
} = require("../controllers/usuarios");

const router = Router();

router.get("/", usuariosGet);

router.put(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioPorId),
        check("rol").custom((rol) => esRolValido(rol)),

        validarCampos,
    ],

    usuariosPut
);

router.post(
    "/",
    [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check(
            "password",
            "El password debe de ser mas de 6 caracteres"
        ).isLength({ min: 6 }),
        check("correo", "El correo no es válido").isEmail(),
        check("correo").custom((correo) => emailExiste(correo)),
        check("rol").custom((rol) => esRolValido(rol)),
        validarCampos,
    ],
    usuariosPost
);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioPorId),
        validarCampos,
    ],
    usuariosDelete
);

router.patch("/", usuariosPatch);

module.exports = router;
