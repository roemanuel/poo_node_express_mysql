document.getElementById('formInicioSesion').addEventListener('submit', async (e) => {
    e.preventDefault();
    const correoAdministrador = document.getElementById('correoAdministrador').value;
    const passwordAdministrador = document.getElementById('passwordAdministrador').value;

    const datosEnviar = {
        correoAdministrador: correoAdministrador,
        passwordAdministrador: passwordAdministrador
    }

    const res = await fetch('/consultarAdministrador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosEnviar)
    });

    const rtaServidor = await res.json();

    const modalBody = document.querySelector('#staticBackdrop .modal-body');
    const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));

    if (rtaServidor.exito == true) {

        window.location.href = '/dashboard';

    } else {
        modalBody.innerHTML = `
                                <div class="alert alert-danger mt-3">Los datos introducidos son incorrectos</div>
                                `;

        modal.show();
    }
});