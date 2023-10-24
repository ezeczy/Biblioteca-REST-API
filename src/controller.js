import {pool} from './database.js';

class LibroController{

    async getAll(req, res) { //mostras todos los libros "http://localhost:3000/libros"
        const [result] = await pool.query('SELECT * FROM libros');
        res.json(result);
    }

    async add(req, res) { //agregar libro "http://localhost:3000/libro"
        const libro = req.body;
        const [result] = await pool.query(`INSERT INTO Libros(nombre, autor, categoria, date, ISBN) VALUES (?, ?, ?, ?, ?)`, [libro.nombre, libro.autor, libro.categoria, libro.date, libro.ISBN]);
        res.json({"Id insertado": result.insertId});
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

    async update (req, res) {
        try {
            const libro = req.body;
            const [result] = await pool.query (`UPDATE Libros SET nombre=(?), autor=(?), categoria=(?), date=(?), ISBN=(?) WHERE id=(?)`, [libro.nombre, libro.autor, libro.categoria, libro.date, libro.ISBN, libro.id]);
            res.json({"Registros Actualizados": result.changedRows});
        }catch(e) {
            console.log(e);
        }
    }
}
export const libro = new LibroController();