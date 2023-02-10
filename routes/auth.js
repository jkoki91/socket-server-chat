const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn, reonovarToken } = require('../controllers/auth');
const { validarJWT } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], login );

router.post('/google', [
    check('id_token', 'id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignIn );

router.get('/', validarJWT, reonovarToken )

module.exports = router;
