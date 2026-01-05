// 1. CONFIGURACIÓN ÚNICA DE FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyCyRC9VLrqKRl7COXGfl00sO8tXv7bIqPs",
    authDomain: "radio--tapebicua.firebaseapp.com",
    databaseURL: "https://radio--tapebicua-default-rtdb.firebaseio.com",
    projectId: "radio--tapebicua",
    storageBucket: "radio--tapebicua.firebasestorage.app",
    messagingSenderId: "32539889426",
    appId: "1:32539889426:web:81a229c34e968d78756dcb",
    measurementId: "G-QTWMCGS97N"
};

// 2. INICIALIZAR FIREBASE (Modo Compat)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();
const messagesRef = database.ref("messages");

// 3. ELEMENTOS DEL DOM
const radioPlayer = document.getElementById("radioPlayer");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendButton = document.getElementById("sendButton");

// 4. LÓGICA DE AUDIO (DETI FM) - AJUSTE DE ESTABILIDAD
radioPlayer.addEventListener("play", () => {
    console.log("Radio Tapebicua: Iniciando transmisión...");
    // Eliminamos el .load() recursivo que causaba el bloqueo gris
});

radioPlayer.addEventListener("error", () => {
    console.error("Error de señal. Reintentando en 5 segundos...");
    setTimeout(() => {
        radioPlayer.load();
        radioPlayer.play().catch(() => console.log("Esperando interacción..."));
    }, 5000);
});

// 5. LÓGICA DEL CHAT (PERMANENTE)
const username = "Oyente_" + Math.floor(Math.random() * 999);

function sendMessage() {
    const text = chatInput.value.trim();
    if (text === "") return;

    messagesRef.push({
        username: username,
        text: text,
        timestamp: Date.now()
    });

    chatInput.value = "";
    chatInput.focus();
}

sendButton.onclick = sendMessage;
chatInput.onkeypress = (e) => { if (e.key === "Enter") sendMessage(); };

// 6. MOSTRAR MENSAJES EN TIEMPO REAL
// Usamos .off() antes de .on() para evitar mensajes duplicados al recargar el JS
messagesRef.limitToLast(50).off(); 
messagesRef.limitToLast(50).on("child_added", (snapshot) => {
    const data = snapshot.val();
    const msgDiv = document.createElement("div");
    msgDiv.className = "message";
    
    const time = new Date(data.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    msgDiv.innerHTML = `
        <div style="margin-bottom: 10px; border-left: 3px solid #4fc3f7; padding-left: 8px;">
            <div class="message-user" style="color:#4fc3f7; font-weight:bold; font-size: 0.9em;">
                ${data.username} <span style="font-size:0.75em; color:gray; font-weight: normal;">${time}</span>
            </div>
            <div class="message-text" style="color:white; word-wrap: break-word;">${data.text}</div>
        </div>
    `;
    
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});