const {connection} = require('../app');
const util = require('util');

const qy = util.promisify(connection.query).bind(connection);
/*toda la implementacion de los requests aca luego se agregan en index js*/

//conexion a base de datos importada de index

//crear una categoría
const categoriaPost = async (req, res) => {
    try{
        if (!req.body.genero) {
            throw new Error ('Falta enviar el genero');
        }

        let query = 'SELECT id FROM categoria WHERE genero = ?';

        let respuesta = await  qy(query, [req.body.genero.toUpperCase()]);

        if (respuesta.length > 0 ) {
            throw new Error ('¡Esa categoria ya existe!');
        };

        query = 'INSERT INTO categoria (genero) VALUE (?)';

        respuesta = await qy(query, [req.body.genero.toUpperCase()]);

        let response = await qy(`SELECT * FROM categoria WHERE ID='${respuesta.insertId}'`)

        res.status(200).send(response);
        
    }
    catch(e){
        console.error(e.message);
        res.status(413).send({message: e.message});
    }
};

//buscar todas las categorias
const categoriaGet = async (req, res) => {
    try{
        const query = 'SELECT * FROM categoria';

        const respuesta =  await qy(query);
        if (respuesta.length == null){
            res.status(413).send('');
        }
        res.send({"Respuesta": respuesta});
    }
    catch(e){
        console.error(e.message);
        res.status(413).send({'Error': e.message});
    }
};

//buscar las categorías por ID
const categoriaGetById = async (req, res) => {
    try{
        let query = 'SELECT * FROM categoria WHERE id = ?';
        
        let respuesta =  await qy(query, [req.params.id]);

        if (respuesta.length == 0 ) {
            throw new Error ('Categoría no encontrada');
        };
        
        res.send({respuesta});

    }
    catch(e){
        console.error(e.message);
        res.status(413).send({'Error': e.message});
    }
};

//eliminar una categoria
const categoriaDeleteById = async (req, res) => {
    try {
        /*
        if(!req.body.genero){
            throw new Error ('Debe indicar la categoria que desea borrar') 
        }

        let consultaGenero = await qy('SELECT * FROM categoria WHERE genero = ?', [req.body.genero.toUpperCase()]);
        if (consultaGenero.length ==  0){
            throw new Error ('No existe la categoría indicada');
        }
        */
        let consultaGeneroID = await qy('SELECT * FROM categoria WHERE id = ?', [req.params.id]);
        if(consultaGeneroID.length == 0){
            throw new Error ('No existe genero con el ID indicado')
        } 
        /*
        if(consultaGenero.genero != consultaGeneroID.genero){
            throw new Error ('no coincide el ID con el nombre del genero que desea borrar');
        }
        */
        let query = 'SELECT * FROM libro WHERE genero_id = ?';
        let respuesta = await qy (query, [req.params.id]);

        if (respuesta.length > 0 ) {
        throw new Error ('Esta categoría tiene productos asociados, no se puede borrar');
    }
        query =  'DELETE FROM categoria WHERE genero = ?'; 
        respuesta = await qy (query, [req.body.genero]) ;
        res.send({respuesta: 'Se ha borrado correctamente la categoria'});
    }
    catch(e) {
        console.error(e.message);
        res.status(413).send({"Error": e.message});
    }
};  
    


module.exports={
    categoriaPost,categoriaGet,categoriaGetById, categoriaDeleteById
}
