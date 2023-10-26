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
            const expectedFields = ['nombre', 'autor', 'categoria', 'date', 'ISBN'];
            const providedFields = Object.keys(req.body);
    
            // Comprobar si se han proporcionado campos adicionales
            const extraFields = providedFields.filter(field => !expectedFields.includes(field));
    
            if (extraFields.length > 0) {
                return res.json({"Error": "Campos adicionales proporcionados", "Campos inválidos": extraFields});
            }
    
            const { nombre, autor, categoria, date, ISBN } = req.body;
            const libro = { nombre, autor, categoria, date, ISBN };
    
            const [result] = await pool.query('INSERT INTO Libros(nombre, autor, categoria, date, ISBN) VALUES (?, ?, ?, ?, ?)', [libro.nombre, libro.autor, libro.categoria, libro.date, libro.ISBN]);
    
            if (result.affectedRows > 0) {
                res.json({"Id insertado": result.insertId});
            } else {
                res.json({"Error":"No se pudo agregar el libro, campos insertados erroneos"});
            }
        } catch(error) {
            res.json({"Error": "Ocurrió un error al agregar el libro", "Details": error.message});
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

    async update(req, res) { // Actualiza un libro "http://localhost:3000/libro"
        try {
            const libro = req.body;
            const [result] = await pool.query(
                `UPDATE Libros 
                 SET nombre = ?, autor = ?, categoria = ?, date = ? 
                 WHERE ISBN = ?`,
                [libro.nombre, libro.autor, libro.categoria, libro.date, libro.ISBN]
            );
    
            if (result.affectedRows > 0) {
                res.json({ "message": `Libro con ISBN ${libro.ISBN} actualizado correctamente` });
            } else {
                res.json({ "Error": `No se encontró ningún libro con el ISBN ${libro.ISBN}` });
            }
        } catch (error) {
            res.json({ "Error": "Ocurrió un error al actualizar el libro", "Details": error.message });
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