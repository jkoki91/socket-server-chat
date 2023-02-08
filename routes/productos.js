const { Router } = require('express');
const { check } = require('express-validator');

const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { existeProductoPorID } = require('../helpers/db-validators')
const { existeCategoriaPorID } = require('../helpers/db-validators')

const router = Router();

/* 
    * {{url}}/api/producto
*/

// obtener todas las producto - publico
router.get('/', obtenerProductos );

// obtener una producto por id - publico
router.get('/:id', [
    check('id','No es un id de mongo' ).isMongoId(),
    check('id').custom( existeProductoPorID ),
    validarCampos,
], obtenerProducto );

// Crear producto - privado - cualquier persona con un token valido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatio').notEmpty(),
    check('categoria','No es un id de mongo' ).isMongoId(),
    check('categoria').custom( existeCategoriaPorID ),
    validarCampos
    ], crearProducto );

// Actualizar producto - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    // check('categoria','No es un id de mongo' ).isMongoId(),
    check('id').custom( existeProductoPorID ),
    validarCampos, 
], actualizarProducto);

// Borrar producto - privado - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id','No es un id de mongo' ).isMongoId(),
    check('id').custom( existeProductoPorID ),
    validarCampos, 
], borrarProducto );


module.exports = router;
