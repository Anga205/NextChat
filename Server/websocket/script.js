const ws = new WebSocket('ws://localhost:9001/socketman');

ws.onopen = () => {
      console.log("Connected to the server.");
};

ws.onmessage = (event) => {
      const messagesDiv = document.getElementById('messages');
      const newMessage = document.createElement('div');
      newMessage.textContent = `Message from server: ${event.data}`;
      messagesDiv.appendChild(newMessage);
};

ws.onerror = (error) => {
      console.log(`There was an error: ${error.message}`);
};

ws.onclose = () => {
      console.log("Disconnected from server.");
};

const sendMessage = () => {
      const messageInput = document.getElementById('messageInput');
      const message = messageInput.value;

      if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
      } else {
            console.log("WebSocket connection is not open.");
      }
};

