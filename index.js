// Importo los módulos Express y MySQL (versión con promesas)
const express = require('express');
const session = require('express-session');
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
    database: 'emanuel_hotel',
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
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

// Configuración de la sesión de Express
app.use(session({
    secret: "prueba123",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 30
    }
}));

// Rutas principales
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/reservar', (req, res) => {
    res.render('reservar');
});

// Ruta POST para registrar una reserva
app.post('/registrarReserva', async (req, res) => {
    try {
        const sql = `INSERT INTO reservas (fechaLlegada, fechaSalida, tipoHabitacion, camas, adultos, menores, nombreCliente, apellidoCliente, dniCliente, correoCliente) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await conexion.query(sql, [req.body.fechaLlegada, req.body.fechaSalida, req.body.tipoHabitacion, req.body.camas, req.body.adultos, req.body.menores, req.body.nombreCliente, req.body.apellidoCliente, req.body.dniCliente, req.body.correoCliente]);

        res.json({ exito: true });
    } catch (err) {
        console.error('❌ Error al registrar la reserva:', err);
    }
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

        if (resultados && resultados.dniCliente) {
            res.json({ exito: true, info: resultados });
        } else {
            res.json({ exito: false });
        }

    } catch (err) {
        console.error(`❌ Error al consultar la reserva: ${err}`);
    }
});

app.get('/iniciarSesion', (req, res) => {
    res.render('iniciarSesion');
});

app.post(`/consultarAdministrador`, async (req, res) => {
    try {

        const { correoAdministrador, passwordAdministrador } = req.body;

        let respuestaBD = await conexion.query('SELECT * FROM administradores WHERE correoAdministrador = ? AND passwordAdministrador = ?', [correoAdministrador, passwordAdministrador]);

        respuestaBD = respuestaBD[0][0];

        if (respuestaBD && respuestaBD.correoAdministrador == correoAdministrador && respuestaBD.passwordAdministrador == passwordAdministrador) {
            req.session.user = true;

            res.json({ exito: true });
        } else {
            res.json({ exito: false });
        }

    }
    catch (err) {
        console.error(`Error en consultarAdministrador ${err}`);
    }
});

app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/iniciarSesion');
    } else {
        res.render('dashboard');
    }
});

app.get(`/datosDashboard`, async (req, res) => {
    try {

        let respuestaBD = await conexion.query('SELECT * FROM reservas');

        if (respuestaBD) {
            res.json({ exito: true, info: respuestaBD[0] });
        } else {
            res.json({ exito: false });
        }

    }
    catch (err) {
        console.error(`Error en datosDashboard ${err}`);
    }
});

app.post(`/editarDatos`, async (req, res) => {
    try {

        const { idEditar } = req.body;

        let resultados = await conexion.query('SELECT * FROM reservas WHERE id = ?', [idEditar]);

        if (resultados) {
            res.json({ exito: true, info: resultados[0][0] });
        } else {
            res.json({ exito: false });
        }
    }
    catch (err) {
        console.error(`Error en editarDatos ${err}`);
    }
});

app.post(`/nuevosDatos`, async (req, res) => {
    try {

        const { numeroSolicitud, fechaLlegada, fechaSalida, tipoHabitacion, camas, adultos, menores, nombreCliente, apellidoCliente, dniCliente, correoCliente, estadoReserva } = req.body;

        await conexion.query("UPDATE reservas SET fechaLlegada = ?, fechaSalida = ?, tipoHabitacion = ?, camas = ?, adultos = ?, menores = ?, nombreCliente = ?, apellidoCliente = ?, dniCliente = ?, correoCliente = ?, estadoReserva = ? WHERE id = ?", [fechaLlegada, fechaSalida, tipoHabitacion, camas, adultos, menores, nombreCliente, apellidoCliente, dniCliente, correoCliente, estadoReserva, numeroSolicitud]);

        res.json({ exito: true });

    }
    catch (err) {
        console.error(`Error en nuevosDatos ${err}`);
    }
});

app.post(`/eliminarDatos`, async (req, res) => {
    try {

        const { idIconoBorrar } = req.body;
        await conexion.query("DELETE FROM reservas WHERE id = ?", [idIconoBorrar]);
        res.json({ exito: true });

    }
    catch (err) {
        console.error(`Error en eliminarDatos ${err}`);
    }
});

app.get('/cerrarSesion', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log('Error al destruir la sesión:', err);
            res.clearCookie('connect.sid');
            return res.redirect('/');
        } else {
            res.clearCookie('connect.sid');
            return res.redirect('/');
        }
    });
});

// Inicio el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});