/* CitaFácil: lógica del módulo de gestión de citas. */
"use strict";

// Clave exclusiva para almacenar los registros de este prototipo.
const STORAGE_KEY = "citafacil_citas_v1";

// Referencias a los controles del formulario y la tabla.
const formulario = document.getElementById("form-cita");
const campoId = document.getElementById("id-cita");
const campoNombre = document.getElementById("nombre-cliente");
const campoServicio = document.getElementById("servicio");
const campoFecha = document.getElementById("fecha");
const campoHora = document.getElementById("hora");
const campoObservaciones = document.getElementById("observaciones");
const listaCitas = document.getElementById("lista-citas");
const totalCitas = document.getElementById("total-citas");
const estadoVacio = document.getElementById("estado-vacio");
const filtroEstado = document.getElementById("filtro-estado");
const mensajeApp = document.getElementById("mensaje-app");
const botonGuardar = document.getElementById("btn-guardar");
const botonCancelarEdicion = document.getElementById("btn-cancelar-edicion");
let citas = cargarCitas();

/** Lee los registros guardados; si los datos no son válidos, inicia con una lista vacía. */
function cargarCitas() {
  try {
    const datos = localStorage.getItem(STORAGE_KEY);
    const resultado = datos ? JSON.parse(datos) : [];
    return Array.isArray(resultado) ? resultado : [];
  } catch (error) {
    console.error("No fue posible leer las citas:", error);
    return [];
  }
}

/** Persiste la lista en el navegador. Devuelve false si el navegador lo impide. */
function guardarCitas() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(citas));
    return true;
  } catch (error) {
    console.error("No fue posible guardar las citas:", error);
    mostrarMensaje("El navegador no permitió guardar los datos.", "danger");
    return false;
  }
}

/** Muestra mensajes de validación o confirmación usando clases de Bootstrap. */
function mostrarMensaje(texto, tipo = "success") {
  mensajeApp.textContent = texto;
  mensajeApp.className = `alert alert-${tipo}`;
}

/** Oculta el mensaje actual. */
function ocultarMensaje() {
  mensajeApp.textContent = "";
  mensajeApp.className = "alert d-none";
}

/** Presenta una fecha ISO como DD/MM/AAAA sin desplazar el día por zona horaria. */
function formatearFecha(fechaISO) {
  const partes = fechaISO.split("-");
  return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : fechaISO;
}

/** Escapa texto del usuario antes de incorporarlo a la tabla. */
function escaparHTML(valor) {
  return String(valor).replace(/[&<>"']/g, (caracter) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[caracter]);
}

/** Actualiza el resumen y vuelve a dibujar la tabla aplicando el filtro elegido. */
function renderizarCitas() {
  const filtro = filtroEstado.value;
  const visibles = citas
    .filter((cita) => filtro === "todas" || cita.estado === filtro)
    .sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`));

  listaCitas.replaceChildren();
  totalCitas.textContent = String(citas.length);
  estadoVacio.classList.toggle("d-none", visibles.length > 0);

  if (visibles.length === 0) {
    const hayCitas = citas.length > 0;
    estadoVacio.querySelector("h3").textContent = hayCitas ? "No hay citas para este filtro" : "Todavía no hay citas";
    estadoVacio.querySelector("p").textContent = hayCitas
      ? "Selecciona otro estado para ver más resultados."
      : "Completa el formulario para registrar la primera.";
  }

  visibles.forEach((cita) => {
    const fila = document.createElement("tr");
    const claseEstado = {
      Pendiente: "estado-pendiente",
      Confirmada: "estado-confirmada",
      Cancelada: "estado-cancelada"
    }[cita.estado] || "estado-pendiente";

    // Los datos variables se escapan para que se muestren como texto.
    fila.innerHTML = `
      <td><span class="cita-nombre">${escaparHTML(cita.nombre)}</span>
        <span class="cita-detalle">${escaparHTML(cita.servicio)}</span></td>
      <td>${escaparHTML(formatearFecha(cita.fecha))}
        <span class="cita-detalle">${escaparHTML(cita.hora)}</span></td>
      <td><span class="estado ${claseEstado}">${escaparHTML(cita.estado)}</span></td>
      <td><div class="acciones">
        <button class="btn btn-sm btn-outline-primary" type="button" data-accion="editar" data-id="${escaparHTML(cita.id)}">Editar</button>
        ${cita.estado !== "Cancelada" ? `<button class="btn btn-sm btn-outline-danger" type="button" data-accion="cancelar" data-id="${escaparHTML(cita.id)}">Cancelar</button>` : ""}
      </div></td>`;
    listaCitas.appendChild(fila);
  });
}

/** Valida los campos obligatorios y evita registrar fechas anteriores a hoy. */
function validarFormulario() {
  formulario.classList.add("was-validated");
  if (!formulario.checkValidity()) {
    mostrarMensaje("Completa los campos obligatorios.", "warning");
    return false;
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaElegida = new Date(`${campoFecha.value}T00:00:00`);
  if (Number.isNaN(fechaElegida.getTime()) || fechaElegida < hoy) {
    mostrarMensaje("La fecha de la cita no puede estar en el pasado.", "warning");
    campoFecha.focus();
    return false;
  }
  return true;
}

/** Devuelve el formulario al modo de creación de una nueva cita. */
function reiniciarFormulario() {
  formulario.reset();
  formulario.classList.remove("was-validated");
  campoId.value = "";
  botonGuardar.textContent = "Guardar cita";
  botonCancelarEdicion.classList.add("d-none");
  document.getElementById("titulo-formulario").textContent = "Registrar una cita";
}

/** Guarda una cita nueva o actualiza la seleccionada. */
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  ocultarMensaje();
  if (!validarFormulario()) return;

  const idActual = campoId.value;
  const datos = {
    nombre: campoNombre.value.trim(),
    servicio: campoServicio.value,
    fecha: campoFecha.value,
    hora: campoHora.value,
    observaciones: campoObservaciones.value.trim()
  };

  if (!datos.nombre) {
    mostrarMensaje("El nombre no puede estar vacío.", "warning");
    campoNombre.focus();
    return;
  }

  if (idActual) {
    const indice = citas.findIndex((cita) => cita.id === idActual);
    if (indice < 0) {
      mostrarMensaje("No se encontró la cita seleccionada.", "danger");
      reiniciarFormulario();
      return;
    }
    citas[indice] = { ...citas[indice], ...datos };
    if (!guardarCitas()) return;
    mostrarMensaje("La cita se actualizó correctamente.");
  } else {
    const nueva = {
      id: crearId(), ...datos, estado: "Pendiente",
      fechaCreacion: new Date().toISOString()
    };
    citas.push(nueva);
    if (!guardarCitas()) {
      citas = citas.filter((cita) => cita.id !== nueva.id);
      return;
    }
    mostrarMensaje("La cita se registró correctamente.");
  }

  reiniciarFormulario();
  renderizarCitas();
});

/** Genera un identificador único para el prototipo. */
function crearId() {
  return window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : `cita-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Carga la cita elegida en el formulario para modificarla. */
function editarCita(id) {
  const cita = citas.find((elemento) => elemento.id === id);
  if (!cita) {
    mostrarMensaje("No se encontró la cita seleccionada.", "danger");
    return;
  }
  campoId.value = cita.id;
  campoNombre.value = cita.nombre;
  campoServicio.value = cita.servicio;
  campoFecha.value = cita.fecha;
  campoHora.value = cita.hora;
  campoObservaciones.value = cita.observaciones || "";
  botonGuardar.textContent = "Guardar cambios";
  botonCancelarEdicion.classList.remove("d-none");
  document.getElementById("titulo-formulario").textContent = "Editar una cita";
  formulario.classList.remove("was-validated");
  formulario.scrollIntoView({ behavior: "smooth", block: "start" });
  campoNombre.focus();
}

/** Cancela una cita sin eliminar el registro histórico. */
function cancelarCita(id) {
  const cita = citas.find((elemento) => elemento.id === id);
  if (!cita || cita.estado === "Cancelada") return;
  if (!window.confirm(`¿Deseas cancelar la cita de ${cita.nombre}?`)) return;

  const estadoAnterior = cita.estado;
  cita.estado = "Cancelada";
  if (!guardarCitas()) {
    cita.estado = estadoAnterior;
    return;
  }
  renderizarCitas();
  mostrarMensaje("La cita se canceló y se conserva en el historial.");
}

/* Delegación: un único listener atiende botones de las filas creadas dinámicamente. */
listaCitas.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;
  if (boton.dataset.accion === "editar") editarCita(boton.dataset.id);
  if (boton.dataset.accion === "cancelar") cancelarCita(boton.dataset.id);
});

filtroEstado.addEventListener("change", renderizarCitas);
botonCancelarEdicion.addEventListener("click", () => {
  reiniciarFormulario();
  ocultarMensaje();
});

// Al pulsar Limpiar, también se abandona el modo de edición.
formulario.addEventListener("reset", () => {
  setTimeout(() => {
    campoId.value = "";
    formulario.classList.remove("was-validated");
    botonGuardar.textContent = "Guardar cita";
    botonCancelarEdicion.classList.add("d-none");
    document.getElementById("titulo-formulario").textContent = "Registrar una cita";
  }, 0);
});

// Render inicial al abrir la aplicación.
renderizarCitas();
