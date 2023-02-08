const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConection } = require('../database/config.js');

class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT || 8081;

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
            uploads: '/api/uploads'
        };

        // Conectar a base de datos
        this.conectarDB()

        // Middlewares
        this.middlewares();

        //Rutas de la aplicación
        this.routes();
    };

    async conectarDB(){
        await dbConection();
    }

    middlewares(){
        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio publico
        this.app.use( express.static('public') );

        // File upload, carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    };

    routes() {
        this.app.use( this.paths.auth, require('../routes/auth.js') );
        this.app.use( this.paths.buscar, require('../routes/buscar.js') );
        this.app.use( this.paths.categorias, require('../routes/categorias.js') );
        this.app.use( this.paths.productos, require('../routes/productos.js') );
        this.app.use( this.paths.usuarios, require('../routes/usuarios.js') );
        this.app.use( this.paths.uploads, require('../routes/uploads.js') );
    };

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto ${this.port}`);
        });
    }
}


module.exports = Server;
