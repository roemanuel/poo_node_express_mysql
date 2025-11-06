document.getElementById('formularioReserva').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fechaLlegada = document.getElementById('fechaLlegada').value;
    const fechaSalida = document.getElementById('fechaSalida').value;
    const tipoHabitacion = document.getElementById('tipoHabitacion').value;
    const cantidadPersonas = document.getElementById('cantidadPersonas').value;
    const nombreCliente = document.getElementById('nombreCliente').value;
    const apellidoCliente = document.getElementById('apellidoCliente').value;
    const dniCliente = document.getElementById('dniCliente').value;
    const correoCliente = document.getElementById('correoCliente').value;

    const datosEnviar = {
        fechaLlegada: fechaLlegada,
        fechaSalida: fechaSalida,
        tipoHabitacion: tipoHabitacion,
        cantidadPersonas: cantidadPersonas,
        nombreCliente: nombreCliente,
        apellidoCliente: apellidoCliente,
        dniCliente: dniCliente,
        correoCliente: correoCliente
    }

    const res = await fetch('/registrarReserva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosEnviar)
    });

    const rtaServidor = await res.json();

    const modalBody = document.querySelector('#staticBackdrop .modal-body');
    const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));

    if (rtaServidor.exito == true) {
        modalBody.innerHTML = `
                                <div>
                                    <ul class="list-group modalTextoReserva">
                                        <li class="alert alert-success">Tu reserva se registró correctamente.<br>Gracias por elegirnos</li>
                                    </ul>
                                </div>
                            `;
    }

    modal.show();
});