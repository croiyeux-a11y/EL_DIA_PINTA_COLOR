// ============================================================
// EL COLOR DEL DÍA
// ============================================================

// ------------------------------------------------------------
// SUPABASE
// ------------------------------------------------------------

const SUPABASE_URL =
    "https://uxzkjrilvsslicjcodvr.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_eex5Cl9YrYkmwXGaOsTY-w_rc_N8PtL";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// ------------------------------------------------------------
// ELEMENTOS HTML
// ------------------------------------------------------------

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


// ------------------------------------------------------------
// ESTADO
// ------------------------------------------------------------

let encuestaActual = null;


// ------------------------------------------------------------
// EMOJIS
// ------------------------------------------------------------

const emojis = {

    verde: "🐸",
    blanco: "🐑",
    morado: "🍇",
    beige: "🐻",

    azul: "🐳",
    marron: "🍫",
    granate: "🍷",
    lila: "🦄",

    fucsia: "🦩",
    crema: "🍦",
    rojo: "🍓",
    negro: "🐈‍⬛",

    rosa: "🌸",
    naranja: "🦊",
    amarillo: "🐥"
};


// ------------------------------------------------------------
// MENSAJES FINALES
// ------------------------------------------------------------

const mensajesDelDia = {

    0: {
        titulo: "RESULTADOS DEL DOMINGO",

        texto: `
Después de dedicar una cantidad de tiempo completamente injustificable a decidir qué color nos viste el lunes...

**[COLOR GANADOR]** ha ganado.

¿Era necesario hacer una encuesta para esto?

**Absolutamente no.**

¿La hemos hecho igualmente?

**Por supuesto.**

Gracias por participar en esta magnífica pérdida de tiempo colectiva.

Ahora ya sabemos cómo empezaremos el lunes.

**Como si el lunes no fuera suficientemente malo por sí solo.**

Mañana continuamos con asuntos igual de triviales.

Lunes de [COLOR GANADOR] [EMOJI]
`
    },


    1: {
        titulo: "EL LUNES NO PODÍA SER PEOR...",

        texto: `
Y entonces decidimos seguir perdiendo el tiempo para votar un color.

Tras una jornada de desempleo, sufrimiento y decisiones que probablemente nadie necesitaba tomar:

**[COLOR GANADOR]**

es oficialmente el color ganador de hoy.

Hemos perdido unos minutos de nuestra vida en esto.

**Pero al menos ahora sabemos algo completamente innecesario.**

Mañana volveremos a hacerlo. Porque aprender de nuestros errores no estaba en el programa.

Martes de [COLOR GANADOR] [EMOJI]
`
    },


    2: {
        titulo: "LA DEMOCRACIA QUE NADIE HABÍA PEDIDO",

        texto: `
Hemos votado.

Hemos contado votos.

Hemos calculado porcentajes.

Hemos utilizado tecnología para resolver una cuestión que ni siquiera requería solución.

Pero ya que hemos llegado hasta aquí...

**[COLOR GANADOR]** es el ganador.

Gracias por contribuir a esta pérdida de tiempo perfectamente organizada.

Miércoles de [COLOR GANADOR] [EMOJI]
`
    },


    3: {
        titulo: "MIÉRCOLES — YA ESTAMOS EN TIERRA DERECHA",

        texto: `
Hemos llegado al ombligo de la semana.

Lunes superado, martes superado y el miércoles ya cae.

**El finde ya empieza a asomar por el horizonte.**

Desde aquí todo es cuesta abajo.

Pero antes de llegar al viernes tenemos que resolver una cuestión de vital importancia.

Después de una votación absolutamente necesaria para la supervivencia de nadie...

**[COLOR GANADOR]**

se proclama ganador.

¿Era necesario votar?

**No.**

¿Hemos perdido unos minutos de nuestra vida en esto?

**Por supuesto.**

Pero ya estamos en tierra derecha.

**Aguantamos un poquito más. El finde está cada vez más cerca.**

Jueves de [COLOR GANADOR] [EMOJI]
`
    },


    4: {
        titulo: "YA CASI ES VIERNES",

        texto: `
Hemos llegado al jueves. Con altos y bajos, pero hemos llegado, que es lo importante.

Solo queda un último esfuerzo y podremos dejar de fingir que venimos por gusto y no por la beca.

Pero antes de celebrar el fin de semana, tenemos una última decisión que tomar.

Después de una semana entera votando colores, perdiendo el tiempo y tomando decisiones de dudosa importancia...

**Viernes de [COLOR GANADOR] [EMOJI].**

¿Hemos solucionado algún problema?

**No.**

¿Hemos aprovechado nuestro tiempo?

**Tampoco, pero lo disfrutamos.**

¿Ha merecido la pena?

**Cada segundo y cada byte gastado.**

Porque mañana es viernes y el cuerpo lo sabe.

¿Sale cafecito? ¿Unas cañas? ¿Picoteo? ¿Terrazeo? ¿Tardeo? ¿Tercer tiempo? ¿Se lía? ¿Un reseteo necesario?

Eso ya depende de los que se sumen.

Si tu respuesta es no, todavía estás a tiempo de solucionarlo. Siempre se puede hacer el milagro.

Organízate. Pide permiso o avisa en el trabajo, en casa, invita al/la toxic@. Ve al médico y coméntale que justo hoy viernes te sientes fatal, que no puedes con tu vida y que solo se te pasa con **Terraceoform, Tardeodol Forte, Cervezil, Aperifast, Picoteum, Afterwork XR, Neuronic Forte.**

**Un tiempo de camaradería y de compartir nunca viene mal.**

Pero si, por el contrario, tu respuesta es sí:

Avisa en casa, organiza tus tiempos, prepara el outfit, invita al/la toxic@, asalta la hucha, no olvides la tarjeta...

**Y ya nos organizamos con Manuel.**
`
    }
};


// ------------------------------------------------------------
// INICIO
// ------------------------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    iniciarAplicacion
);


async function iniciarAplicacion() {

    await actualizarAplicacion();

    setInterval(
        actualizarAplicacion,
        60000
    );
}


// ------------------------------------------------------------
// ACTUALIZAR APLICACIÓN
// ------------------------------------------------------------

async function actualizarAplicacion() {

    try {

        const {
            data: horario,
            error: errorHorario
        } = await supabaseClient.rpc(
            "esta_en_horario_de_votacion"
        );


        if (errorHorario) {
            throw errorHorario;
        }


        const {
            data: encuestas,
            error: errorEncuesta
        } = await supabaseClient.rpc(
            "obtener_encuesta_activa"
        );


        if (errorEncuesta) {
            throw errorEncuesta;
        }


        if (
            !encuestas ||
            encuestas.length === 0
        ) {

            mostrarFinDeSemana();

            return;
        }


        encuestaActual =
            encuestas[0];


        console.log(
            "Encuesta actual:",
            encuestaActual
        );


        pollDate.textContent =
            formatearFecha(
                encuestaActual.fecha
            );


        const dia =
            obtenerDiaSemana(
                encuestaActual.fecha
            );


        if (horario === true) {

            await mostrarVotacion();

        } else {

            await mostrarResultadosFinales(
                dia
            );
        }


    } catch (error) {

        console.error(
            "Error actualizando la aplicación:",
            error
        );

        mostrarErrorGeneral();
    }
}


// ------------------------------------------------------------
// MOSTRAR VOTACIÓN
// ------------------------------------------------------------

async function mostrarVotacion() {

    resultsSection.classList.add(
        "hidden"
    );


    pollForm.style.display =
        "block";


    pollTitle.innerHTML =
        `
        ¿Qué color pinta hoy?<br>
        <span>
            Elige un color y fingimos que tenemos un plan.
        </span>
        `;


    const {
        data,
        error
    } = await supabaseClient.rpc(
        "obtener_opciones_activas"
    );


    if (error) {
        throw error;
    }


    if (
        !data ||
        data.length === 0
    ) {

        optionsContainer.innerHTML =
            `
            <p class="loading">
                No hay opciones disponibles para hoy.
            </p>
            `;

        voteButton.disabled =
            true;

        return;
    }


    optionsContainer.innerHTML =
        "";


    data.forEach(
        opcion => {

            const optionId =
                `color-${opcion.id}`;


            const nombre =
                String(
                    opcion.nombre || ""
                );


            const clave =
                normalizarColor(
                    nombre
                );


            const emoji =
                emojis[clave] || "🎨";


            const color =
                opcion.color_hex ||
                "#eeeeee";


            optionsContainer.insertAdjacentHTML(
                "beforeend",
                `
                <div
                    class="color-option"
                    style="--option-color: ${escapeAttribute(color)};"
                >

                    <input
                        type="radio"
                        id="${optionId}"
                        name="opcion"
                        value="${opcion.id}"
                        required
                    >

                    <label
                        for="${optionId}"
                        style="background-color: ${escapeAttribute(color)};"
                    >

                        <span class="color-name">
                            ${escapeHTML(nombre)}
                        </span>

                        <span
                            class="color-emoji"
                            aria-hidden="true"
                        >
                            ${emoji}
                        </span>

                    </label>

                </div>
                `
            );
        }
    );


    personaInput.disabled =
        false;


    voteButton.disabled =
        false;


    voteButton.textContent =
        "Votar";


    await cargarParticipantes();
}


// ------------------------------------------------------------
// REGISTRAR VOTO
// ------------------------------------------------------------

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


    const {
        data: horario,
        error: errorHorario
    } = await supabaseClient.rpc(
        "esta_en_horario_de_votacion"
    );


    if (errorHorario) {

        console.error(
            errorHorario
        );

        mostrarMensaje(
            "No se ha podido comprobar el horario de votación.",
            "error"
        );

        return;
    }


    if (horario !== true) {

        mostrarMensaje(
            "La votación ya está cerrada.",
            "error"
        );

        await actualizarAplicacion();

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
            "El nombre debe tener al menos 2 caracteres.",
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


    const encuestaIdRaw =
        encuestaActual?.id ??
        encuestaActual?.encuesta_id ??
        encuestaActual?.encuestaId;


    const encuestaId =
        Number(
            encuestaIdRaw
        );


    console.log(
        "ID de encuesta utilizado:",
        encuestaId
    );


    console.log(
        "Encuesta completa:",
        encuestaActual
    );


    if (
        !Number.isInteger(
            encuestaId
        )
    ) {

        console.error(
            "No se ha encontrado un ID válido de encuesta.",
            encuestaActual
        );


        mostrarMensaje(
            "No se ha podido identificar la encuesta actual.",
            "error"
        );

        return;
    }


    if (
        !Number.isInteger(
            opcionId
        )
    ) {

        mostrarMensaje(
            "La opción seleccionada no es válida.",
            "error"
        );

        return;
    }


    voteButton.disabled =
        true;


    voteButton.textContent =
        "Registrando voto...";


    try {

        const {
            data,
            error
        } = await supabaseClient.rpc(
            "registrar_voto_app",
            {
                p_encuesta_id:
                    encuestaId,

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
            "¡Voto registrado!\nYa formas parte de esta magnífica pérdida de tiempo.",
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


        await cargarParticipantes();


    } catch (error) {

        console.error(
            "Error registrando el voto:",
            error
        );


        mostrarMensaje(
            obtenerMensajeError(
                error
            ),
            "error"
        );


        voteButton.disabled =
            false;


        voteButton.textContent =
            "Votar";
    }
}


// ------------------------------------------------------------
// RESULTADOS FINALES
// ------------------------------------------------------------

async function mostrarResultadosFinales(
    dia
) {

    pollForm.style.display =
        "none";


    const {
        data: resultados,
        error: errorResultados
    } = await supabaseClient.rpc(
        "obtener_resultados"
    );


    if (errorResultados) {
        throw errorResultados;
    }


    mostrarGanador(
        resultados || [],
        dia
    );


    await cargarParticipantes();
}


// ------------------------------------------------------------
// MOSTRAR GANADOR
// ------------------------------------------------------------

function mostrarGanador(
    resultados,
    dia
) {

    resultsSection.classList.remove(
        "hidden"
    );


    /*
     * Comprobamos el TOTAL de votos.
     * Si todos tienen 0 votos, no existe ganador.
     */
    const totalVotos =
        (resultados || []).reduce(
            (total, resultado) => {

                return total +
                    (Number(resultado.votos) || 0);

            },
            0
        );


    if (
        !resultados ||
        resultados.length === 0 ||
        totalVotos === 0
    ) {

        const mensajeDia =
            mensajesDelDia[dia];


        const titulo =
            mensajeDia?.titulo ||
            "RESULTADOS DEL DÍA";


        resultsContainer.innerHTML =
            `
            <article class="winner-card">

                <p
                    class="winner-day-title"
                    style="
                        display: block;
                        box-sizing: border-box;
                        width: 100%;
                        margin: 0;
                        padding: 14px 18px 16px;
                        font-size: 1.15rem;
                        line-height: 1.3;
                        letter-spacing: 0.12em;
                        text-align: left;
                        overflow: visible;
                    "
                >
                    ${escapeHTML(titulo)}
                </p>

                <div
                    style="
                        padding: 30px 24px;
                        text-align: center;
                    "
                >
                    <h3
                        style="
                            margin: 0 0 14px;
                            font-size: 1.8rem;
                            line-height: 1.2;
                        "
                    >
                        Todavía no hay ganador
                    </h3>

                    <p
                        style="
                            margin: 0;
                            font-size: 1rem;
                            line-height: 1.6;
                        "
                    >
                        Todavía no ha votado nadie.
                        La democracia decidió no presentarse.
                    </p>
                </div>

            </article>
            `;

        return;
    }


    /*
     * Ordenar por número de votos.
     */
    const resultadosOrdenados =
        [...resultados].sort(
            (a, b) => {

                const votosA =
                    Number(
                        a.votos
                    ) || 0;

                const votosB =
                    Number(
                        b.votos
                    ) || 0;

                return votosB - votosA;
            }
        );


    const ganador =
        resultadosOrdenados[0];


    const nombre =
        String(
            ganador.nombre || ""
        );


    const clave =
        normalizarColor(
            nombre
        );


    const emoji =
        emojis[clave] || "🎨";


    const color =
        ganador.color_hex ||
        "#eeeeee";


    const votos =
        Number(
            ganador.votos
        ) || 0;


    const mensajeDia =
        mensajesDelDia[dia];


    let titulo =
        mensajeDia?.titulo ||
        "RESULTADOS DEL DÍA";


    let texto =
        mensajeDia?.texto ||
        "Este es el resultado del día.";


    texto =
        texto
            .replaceAll(
                "[COLOR GANADOR]",
                escapeHTML(nombre)
            )
            .replaceAll(
                "[EMOJI]",
                emoji
            );


    texto =
        convertirMarkdownBasico(
            texto
        );


    texto =
        texto.replace(
            /\n/g,
            "<br>"
        );


    resultsContainer.innerHTML =
        `
        <article
            class="winner-card"
            style="--winner-color: ${escapeAttribute(color)};"
        >

            <p
                class="winner-day-title"
                style="
                    display: block;
                    box-sizing: border-box;
                    width: 100%;
                    margin: 0;
                    padding: 14px 18px 16px;
                    font-size: 1.15rem;
                    line-height: 1.3;
                    letter-spacing: 0.12em;
                    text-align: left;
                    overflow: visible;
                "
            >
                ${escapeHTML(titulo)}
            </p>


            <div
                class="winner-color"
                style="
                    background-color: ${escapeAttribute(color)};
                    height: 135px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                "
                aria-label="Color ganador: ${escapeAttribute(nombre)}"
            >
            </div>


            <h3
                class="winner-name"
                style="
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    margin: 16px 14px 8px;
                    font-size: 2rem;
                    line-height: 1.2;
                "
            >
                <span>
                    ${escapeHTML(nombre)}
                </span>

                <span
                    class="winner-emoji"
                    style="
                        font-size: 2.2rem;
                        line-height: 1;
                    "
                    aria-hidden="true"
                >
                    ${emoji}
                </span>
            </h3>


            <p class="winner-votes">
                ${votos}
                ${votos === 1 ? "voto" : "votos"}
            </p>


            <div class="winner-message">
                ${texto}
            </div>

        </article>
        `;
}


// ------------------------------------------------------------
// PARTICIPANTES
// ------------------------------------------------------------

async function cargarParticipantes() {

    try {

        const {
            data,
            error
        } = await supabaseClient.rpc(
            "obtener_participantes"
        );


        if (error) {
            throw error;
        }


        mostrarParticipantes(
            data || []
        );


    } catch (error) {

        console.error(
            "Error cargando participantes:",
            error
        );
    }
}


function mostrarParticipantes(
    participantes
) {

    const nombres =
        [
            ...new Set(
                participantes
                    .map(
                        participante =>
                            participante.persona
                    )
                    .filter(Boolean)
            )
        ];


    let contenedor =
        document.getElementById(
            "participants-container"
        );


    if (!contenedor) {

        contenedor =
            document.createElement(
                "div"
            );


        contenedor.id =
            "participants-container";


        if (
            pollForm.style.display !==
            "none"
        ) {

            pollForm.insertAdjacentElement(
                "afterend",
                contenedor
            );

        } else {

            resultsContainer.insertAdjacentElement(
                "afterend",
                contenedor
            );
        }
    }


    if (
        nombres.length === 0
    ) {

        contenedor.innerHTML =
            `
            <div class="participants-card">

                <p class="eyebrow">
                    PARTICIPANTES
                </p>

                <p>
                    Todavía no ha votado nadie.
                </p>

            </div>
            `;

        return;
    }


    const lista =
        nombres
            .map(
                nombre =>
                    `
                    <li>
                        ${escapeHTML(nombre)}
                    </li>
                    `
            )
            .join("");


    contenedor.innerHTML =
        `
        <div class="participants-card">

            <p class="eyebrow">
                PARTICIPANTES
            </p>

            <p class="participants-intro">
                Hoy han participado:
            </p>

            <ul class="participants-list">
                ${lista}
            </ul>

        </div>
        `;
}


// ------------------------------------------------------------
// VIERNES Y SÁBADO
// ------------------------------------------------------------

function mostrarFinDeSemana() {

    encuestaActual =
        null;


    pollDate.textContent =
        "";


    pollTitle.innerHTML =
        `
        Hoy no hay votación<br>
        <span>
            La encuesta vuelve el domingo.
        </span>
        `;


    pollForm.style.display =
        "none";


    resultsSection.classList.add(
        "hidden"
    );


    optionsContainer.innerHTML =
        "";


    limpiarMensaje();


    const participantes =
        document.getElementById(
            "participants-container"
        );


    if (participantes) {

        participantes.remove();
    }
}


// ------------------------------------------------------------
// DÍA DE LA SEMANA
// ------------------------------------------------------------

function obtenerDiaSemana(
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


    return fechaLocal.getDay();
}


// ------------------------------------------------------------
// NORMALIZAR COLOR
// ------------------------------------------------------------

function normalizarColor(
    texto
) {

    return String(
        texto || ""
    )
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim();
}


// ------------------------------------------------------------
// MARKDOWN BÁSICO
// ------------------------------------------------------------

function convertirMarkdownBasico(
    texto
) {

    return texto.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );
}


// ------------------------------------------------------------
// MENSAJES
// ------------------------------------------------------------

function mostrarMensaje(
    texto,
    tipo = ""
) {

    message.innerHTML =
        escapeHTML(
            texto
        ).replace(
            /\n/g,
            "<br>"
        );


    message.className =
        `message ${tipo}`;
}


function limpiarMensaje() {

    message.textContent =
        "";


    message.className =
        "message";
}


// ------------------------------------------------------------
// ERROR GENERAL
// ------------------------------------------------------------

function mostrarErrorGeneral() {

    mostrarMensaje(
        "No se ha podido cargar la encuesta. Recarga la página.",
        "error"
    );
}


// ------------------------------------------------------------
// FORMATEAR FECHA
// ------------------------------------------------------------

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


// ------------------------------------------------------------
// SEGURIDAD HTML
// ------------------------------------------------------------

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


function escapeAttribute(
    texto
) {

    return String(
        texto
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        );
}


// ------------------------------------------------------------
// MENSAJES DE ERROR
// ------------------------------------------------------------

function obtenerMensajeError(
    error
) {

    const mensajeError =
        error?.message || "";


    if (
        mensajeError.includes(
            "La votación está cerrada"
        )
    ) {

        return (
            "La votación está cerrada."
        );
    }


    if (
        mensajeError.includes(
            "El nombre debe tener al menos 2 caracteres"
        )
    ) {

        return (
            "El nombre debe tener al menos 2 caracteres."
        );
    }


    if (
        mensajeError.includes(
            "El nombre no puede superar los 60 caracteres"
        )
    ) {

        return (
            "El nombre no puede superar los 60 caracteres."
        );
    }


    if (
        mensajeError.includes(
            "La encuesta no está activa"
        )
    ) {

        return (
            "La encuesta ya no está activa."
        );
    }


    if (
        mensajeError.includes(
            "La opción seleccionada no pertenece"
        )
    ) {

        return (
            "La opción seleccionada no es válida."
        );
    }


    if (
        error?.code === "PGRST202"
    ) {

        return (
            "No se ha podido conectar con la función de votación."
        );
    }


    return (
        "No se ha podido registrar el voto."
    );
}