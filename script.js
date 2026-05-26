// 1. Configuración de conexión (CAMBIA LA IP)
const gateway = `ws:// 172.22.131.33:81/`; // La IP que te dio el monitor serie
let socket;

// Tu objeto ESTADOS se queda exactamente igual
const ESTADOS = {
    perfecto: {
        nombre: "¡Feliz y radiante! 😊",
        badge: "Óptimo",
        img: "optimo.png",
        consejo: "Todo está perfecto. Tu planta está creciendo de maravilla.",
        icon: "🌱",
        scene: "linear-gradient(160deg, #166534 0%, #15803d 100%)"
    },
    calor: {
        nombre: "¡Hace mucho calor! 🥵",
        badge: "Calor Crítico",
        img: "altatemperatura.png",
        consejo: "Necesito ventilación o un lugar más fresco pronto.",
        icon: "🔥",
        scene: "linear-gradient(160deg, #b45309 0%, #78350f 100%)"
    },
    frio: {
        nombre: "¡Me estoy congelando! 🥶",
        badge: "Frío Extremo",
        img: "muyfrio.png",
        consejo: "Hace demasiado frío. ¿Podrías subir la temperatura?",
        icon: "❄️",
        scene: "linear-gradient(160deg, #1d4ed8 0%, #1e3a5f 100%)"
    },
    seco: {
        nombre: "¡Tengo mucha sed! 😩",
        badge: "Humedad Baja",
        img: "faltadeagua.png",
        consejo: "La humedad es muy baja. Un poco de agua me vendría bien.",
        icon: "🏜️",
        scene: "linear-gradient(160deg, #a16207 0%, #451a03 100%)"
    }
};

// 2. Función principal de actualización (MODIFICADA PARA ACEPTAR DATOS REALES)
function actualizarSistema(tempReal, humReal) {
    // Si llegan datos del sensor (tempReal/humReal), los usamos. 
    // Si no, leemos los sliders (para que el simulador siga funcionando).
    const temp = tempReal !== undefined ? tempReal : parseInt(document.getElementById("tempSlider").value);
    const hum = humReal !== undefined ? humReal : parseInt(document.getElementById("humSlider").value);

    // Si los datos vienen del sensor, movemos los sliders automáticamente para que coincidan
    if (tempReal !== undefined) document.getElementById("tempSlider").value = temp;
    if (humReal !== undefined) document.getElementById("humSlider").value = hum;

    // Actualizar etiquetas de texto
    document.getElementById("tempVal").innerText = `${temp}°C`;
    document.getElementById("humVal").innerText = `${hum}%`;
    document.getElementById("tempSliderVal").innerText = `${temp}°C`;
    document.getElementById("humSliderVal").innerText = `${hum}%`;

    // Lógica de las barras de progreso
    const tBar = document.getElementById("tempBar");
    tBar.style.width = ((temp - 5) / 40 * 100) + "%";
    tBar.style.background = temp > 32 ? "#f87171" : temp < 15 ? "#60a5fa" : "#34d399";

    const hBar = document.getElementById("humBar");
    hBar.style.width = hum + "%";
    hBar.style.background = hum < 30 ? "#fbbf24" : "#34d399";

    // Determinar el estado actual
    let estadoActual = "perfecto";
    if (temp > 32) estadoActual = "calor";
    else if (temp < 12) estadoActual = "frio";
    else if (hum < 30) estadoActual = "seco";

    const info = ESTADOS[estadoActual];

    // Aplicar cambios visuales
    document.getElementById("sceneBg").style.background = info.scene;
    document.getElementById("moodText").innerText = info.nombre;
    document.getElementById("consejoText").innerText = info.consejo;
    document.getElementById("consejoIcon").innerText = info.icon;
    
    // Cambiar imagen
    const imgElement = document.getElementById("plantImage");
    imgElement.src = info.img;

    // Activar/Desactivar temblor
    if (estadoActual === "frio") {
        imgElement.classList.add("temblor");
    } else {
        imgElement.classList.remove("temblor");
    }
}

// 3. Lógica del WebSocket (NUEVA)
function initWebSocket() {
    console.log('Iniciando conexión con ESP32...');
    socket = new WebSocket(gateway);

    socket.onmessage = function(event) {
        // El ESP32 envía: {"temp": 24, "hum": 65}
        const data = JSON.parse(event.data);
        // Llamamos a tu función con los datos que llegaron por WiFi
        actualizarSistema(data.temp, data.hum);
    };

    socket.onclose = function() {
        console.log('Conexión perdida. Reintentando en 2 segundos...');
        setTimeout(initWebSocket, 2000);
    };
}

// 5. Inicio
window.onload = () => {
    actualizarSistema(); // Carga inicial
    initWebSocket();     // Conectar con el sensor real
};
const ESTADOS = {
  perfecto: {
    // ... otros datos
    video: "optimo.mp4", 
  },
  calor: {
    // ...
    video: "altatemperatura.mp4",
  },
  // ... repite para todos los estados cambiando 'img' por 'video'
};
function toggleItem(emoji) {
  const container = document.getElementById("itemsEnPantalla");
  
  // Buscar si el ítem ya existe en pantalla para removerlo (efecto toggle)
  const existingItems = Array.from(container.children);
  const found = existingItems.find(item => item.innerText === emoji);
  
  if (found) {
    container.removeChild(found);
  } else {
    // Si no existe, lo creamos y añadimos al contenedor
    const div = document.createElement("div");
    div.className = "active-item";
    div.innerText = emoji;
    container.appendChild(div);
  }
}