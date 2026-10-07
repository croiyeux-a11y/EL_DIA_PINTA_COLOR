const SUPABASE_URL =
    "https://uxzkjrilvsslicjcodvr.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_eex5Cl9YrYkmwXGaOsTY-w_rc_N8PtL";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const pollDate =
    document.getElementById("poll-date");

const pollTitle =
    document.getElementById("poll-title");

const optionsContainer =
    document.getElementById("options-container");

const pollForm =
    document.getElementById("poll-form");

const personaInput =
    document.getElementById("persona");

const voteButton =
    document.getElementById("vote-button");

const message =
    document.getElementById("message");

const resultsSection =
    document.getElementById("results-section");

const resultsContainer =
    document.getElementById("results-container");

let encuestaActual = null;

document.addEventListener(
    "DOMContentLoaded",
    cargarEncuesta
);

async function cargarEncuesta() {

    mostrarMensaje(
        "Cargando encuesta..."
    );

    try {

        const { data, error } =
            await supabaseClient.rpc(
                "obtener_encuesta_activa"
            );

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {

            pollDate.textContent = "";

            pollTitle.textContent =
                "No hay ninguna encuesta activa";

            optionsContainer.innerHTML = `
                <p class="loading">
                    La encuesta de hoy todavía no está disponible.
                </p>
            `;

            voteButton.disabled = true;

            limpiarMensaje();

            return;
        }

        encuestaActual = data[0];

        pollTitle.textContent =
            encuestaActual.titulo;

        pollDate.textContent =
            formatearFecha(
                encuestaActual.fecha
            );

        await cargarOpciones();

        limpiarMensaje();

    } catch (error) {

        console.error(
            "Error cargando la encuesta:",
            error
        );

        mostrarMensaje(
            "No se ha podido cargar la encuesta.",
            "error"
        );
    }
}

async function cargarOpciones() {

    const { data, error } =
        await supabaseClient.rpc(
            "obtener_opciones_activas"
        );

    if (error) {
        throw error;
    }

    if (!data || data.length === 0) {

        optionsContainer.innerHTML = `
            <p class="loading">
                No hay opciones disponibles.
            </p>
        `;

        voteButton.disabled = true;

        return;
    }

    optionsContainer.innerHTML = "";

    const emojis = {
        1: "🌊",
        2: "🫒",
        3: "🐪",
        4: "🖤",
        5: "👻"
    };

    data.forEach((opcion) => {

        const optionId =
            `color-${opcion.id}`;

        const emoji =
            emojis[opcion.id] || "";

        const optionHTML = `

            <div class="color-option">

                <input
                    type="radio"
                    id="${optionId}"
                    name="opcion"
                    value="${opcion.id}"
                    required
                >

                <label for="${optionId}">

                    <span
                        class="color-preview"
                        style="background-color: ${opcion.color_hex};"
                        aria-hidden="true"
                    ></span>

                    <span class="color-name">

                        ${escapeHTML(opcion.nombre)}

                        ${emoji}

                    </span>

                </label>

            </div>

        `;

        optionsContainer.insertAdjacentHTML(
            "beforeend",
            optionHTML
        );

    });
}

pollForm.addEventListener(
    "submit",
    registrarVoto
);

async function registrarVoto(event) {

    event.preventDefault();

    if (!encuestaActual) {

        mostrarMensaje(
            "No hay una encuesta activa.",
            "error"
        );

        return;
    }

    const opcionSeleccionada =
        document.querySelector(
            'input[name="opcion"]:checked'
        );

    if (!opcionSeleccionada) {

        mostrarMensaje(
            "Selecciona un color.",
            "error"
        );

        return;
    }

    const nombre =
        personaInput.value.trim();

    if (nombre.length < 2) {

        mostrarMensaje(
            "Escribe tu nombre.",
            "error"
        );

        personaInput.focus();

        return;
    }

    if (nombre.length > 60) {

        mostrarMensaje(
            "El nombre no puede superar los 60 caracteres.",
            "error"
        );

        personaInput.focus();

        return;
    }

    const opcionId =
        Number(
            opcionSeleccionada.value
        );

    voteButton.disabled = true;

    voteButton.textContent =
        "Registrando voto...";

    try {

        const { data, error } =
            await supabaseClient.rpc(
                "registrar_voto",
                {
                    p_encuesta_id:
                        encuestaActual.id,

                    p_opcion_id:
                        opcionId,

                    p_persona:
                        nombre
                }
            );

        if (error) {
            throw error;
        }

        console.log(
            "Voto registrado correctamente:",
            data
        );

        mostrarMensaje(
            `¡Ya has votado!
El plan sigue adelante. Nadie sabe cuál, pero sigue adelante.
Que mañana Manuel venga con el modo "nos vamos pronto" activado.`,
            "success"
        );

        voteButton.textContent =
            "Voto registrado";

        personaInput.disabled =
            true;

        document
            .querySelectorAll(
                'input[name="opcion"]'
            )
            .forEach(
                input => {
                    input.disabled =
                        true;
                }
            );

        await cargarResultados();

    } catch (error) {

        console.error(
            "Error registrando el voto:",
            error
        );

        mostrarMensaje(
            obtenerMensajeError(error),
            "error"
        );

        voteButton.disabled =
            false;

        voteButton.textContent =
            "Votar";
    }
}

async function cargarResultados() {

    const { data, error } =
        await supabaseClient.rpc(
            "obtener_resultados"
        );

    if (error) {
        throw error;
    }

    if (!data) {
        return;
    }

    resultsContainer.innerHTML =
        "";

    data.forEach((resultado) => {

        const porcentaje =
            Number(
                resultado.porcentaje
            ) || 0;

        const resultHTML = `

            <div class="result-item">

                <div class="result-top">

                    <span class="result-name">

                        ${escapeHTML(
                            resultado.nombre
                        )}

                    </span>

                    <span class="result-percentage">

                        ${porcentaje}%

                    </span>

                </div>

                <div class="result-bar">

                    <div
                        class="result-fill"
                        style="
                            width: ${porcentaje}%;
                            background-color: ${resultado.color_hex};
                        "
                    ></div>

                </div>

            </div>

        `;

        resultsContainer.insertAdjacentHTML(
            "beforeend",
            resultHTML
        );

    });

    resultsSection.classList.remove(
        "hidden"
    );
}

function mostrarMensaje(
    texto,
    tipo = ""
) {

    message.innerHTML =
        escapeHTML(texto)
            .replace(/\n/g, "<br>");

    message.className =
        `message ${tipo}`;
}

function limpiarMensaje() {

    message.textContent =
        "";

    message.className =
        "message";
}

function formatearFecha(
    fecha
) {

    const partes =
        fecha.split("-");

    const fechaLocal =
        new Date(

            Number(partes[0]),

            Number(partes[1]) - 1,

            Number(partes[2])

        );

    return fechaLocal.toLocaleDateString(
        "es-ES",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}

function escapeHTML(
    texto
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        texto;

    return div.innerHTML;
}

function obtenerMensajeError(
    error
) {

    const mensaje =
        error?.message || "";

    if (
        mensaje.includes(
            "El nombre debe tener al menos 2 caracteres"
        )
    ) {

        return (
            "El nombre debe tener al menos 2 caracteres."
        );
    }

    if (
        mensaje.includes(
            "El nombre no puede superar los 60 caracteres"
        )
    ) {

        return (
            "El nombre no puede superar los 60 caracteres."
        );
    }

    if (
        mensaje.includes(
            "La encuesta no está activa"
        )
    ) {

        return (
            "La encuesta ya no está activa."
        );
    }

    if (
        mensaje.includes(
            "La opción seleccionada no pertenece"
        )
    ) {

        return (
            "La opción seleccionada no es válida."
        );
    }

    return (
        "No se ha podido registrar el voto."
    );
}