document.addEventListener("DOMContentLoaded", function () {
    const chatbotContainer = document.getElementById("chatbot-container");
    const clostBtn = document.getElementById("close-btn");
    const sendBtn = document.getElementById("send-btn");
    const chatBotInput = document.getElementById("chatbot-input");
    const chatbotMessages = document.getElementById("chatbot-messages");
    const chatbotIcon = document.getElementById("chatbot-icon");
  
    chatbotIcon.addEventListener("click", () => {
      chatbotContainer.classList.remove("hidden");
      chatbotIcon.style.display = "none";
    });
    clostBtn.addEventListener("click", () => {
      chatbotContainer.classList.add("hidden");
      chatbotIcon.style.display = "flex";
    });
  
    sendBtn.addEventListener("click", sendMessage);
  
    chatBotInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  });
  
  function sendMessage() {
    const userMessage = document.getElementById("chatbot-input").value.trim();
    if (userMessage) {
      appendMessage("user", userMessage);
      document.getElementById("chatbot-input").value="";
      getBotResponse(userMessage);
    }
  }
  
  function appendMessage(sender, message) {
    const messageContainer = document.getElementById("chatbot-messages");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);

    // Auto insert line breaks for better readability
  const formattedMessage = message.replace(/\. /g, '.<br><br>'); 

    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
  
  async function getBotResponse(userMessage) {

    showTypingIndicator(); //  Show typing

    const API_KEY = "AIzaSyDGcHhSroqLSu-SoM0n1t4x65JEvgwK9ho";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: "Reply concisely and conversationally to: " + userMessage}],
              
            },
          ],
          generationConfig: {
            maxOutputTokens: 50  // Limit response length
          }
        }),
      });
  
      const data = await response.json();
  
      if (!data.candidates || !data.candidates.length) {
        throw new Error("No response from Gemini API");
      }
  
      const botMessage = data.candidates[0].content.parts[0].text;

      hideTypingIndicator(); // Hide typing after response

      appendMessage("bot", botMessage);
    } catch (error) {
      console.error("Error:", error);
      hideTypingIndicator(); // Hide typing even on error
      appendMessage(
        "bot",
        "Sorry, I'm having trouble responding. Please try again."
      );
    }
  }
  function showTypingIndicator() {
    const messageContainer = document.getElementById("chatbot-messages");
  
    // Prevent multiple indicators
    if (document.getElementById("typing-indicator")) return;
  
    const typingBubble = document.createElement("div");
    typingBubble.id = "typing-indicator";
    typingBubble.classList.add("message", "bot");
  
    typingBubble.innerHTML = `
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
    `;
  
    messageContainer.appendChild(typingBubble);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
  
  function hideTypingIndicator() {
    const typingBubble = document.getElementById("typing-indicator");
    if (typingBubble) typingBubble.remove();
  }
  