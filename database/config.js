const mongoose = require('mongoose');


const dbConection = async () => {

    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            // useUndefinedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false
        });

        console.log('Bases de datos online');
        
    } catch (error) {
       // throw new Error("Error en la base de datos");
       console.log(error);
    }

}


module.exports = {
    dbConection
}