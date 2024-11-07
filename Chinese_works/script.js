let chatHistory = [
  {
    role: "user",
    type: "query",
    content: "你好",
    content_type: "text",
  },
  {
    role: "assistant",
    type: "answer",
    content: "你好！请问您是小朋友，老师，还是军人？",
    content_type: "text",
  },
];

function showContactUs() {
  document.getElementById("contact-us").classList.remove("hidden");
  document.getElementById("chat").classList.add("hidden");
}

function showChat() {
  document.getElementById("contact-us").classList.add("hidden");
  document.getElementById("chat").classList.remove("hidden");
}

function sendMessage() {
  var input = document.getElementById("chat-input");
  var message = input.value;
  if (message.trim() !== "") {
    displayMessage(message, "user-message");
    input.value = "";

    // 添加用户消息到上下文历史记录中
    chatHistory.push({
      role: "user",
      type: "query",
      content: message,
      content_type: "text",
    });

    fetch("https://api.coze.cn/open_api/v2/chat", {
      method: "POST",
      headers: {
        Authorization:
          "Bearer pat_EaLxSIAsYkytJAMuYNmt7H1s18mNPjDAgmmRn9dTGF415hfpzTCdt0trfZbHMQec",
        "Content-Type": "application/json",
        Accept: "*/*",
        Host: "api.coze.cn",
        Connection: "keep-alive",
      },
      body: JSON.stringify({
        conversation_id: "123",
        bot_id: "7375081567242534953",
        user: "29032201862555",
        query: message,
        stream: false,
        chat_history: chatHistory,
      }),
    })
      .then((response) => {
        console.log("Response status:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Received data:", data);
        if (data && Array.isArray(data.messages)) {
          let item = data.messages.find((msg) => msg.type === "answer");
          if (item) {
            // 添加机器人的回复到上下文历史记录中
            chatHistory.push({
              role: item.role,
              type: item.type,
              content: item.content,
              content_type: item.content_type,
            });
            displayMessage(item.content, "bot-message");
          } else {
            console.error("No message with type 'answer' found.");
          }
        } else {
          console.error("Expected 'data.messages' to be an array.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function displayMessage(message, className) {
  var chatOutput = document.getElementById("chat-output");
  var messageDiv = document.createElement("div");

  messageDiv.innerHTML = marked.parse(message);//不会

  messageDiv.classList.add("message", className);
  chatOutput.appendChild(messageDiv);
  chatOutput.scrollTop = chatOutput.scrollHeight;
}

function checkEnter(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}
