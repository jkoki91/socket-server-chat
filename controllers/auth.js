const { response, json } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");


const login = async ( req, res = response) => {
    
    const { correo, password } = req.body;

    try {
        // Verificar si existe el email
        const usuario = await Usuario.findOne({ correo })
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        // Verificar si el usuario está activo 
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado:false'
            })
        };

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        };

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async ( req, res = response ) => {
    const { id_token } = req.body;

    try {
        
        const { correo, nombre, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if( !usuario ){
            // Si no existe lo creo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            }

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario esta con el estado en false (borrado supuestamente)
        if ( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        json.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }
    
}

module.exports = {
    login,
    googleSignIn
}



