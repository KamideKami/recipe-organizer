const API_KEY = "AIzaSyD7435-Lt1KfYFS-bWOTcshlbD4qX_hVTw";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

function sendMessage() {
  const inputField = document.getElementById("userInput");
  const chatbox = document.getElementById("chatbox");
  const userMessage = inputField.value;

  if (!userMessage.trim()) return;

  chatbox.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
  inputField.value = "";

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: userMessage }],
        },
      ],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const botResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand that.";
      chatbox.innerHTML += `<p><strong>Bot:</strong> ${botResponse}</p>`;
      chatbox.scrollTop = chatbox.scrollHeight;
    })
    .catch((error) => {
      chatbox.innerHTML += `<p><strong>Bot:</strong> Error: Unable to fetch response.</p>`;
      console.error(error);
    });
}

function toggleChatbot() {
  const chatbot = document.getElementById("chatbot-container");
  const display = chatbot.style.display === "none" ? "flex" : "none";
  chatbot.style.display = display;
}