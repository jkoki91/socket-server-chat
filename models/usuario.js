const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        require: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        require: [true, 'El password es obligatorio'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        require: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE', 'SUPORT_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

UsuarioSchema.methods.toJSON = function() { // Esta función es para quitar el password y la versión del usuario en la respuesta
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
} 

module.exports = model('Usuario', UsuarioSchema)
