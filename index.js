const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// 1. THE FRONTEND (HTML/CSS/JS)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome</title>
        <style>
            /* --- Main Page Styles --- */
            body {
                background-color: lightblue;
                margin: 0;
                padding: 0;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: Arial, sans-serif;
            }
            h1 {
                color: darkblue;
                font-size: 5rem;
            }

            /* --- Chat Widget Styles --- */
            #chat-circle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: darkblue;
                color: white;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                font-size: 30px;
                box-shadow: 0px 4px 10px rgba(0,0,0,0.3);
                z-index: 1000;
                transition: transform 0.3s;
            }
            #chat-circle:hover {
                transform: scale(1.1);
            }

            #chat-window {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 10px;
                box-shadow: 0px 4px 20px rgba(0,0,0,0.2);
                display: none; /* Hidden by default */
                flex-direction: column;
                z-index: 1000;
                overflow: hidden;
            }

            #chat-header {
                background: darkblue;
                color: white;
                padding: 15px;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            #chat-messages {
                flex: 1;
                padding: 15px;
                overflow-y: auto;
                background: #f1f1f1;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .message {
                padding: 10px 15px;
                border-radius: 15px;
                max-width: 80%;
                word-wrap: break-word;
                font-size: 14px;
                line-height: 1.4;
                
                /* IMPORTANT: This preserves the \\n newlines from your API response */
                white-space: pre-wrap; 
            }

            .user-msg {
                background: darkblue;
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 2px;
            }

            .bot-msg {
                background: #e0e0e0;
                color: black;
                align-self: flex-start;
                border-bottom-left-radius: 2px;
            }

            #chat-input-area {
                padding: 10px;
                border-top: 1px solid #ccc;
                display: flex;
                background: white;
            }

            #chat-input {
                flex: 1;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                outline: none;
            }

            #send-btn {
                margin-left: 10px;
                padding: 10px 15px;
                background: darkblue;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            
            #close-btn {
                cursor: pointer;
                font-size: 18px;
            }
        </style>
    </head>
    <body>
        <h1>Welcome</h1>

        <div id="chat-circle" onclick="toggleChat()">💬</div>

        <div id="chat-window">
            <div id="chat-header">
                <span>Support Chat</span>
                <span id="close-btn" onclick="toggleChat()">✖</span>
            </div>
            <div id="chat-messages">
                <div class="message bot-msg">Hello! How can I help you today?</div>
            </div>
            <div id="chat-input-area">
                <input type="text" id="chat-input" placeholder="Type a message..." onkeypress="handleKeyPress(event)">
                <button id="send-btn" onclick="sendMessage()">Send</button>
            </div>
        </div>

        <script>
            const chatWindow = document.getElementById('chat-window');
            const chatCircle = document.getElementById('chat-circle');
            const messagesContainer = document.getElementById('chat-messages');
            const inputField = document.getElementById('chat-input');

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
                // textContent is safer, and combined with CSS white-space: pre-wrap, 
                // it handles newlines correctly.
                div.textContent = text; 
                messagesContainer.appendChild(div);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }

            async function sendMessage() {
                const text = inputField.value.trim();
                if (!text) return;

                appendMessage(text, 'user');
                inputField.value = '';
                
                // Add a temporary "Typing..." indicator (optional but nice UX)
                const loadingDiv = document.createElement('div');
                loadingDiv.classList.add('message', 'bot-msg');
                loadingDiv.textContent = '...';
                loadingDiv.id = 'loading-msg';
                messagesContainer.appendChild(loadingDiv);

                try {
                    const response = await fetch('/api/chat-proxy', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ question: text })
                    });

                    const data = await response.json();
                    
                    // Remove loading indicator
                    const loadingMsg = document.getElementById('loading-msg');
                    if(loadingMsg) loadingMsg.remove();

                    // LOGIC UPDATE: handle { output: "..." }
                    let botReply = "";
                    
                    if (data && data.output) {
                        botReply = data.output;
                    } else {
                        // Fallback if structure is different
                        botReply = JSON.stringify(data); 
                    }
                    
                    appendMessage(botReply, 'bot');

                } catch (error) {
                    const loadingMsg = document.getElementById('loading-msg');
                    if(loadingMsg) loadingMsg.remove();
                    
                    console.error('Error:', error);
                    appendMessage("Error communicating with server.", 'bot');
                }
            }
        </script>
    </body>
    </html>
  `);
});

// 2. THE BACKEND API PROXY
app.post('/api/chat-proxy', async (req, res) => {
    const userQuestion = req.body.question;
    
    const EXTERNAL_API_URL = 'http://localhost:5678/webhook/poc1api';
    const USERNAME = 'testUser1';
    const PASSWORD = 'MyPassword123';

    try {
        const authHeader = 'Basic ' + Buffer.from(USERNAME + ':' + PASSWORD).toString('base64');

        const response = await axios.post(EXTERNAL_API_URL, {
            message: userQuestion 
        }, {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        });

        // Send the whole object { output: "..." } back to the frontend
        res.send(response.data);

    } catch (error) {
        console.error("External API Error:", error.message);
        res.status(500).json({ output: 'Sorry, I am currently unavailable.' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});