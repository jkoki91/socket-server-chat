const { Router } = require('express');
const { check } = require('express-validator');

const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { existeCategoriaPorID } = require('../helpers/db-validators')

const router = Router();

/* 
    * {{url}}/api/categorías
*/

// obtener todas las categorías - publico
router.get('/', obtenerCategorias );

// obtener una categoría por id - publico
router.get('/:id', [
    check('id','No es un id de mongo' ).isMongoId(),
    check('id').custom( existeCategoriaPorID ),
    validarCampos,
], obtenerCategoria );

// Crear categoría - privado - cualquier persona con un token valido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatio').notEmpty(),
    validarCampos
    ], crearCategoria );

// Actualizar categoría - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatio').notEmpty(),
    check('id').custom( existeCategoriaPorID ),
    validarCampos, 
], actualizarCategoria);

// Borrar categoría - privado - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id','No es un id de mongo' ).isMongoId(),
    check('id').custom( existeCategoriaPorID ),
    validarCampos, 
], borrarCategoria );


module.exports = router;
