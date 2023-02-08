const Role = require('../models/role');
const {Usuario, Categoria, Producto} = require('../models');



const esRoleValido = async (rol = '') => {
    const existeRole = await Role.findOne({rol});
    if( !existeRole ) {
        throw new Error(`Es rol ${rol} no está registrado en la base de datos`)
    }
};

const emailExiste = async ( correo = '' ) => {
    const existeEmail = await Usuario.findOne( {correo: correo} )
    if( existeEmail ){
        throw new Error(`Es correo ${correo} ya está registrado en la base de datos`)
    }
};

const existeUsuarioPorID = async ( id ) => {
    const existeUsuario = await Usuario.findById( id )
    if( !existeUsuario ){
        throw new Error(`Es id: ${id} no existe en la base de datos`)
    }
}

const existeCategoriaPorID = async ( id ) => {
    const existeCategoria = await Categoria.findById( id )
    if( !existeCategoria ){
        throw new Error(`Es id: ${id} no existe en la base de datos`)
    }
}

const existeProductoPorID = async ( id ) => {
    const existeProducto = await Producto.findById( id )
    if( !existeProducto ){
        throw new Error(`Es id: ${id} no existe en la base de datos`)
    }
}

// Validar colecciones permitidas
const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {
    const incluida = colecciones.includes( coleccion );
    if(!incluida) {
        throw new Error( `La colección ${coleccion} no es permitida, ${colecciones}` )
    }
    return true;
}

module.exports = { 
    coleccionesPermitidas,
    esRoleValido,
    emailExiste,
    existeUsuarioPorID,
    existeCategoriaPorID,
    existeProductoPorID
};