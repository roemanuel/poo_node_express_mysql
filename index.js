// Importo los módulos Express y MySQL (versión con promesas)
const express = require(`express`);
const app = express();
const mysql = require(`mysql2/promise`);

// Configuro Express para usar EJS como motor de plantillas
app.set(`view engine`, `ejs`);

// Configuro la carpeta pública para archivos estáticos (fotos, videos, etc)
app.use(express.static('public'));

// Defino la ruta PRINCIPAL que renderiza la vista "index"
app.get(`/`, (req, res) => {
    res.render(`index`);
})

// Defino la ruta RESERVAR que renderiza la vista "reservar"
app.get(`/reservar`, (req, res) => {
    res.render(`reservar`);
})

//Inicio el servidor en el puerto 3000
app.listen(3000, () => {
    console.log(`El servidor se inició correctamente en el puerto 3000: http://localhost:3000`);
});

const conexion = mysql.createPool({
    host: `localhost`,
    user: `root`,
    password: ``,
    database: `hotel`
});

(async () => {
    try {
        const conn = await conexion.getConnection();
        console.log('✅ Conexión exitosa a MySQL');
        conn.release(); // libera la conexión al pool
    } catch (err) {
        console.error('❌ Error en la conexión:', err.message);
    }
})();