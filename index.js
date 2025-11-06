// Importo los módulos Express y MySQL (versión con promesas)
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

// Configuro Express para usar EJS como motor de plantillas
app.set('view engine', 'ejs');

// Configuro la carpeta pública para archivos estáticos (fotos, videos, etc)
app.use(express.static('public'));

// Estas dos líneas permiten procesar los datos enviados por formularios
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuración de los datos para conectarse a la base de datos de MySQL
const conexion = mysql.createPool({
    host: 'mysql-emanuel.alwaysdata.net',
    user: 'emanuel',
    password: 'nHeGtgSMYTywg6AVj@BFd0TVhut*YM',
    database: 'emanuel_hotel'
});

// Función para verificar la conexión
(async () => {
    try {
        const conn = await conexion.getConnection();
        console.log('✅ Conexión exitosa a MySQL');
        conn.release();
    } catch (err) {
        console.error(`❌ Error en la conexión: ${err}`);
    }
})();

// Rutas principales
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/reservar', (req, res) => {
    res.render('reservar');
});

app.get('/verificarReserva', (req, res) => {
    res.render('verificarReserva');
});

// Ruta POST para consultar una reserva
app.post('/consultarReserva', async (req, res) => {
    try {

        const { dniCliente } = req.body;

        let resultados = await conexion.query('SELECT * FROM reservas WHERE dniCliente = ?', [dniCliente]);

        resultados = resultados[0][0];

        if (resultados.dniCliente) {
            res.json({ exito: true, info: resultados });
        } else {
            res.json({ exito: false });
        }

    } catch (err) {
        console.error(`❌ Error al consultar la reserva: ${err}`);
    }
});


// Ruta POST para registrar una reserva
app.post('/registrarReserva', async (req, res) => {
    try {
        const sql = `INSERT INTO reservas (fechaLlegada, fechaSalida, tipoHabitacion, cantidadPersonas, nombreCliente, apellidoCliente, dniCliente, correoCliente) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        await conexion.query(sql, [req.body.fechaLlegada, req.body.fechaSalida, req.body.tipoHabitacion, req.body.cantidadPersonas, req.body.nombreCliente, req.body.apellidoCliente, req.body.dniCliente, req.body.correoCliente]);

        res.json({ exito: true });
    } catch (err) {
        console.error('❌ Error al registrar la reserva:', err);
    }
});

// Inicio el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});