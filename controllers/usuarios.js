const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async ( req = request, res = response ) => {

    // const { q, name = 'No name', apikey } = req.query;
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};
    // const usuarios = await Usuario.find( query ) //para que estos dos await se ejecuten a la vez vamos a juntarlos en una promesa
    //     .skip( Number(desde) )
    //     .limit( Number(limite) );
    
    // const total = await Usuario.countDocuments( query );    

    const [ total, usuarios] = await Promise.all([
        Usuario.countDocuments( query ),
        await Usuario.find( query )
            .skip( Number( desde ))
            .limit( Number( limite ))

    ])

    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async ( req, res = response ) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );

    // Verificar si el correo existe en la bdd //separado en los helpers

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt )

    // Guardar en BDD

    await usuario.save();

    res.json({
        usuario
    })
};

const usuariosPut = async ( req, res = response ) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if( password ) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt )
    };

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json( usuario );
};

const usuariosPatch = ( req, res = response ) => {

    res.json({
        msg : 'Patch api endpoint - controler'
    })
};

const usuariosDelete = async ( req, res = response ) => {
    const { id } = req.params;

    // const usuario = await Usuario.findByIdAndDelete( id ); // Con esta opcion borramos al usuario fisica y permanentemente
    
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );
    // const usuarioAutenticado = req.usuario;

    // res.json( {usuario, usuarioAutenticado} )
    res.json( usuario )
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPatch,
    usuariosPut,
    usuariosDelete
};