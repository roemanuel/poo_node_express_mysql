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
                                        <td class="n${datosTabla.id}">${datosTabla.tipoHabitacion}</td>
                                        <td class="n${datosTabla.id}">${datosTabla.camas}</td>
                                        <td class="n${datosTabla.id}">${datosTabla.adultos}</td>
                                        <td class="n${datosTabla.id}">${datosTabla.menores}</td>
                                        <td class="n${datosTabla.id}">${datosTabla.nombreCliente}</td>
                                        <td class="n${datosTabla.id}">${datosTabla.apellidoCliente}</td>
                                        <td class="n${datosTabla.id}">${datosTabla.dniCliente}</td>
                                        <td class="n${datosTabla.id}">${datosTabla.correoCliente}</td>
                                        <td class="n${datosTabla.id}">${datosTabla.estadoReserva}</td>
                                        <td class="accionesTabla">
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

        let datosReferenciados = Array.from(document.querySelectorAll(`.n${e.target.id}`)).map(td => td.textContent);

        let fechaLlegadaPartida = datosReferenciados[1].split('/');
        datosReferenciados[1] = `${fechaLlegadaPartida[2]}-${fechaLlegadaPartida[1]}-${fechaLlegadaPartida[0]}`;

        let fechaSalidaPartida = datosReferenciados[2].split('/');
        datosReferenciados[2] = `${fechaSalidaPartida[2]}-${fechaSalidaPartida[1]}-${fechaSalidaPartida[0]}`;

        document.getElementById(`numeroSolicitud`).value = e.target.id;
        document.getElementById(`fechaLlegada`).value = datosReferenciados[1];
        document.getElementById(`fechaSalida`).value = datosReferenciados[2];
        document.getElementById(`tipoHabitacion`).value = datosReferenciados[3];
        document.getElementById(`camas`).value = datosReferenciados[4];
        document.getElementById(`adultos`).value = datosReferenciados[5];
        document.getElementById(`menores`).value = datosReferenciados[6];
        document.getElementById(`estadoReserva`).value = datosReferenciados[11];
        document.getElementById(`nombreCliente`).value = datosReferenciados[7];
        document.getElementById(`apellidoCliente`).value = datosReferenciados[8];
        document.getElementById(`dniCliente`).value = datosReferenciados[9];
        document.getElementById(`correoCliente`).value = datosReferenciados[10];

        let modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
        modal.show();

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


// --- Actualizar dashboard automáticamente
setInterval(datosDashboard, 5000);