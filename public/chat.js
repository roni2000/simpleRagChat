import { marked } from "https://esm.sh/marked";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.2/dist/purify.min.js";

document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const chatCircle = document.getElementById('chat-circle');
    const messagesContainer = document.getElementById('chat-messages');
    const inputField = document.getElementById('chat-input');
    const closeBtn = document.getElementById('close-btn');
    const sendBtn = document.getElementById('send-btn');

    function generateSessionId(len = 48) {
        try {
            if (window.crypto && window.crypto.getRandomValues) {
                const arr = new Uint8Array(len / 2);
                window.crypto.getRandomValues(arr);
                return Array.from(arr, b => ('0' + b.toString(16)).slice(-2)).join('');
            }
        } catch {}
        let result = '';
        for (let i = 0; i < len; i++) {
            result += Math.floor(Math.random() * 16).toString(16);
        }
        return result;
    }
    const sessionId = generateSessionId();

    function toggleChat() {
        if (chatWindow.style.display === 'none' || chatWindow.style.display === '') {
            chatWindow.style.display = 'flex';
            chatCircle.style.display = 'none';
        } else {
            chatWindow.style.display = 'none';
            chatCircle.style.display = 'flex';
        }
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') sendMessage();
    }

    function appendMessage(text, sender) {
        const div = document.createElement('div');
        div.classList.add('message', sender === 'user' ? 'user-msg' : 'bot-msg');
        if (sender === 'bot') {
            div.innerHTML = DOMPurify.sanitize(marked(text));
        } else {
            div.textContent = text;
        }
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function sendMessage() {
        const text = inputField.value.trim();
        if (!text) return;
        appendMessage(text, 'user');
        inputField.value = '';
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'bot-msg');
        loadingDiv.textContent = '...';
        loadingDiv.id = 'loading-msg';
        messagesContainer.appendChild(loadingDiv);
        try {
            const response = await fetch('/api/chat-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: text, sessionId })
            });
            const data = await response.json();
            const loadingMsg = document.getElementById('loading-msg');
            if(loadingMsg) loadingMsg.remove();
            let botReply = '';
            if (data && data.output) {
                botReply = data.output;
            } else {
                botReply = JSON.stringify(data);
            }
            appendMessage(botReply, 'bot');
        } catch (error) {
            const loadingMsg = document.getElementById('loading-msg');
            if(loadingMsg) loadingMsg.remove();
            appendMessage("Error communicating with server.", 'bot');
        }
    }

    chatCircle.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
    inputField.addEventListener('keypress', handleKeyPress);
    sendBtn.addEventListener('click', sendMessage);
});
