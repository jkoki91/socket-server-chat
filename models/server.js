const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');

const { dbConection } = require('../database/config.js');
const { socketController } = require('../sockets/controller');

class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT || 8081;

        // this.server = require('http').createServer( this.app )
        this.server = createServer( this.app )
        this.io = require('socket.io')(this.server)

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

        // Sockets 
        this.sockets();
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

    sockets() {
        // this.io.on( "connection", socketController );
        this.io.on( "connection", ( socket ) => socketController( socket, this.io ) );
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto ${this.port}`);
        });
    }
}


module.exports = Server;
