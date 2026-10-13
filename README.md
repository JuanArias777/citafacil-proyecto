# CitaFácil — Módulo frontend de gestión de citas

**Evidencia:** GA7-220501096-AA3-EV01  
**Tecnologías:** HTML5, CSS3, JavaScript y Bootstrap 5.3  
**Tipo:** prototipo frontend con almacenamiento local.

## Descripción
Permite registrar, consultar, editar y cancelar citas de prueba en una interfaz adaptable a computador y móvil.

## Funcionalidades
- Registrar citas con nombre, servicio, fecha y hora.
- Validar campos obligatorios y evitar fechas pasadas.
- Ordenar y filtrar las citas por estado.
- Editar citas y cancelar sin borrar el historial.
- Guardar datos en `localStorage`.
- Mostrar mensajes de validación y confirmación.

## Estructura
```text
JUAN_SEBASTIAN_ARIAS_ACOSTA_AA3_EV01/
├── index.html
├── README.md
├── ENLACE_REPOSITORIO.txt
├── .gitignore
├── css/styles.css
└── js/app.js
```

## Ejecutar
1. Descomprime la carpeta.
2. Abre `index.html` en un navegador moderno, o abre la carpeta en VS Code con Live Server.
3. Se requiere conexión a internet para cargar Bootstrap desde CDN.
4. Registra una cita y recarga la página para verificar que los datos se mantienen en el mismo navegador.

## Alcance y limitaciones
Este es un prototipo académico frontend. Los datos permanecen en el almacenamiento local del navegador; no se conectan a un servidor ni a MySQL. Borrar los datos del navegador puede eliminarlos. No usar con datos personales reales. Los servicios son opciones demostrativas.

## Buenas prácticas
- HTML semántico con idioma y metadatos.
- Separación de HTML, CSS y JavaScript.
- Comentarios, nombres descriptivos y validación.
- Escape de texto al mostrar valores en la tabla.
- Diseño responsive y mensajes accesibles.

## Git y GitHub
Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
git init
git add .
git commit -m "feat: crear modulo frontend de gestion de citas"
git branch -M main
```

Crea un repositorio vacío en GitHub llamado `CitaFacil`. Luego usa la URL real del repositorio:

```bash
git remote add origin https://github.com/TU-USUARIO/CitaFacil.git
git push -u origin main
```

Reemplaza `TU-USUARIO` por tu nombre de usuario real. Después copia la URL real en `ENLACE_REPOSITORIO.txt`.

Para subir cambios posteriores:
```bash
git add .
git commit -m "fix: describir el cambio realizado"
git push
```

## Entrega
Incluye todos los archivos y la URL real del repositorio en el ZIP. Cambia el nombre de la carpeta y del ZIP al formato solicitado por el SENA: `NOMBRE_APELLIDO_AA3_EV01`.
