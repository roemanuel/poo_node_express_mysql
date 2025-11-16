// --- Traer datos del dashboard
async function datosDashboard() {
    try {
        let respuestaBD = await fetch(`/datosDashboard`);
        respuestaBD = await respuestaBD.json();

        if (respuestaBD.exito == true) {
            const htmlTabla = document.querySelector(`.datosBD`);
            let contenido = ``;

            respuestaBD.info.forEach(datosTabla => {
                contenido += `
                                    <tr>
                                        <td class="n${datosTabla.id}">${datosTabla.id}</td>
                                        <td class="n${datosTabla.id}">${new Date(datosTabla.fechaLlegada).toLocaleDateString()}</td>
                                        <td class="n${datosTabla.id}">${new Date(datosTabla.fechaSalida).toLocaleDateString()}</td>
                                        <td class="n${datosTabla.id}">${datosTabla.nombreCliente}</td>
                                        <td class="n${datosTabla.id}">${datosTabla.apellidoCliente}</td>
                                        <td class="n${datosTabla.id}">${datosTabla.dniCliente}</td>
                                        <td class="n${datosTabla.id}">${datosTabla.correoCliente}</td>
                                        <td class="n${datosTabla.id} estado${datosTabla.estadoReserva}">${datosTabla.estadoReserva}</td>
                                        <td class="accionesTabla">
                                            <i class="bi bi-eye" id="${datosTabla.id}"></i>
                                            <i class="bi bi-pencil" id="${datosTabla.id}"></i>
                                            <i class="bi bi bi-trash" id="${datosTabla.id}"></i>
                                        </td>
                                    </tr>
                                `
            })

            htmlTabla.innerHTML = contenido;
        }
    }
    catch (err) {
        console.error(`Error al traer los datos del dashboard ${err}`);
    }
};

datosDashboard();


// --- Listener único para editar y eliminar
let idIconoBorrar = null;
let modalBorrar = new bootstrap.Modal(document.getElementById('modalConfirmarBorrarDashboard'));


document.addEventListener('click', async (e) => {

    // --- Editar datos
    if (e.target.classList.contains('bi-pencil')) {

        let idEditar = e.target.id;

        let res = await fetch('/editarDatos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idEditar })
        });

        res = await res.json();

        if (res.exito == true) {

            res.info.fechaLlegada = new Date(res.info.fechaLlegada);
            res.info.fechaLlegada = res.info.fechaLlegada.toISOString().split("T")[0];

            res.info.fechaSalida = new Date(res.info.fechaSalida);
            res.info.fechaSalida = res.info.fechaSalida.toISOString().split("T")[0];

            document.getElementById(`numeroSolicitud`).value = res.info.id;
            document.getElementById(`fechaLlegada`).value = res.info.fechaLlegada;
            document.getElementById(`fechaSalida`).value = res.info.fechaSalida;
            document.getElementById(`tipoHabitacion`).value = res.info.tipoHabitacion;
            document.getElementById(`camas`).value = res.info.camas;
            document.getElementById(`adultos`).value = res.info.adultos;
            document.getElementById(`menores`).value = res.info.menores;
            document.getElementById(`estadoReserva`).value = res.info.estadoReserva;
            document.getElementById(`nombreCliente`).value = res.info.nombreCliente;
            document.getElementById(`apellidoCliente`).value = res.info.apellidoCliente;
            document.getElementById(`dniCliente`).value = res.info.dniCliente;
            document.getElementById(`correoCliente`).value = res.info.correoCliente;

            let modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
            modal.show();
        }

        return;
    }

    // --- Eliminar datos
    if (e.target.classList.contains('bi-trash')) {
        idIconoBorrar = e.target.id;
        modalBorrar.show();
    };
});





document.getElementById(`siBorrar`).addEventListener(`click`, async () => {
    let res = await fetch('/eliminarDatos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idIconoBorrar })
    });

    res = await res.json();

    if (res.exito == true) {
        datosDashboard();
        modalBorrar.hide();
        idIconoBorrar = null;
    }
})



// --- Enviar datos modificados a la BD
document.getElementById('modificarDatos').addEventListener('click', async (e) => {
    e.preventDefault();

    let numeroSolicitud = document.getElementById(`numeroSolicitud`).value;
    let valorFechaLlegadaNuevo = document.getElementById(`fechaLlegada`).value;
    let valorFechaSalidaNuevo = document.getElementById(`fechaSalida`).value;
    let valorTipoHabitacionNuevo = document.getElementById(`tipoHabitacion`).value;
    let valorCamasNuevo = document.getElementById(`camas`).value;
    let valorAdultosNuevo = document.getElementById(`adultos`).value;
    let valorMenoresNuevo = document.getElementById(`menores`).value;
    let valorNombreClienteNuevo = document.getElementById(`nombreCliente`).value;
    let valorApellidoClienteNuevo = document.getElementById(`apellidoCliente`).value;
    let valorDniClienteNuevo = document.getElementById(`dniCliente`).value;
    let valorCorreoClienteNuevo = document.getElementById(`correoCliente`).value;
    let valorEstadoReservaNuevo = document.getElementById(`estadoReserva`).value;

    const datosNuevosEnviar = {
        numeroSolicitud: numeroSolicitud,
        fechaLlegada: valorFechaLlegadaNuevo,
        fechaSalida: valorFechaSalidaNuevo,
        tipoHabitacion: valorTipoHabitacionNuevo,
        camas: valorCamasNuevo,
        adultos: valorAdultosNuevo,
        menores: valorMenoresNuevo,
        nombreCliente: valorNombreClienteNuevo,
        apellidoCliente: valorApellidoClienteNuevo,
        dniCliente: valorDniClienteNuevo,
        correoCliente: valorCorreoClienteNuevo,
        estadoReserva: valorEstadoReservaNuevo
    }

    let res = await fetch('/nuevosDatos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosNuevosEnviar)
    });

    res = await res.json();

    if (res.exito == true) {
        let modal = bootstrap.Modal.getInstance(document.getElementById('staticBackdrop'));
        modal.hide();
        datosDashboard();
    }
});

// --- Listener ver los datos

document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('bi-eye')) {
        let idEditar = e.target.id;

        let res = await fetch('/editarDatos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idEditar })
        });

        res = await res.json();

        let modalBody = document.querySelector('#modalDashboardVerDatos .modal-body');
        let modal = new bootstrap.Modal(document.getElementById('modalDashboardVerDatos'));

        if (res.exito == true) {
            modalBody.innerHTML = `
                                <div>
                                    <ul class="list-group">
                                        <li class="list-group-item"><b>Número de solicitud:</b> ${res.info.id}</li>
                                        <li class="list-group-item"><b>Fecha de llegada:</b> ${new Date(res.info.fechaLlegada).toLocaleDateString()}</li>
                                        <li class="list-group-item"><b>Fecha de salida:</b> ${new Date(res.info.fechaSalida).toLocaleDateString()}</li>
                                        <li class="list-group-item"><b>Tipo de habitación:</b> ${res.info.tipoHabitacion}</li>
                                        <li class="list-group-item"><b>Cama:</b> ${res.info.camas}</li>
                                        <li class="list-group-item"><b>Adultos:</b> ${res.info.adultos}</li>
                                        <li class="list-group-item"><b>Menores:</b> ${res.info.menores}</li>
                                        <li class="list-group-item"><b>Nombre:</b> ${res.info.nombreCliente} ${res.info.apellidoCliente}</li>
                                        <li class="list-group-item"><b>DNI:</b> ${res.info.dniCliente}</li>
                                        <li class="list-group-item"><b>Correo:</b> ${res.info.correoCliente}</li>
                                        <li class="list-group-item estado${res.info.estadoReserva}"><b>Estado de la reserva:</b> ${res.info.estadoReserva}</li>
                                    </ul>
                                </div>
                            `;
        }

        modal.show();
    }
});


// --- Actualizar dashboard automáticamente
setInterval(datosDashboard, 5000);