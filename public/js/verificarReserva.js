document.getElementById('formReserva').addEventListener('submit', async (e) => {
    e.preventDefault();
    const dniCliente = document.getElementById('dniCliente').value;

    const res = await fetch('/consultarReserva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dniCliente })
    });

    const rtaServidor = await res.json();

    // 🔹 Obtenemos el cuerpo del modal y la instancia
    const modalBody = document.querySelector('#staticBackdrop .modal-body');
    const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));

    if (rtaServidor.exito == true) {
        modalBody.innerHTML = `
                                <div>
                                    <ul class="list-group">
                                        <li class="list-group-item"><b>Nombre:</b> ${rtaServidor.info.nombreCliente} ${rtaServidor.info.apellidoCliente}</li>
                                        <li class="list-group-item"><b>DNI:</b> ${rtaServidor.info.dniCliente}</li>
                                        <li class="list-group-item"><b>Correo:</b> ${rtaServidor.info.correoCliente}</li>
                                        <li class="list-group-item"><b>Tipo de habitación:</b> ${rtaServidor.info.tipoHabitacion}</li>
                                        <li class="list-group-item"><b>Cantidad de personas:</b> ${rtaServidor.info.cantidadPersonas}</li>
                                        <li class="list-group-item"><b>Fecha de llegada:</b> ${new Date(rtaServidor.info.fechaLlegada).toLocaleDateString()}</li>
                                        <li class="list-group-item"><b>Fecha de salida:</b> ${new Date(rtaServidor.info.fechaSalida).toLocaleDateString()}</li>
                                        <li class="list-group-item"><b>Estado de la reserva:</b> ${rtaServidor.info.estadoReserva}</li>
                                    </ul>
                                </div>
                            `;
    } else {
        modalBody.innerHTML = `<div class="alert alert-danger mt-3">❌ No se encontró ninguna reserva con ese DNI.</div>`;
    }

    // 🔹 Mostramos el modal automáticamente
    modal.show();
});