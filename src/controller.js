import {pool} from './database.js';

class LibroController{

    async getAll(req, res) { //se muestran todos los libros "http://localhost:3000/libros"
        try {
        const [result] = await pool.query('SELECT * FROM libros');
        res.json(result);
        } catch(e) {
            console.log(e);
        }
    }

    async add(req, res) { //agregar libro "http://localhost:3000/libro"
        try {
        const libro = req.body;
        const [result] = await pool.query(`INSERT INTO Libros(nombre, autor, categoria, date, ISBN) VALUES (?, ?, ?, ?, ?)`, [libro.nombre, libro.autor, libro.categoria, libro.date, libro.ISBN]);
        if(result.length > 0) {
            res.json(result[0]);
            res.json({"Id insertado": result.insertId, "message": "Libro insertado correctamente"});
        } else {
            res.json({"Error":"No se puedo agregar el libro, campos insertados erroneos"})
        }
        }catch(error) {
            res.json({"Error": "Ocurrió un error al agregar el libro"});
        }
    }

    async getOne(req, res) { //buscar libro con numero de id "http://localhost:3000/libro"
        try {
            const libro = req.body;
            const id = parseInt(libro.id);
            const [result] = await pool.query(`SELECT * FROM Libros where id=(?)`,[libro.id]);
            if (result[0]!=undefined){
                res.json(result);
            }else{
                res.json({"Error": "No se ha encontrado un libro con el id especificado"});
            }
        }catch(e) {
            console.log(e);
        }
    }

    async update (req, res) { //actualiza un libro "http://localhost:3000/libro"
        try {
            const libro = req.body;
            const [result] = await pool.query (`UPDATE Libros SET nombre=(?), autor=(?), categoria=(?), date=(?), ISBN=(?) WHERE id=(?)`, [libro.nombre, libro.autor, libro.categoria, libro.date, libro.ISBN, libro.id]);
            res.json({"Registros Actualizados": result.changedRows});
        }catch(e) {
            console.log(e);
        }
    }

    async delete(req, res) { //elimina un libro, insertando su ISBN "http://localhost:3000/libro"
        try {
            const libro = req.body;
            const [result] = await pool.query (`DELETE FROM Libros WHERE ISBN=(?)`, libro.ISBN);
            res.json({"Registros eliminados": result.affectedRows});
        }catch(e) {
            console.log(e);
        }
    }
}
export const libro = new LibroController();