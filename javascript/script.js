const accordions = document.querySelectorAll('.accordion');
const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const contactLinks = document.querySelectorAll('.contact-btn');

chatWindow.addEventListener('click',(e) => e.stopPropagation());
chatInput.addEventListener('click',(e) => e.stopPropagation());
chatInput.addEventListener('keydown',(e) => {
    if (e.key === 'Enter') e.stopPropagation();
});
sendBtn.addEventListener('click', (e) => e.stopPropagation());
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter'){
        e.preventDefault();
        sendBtn.click();
    }
})
contactLinks.forEach(link => {
    link.addEventListener('click', (e) => { 
        e.stopPropagation();
    });
});



accordions.forEach(currentAccordion => {
    currentAccordion.addEventListener('click', () => {
        accordions.forEach(accordion => {
        const body = accordion.querySelector('.accordion-body');
        const header = accordion.querySelector('.accordion-header');

        if (accordion !== currentAccordion){

        
        body.classList.remove('active');
        header.classList.remove('active')
        }
    });


    const body = currentAccordion.querySelector('.accordion-body');
    const header = currentAccordion.querySelector('.accordion-header');

    body.classList.toggle('active');
    header.classList.toggle('active');
    });
});

sendBtn.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (!message) return;
    appendMessage('user', message);
    chatInput.value = '';
    sendMessageToBot(message);
});

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// ID único persistente
function getChatId() {
    let chatId = localStorage.getItem("chat_id");
    if (!chatId) {
        chatId = crypto.randomUUID(); //gera um ID unico
        localStorage.setItem("chat_id", chatId);
    }
    return chatId;

}

async function sendMessageToBot(message) {
    const chat_id = getChatId();
    try {
        const response = await fetch("https://n8n.srv853007.hstgr.cloud/webhook/chat-bot-site", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ chat_id, message }),      // ID unico e mensagem
        });

        if (!response.ok) throw new Error('Erro HTTP: ' + response.status);

        const data = await response.json();
        console.log("Resposta do bot:", data);
        appendMessage('bot', data?.output || 'Bot respondeu, mas sem texto.');
    } catch (error) {
        appendMessage('bot', 'Erro na comunicação com o bot');
        console.error(error);
        
    }
}