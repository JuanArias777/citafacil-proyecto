document.addEventListener("DOMContentLoaded", () => {
    // 1. Lógica de Pestañas (Tabs Navigation)
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = button.getAttribute("data-target");

            // Remover clase active
            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));

            // Activar botón y sección correspondiente
            button.classList.add("active");
            document.getElementById(targetId).classList.add("active");
        });
    });

    // 2. Selección de Servicio para Agendar
    const selectServiceButtons = document.querySelectorAll(".select-service");
    const serviceInput = document.getElementById("service-input");

    selectServiceButtons.forEach(button => {
        button.addEventListener("click", () => {
            const serviceName = button.getAttribute("data-service");
            serviceInput.value = serviceName;

            // Cambiar automáticamente a la pestaña de agendar
            document.querySelector('[data-target="agendar"]').click();
        });
    });

    // 3. Simulación de Envío del Formulario de Cita
    const bookingForm = document.getElementById("booking-form");
    const appointmentsTableBody = document.querySelector("#appointments-table tbody");

    bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const servicio = serviceInput.value;
        const fecha = document.getElementById("date-input").value;
        const hora = document.getElementById("time-input").value;

        if (!servicio) {
            alert("Por favor, seleccione un servicio primero.");
            return;
        }

        // Crear nueva fila en la tabla de Mis Citas
        const newRow = document.createElement("tr");
        const randomId = `#00${Math.floor(Math.random() * 90) + 10}`;

        newRow.innerHTML = `
            <td>${randomId}</td>
            <td>${servicio}</td>
            <td>${fecha}</td>
            <td>${hora}</td>
            <td><span class="badge confirmed">Confirmada</span></td>
            <td><button class="btn-danger cancel-btn">Cancelar</button></td>
        `;

        appointmentsTableBody.appendChild(newRow);

        alert("¡Cita agendada con éxito!");
        bookingForm.reset();
        serviceInput.value = "";

        // Redirigir a "Mis Citas" para ver el resultado
        document.querySelector('[data-target="mis-citas"]').click();
        attachCancelEvents();
    });

    // 4. Lógica para cancelar citas dinámicas
    function attachCancelEvents() {
        const cancelButtons = document.querySelectorAll(".cancel-btn");
        cancelButtons.forEach(btn => {
            // Evitar duplicar eventos
            btn.onclick = function() {
                const row = btn.closest("tr");
                const badge = row.querySelector(".badge");
                badge.textContent = "Cancelada";
                badge.className = "badge cancelled";
                btn.remove(); // Quitar botón de cancelar una vez cancelada
            };
        });
    }

    attachCancelEvents();
});