document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userMessage = userInput.value.trim();
    if (!userMessage) {
      return;
    }

    // Add user message to chat box
    addMessage(userMessage, 'user');

    // Clear input field
    userInput.value = '';

    // Show "Thinking..." message
    const thinkingMessage = addMessage('Thinking...', 'bot');

    try {
      const response = await fetch('http://localhost:9000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userMessage }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get response from server. Status: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.result) {
        // Replace "Thinking..." with AI response
        thinkingMessage.textContent = data.result;
      } else {
        throw new Error('Sorry, no response received.');
      }
    } catch (error) {
      console.error('Error:', error);
      // Replace "Thinking..." with error message
      thinkingMessage.textContent = error.message;
    }
  });

  function addMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', `${sender}-message`);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    // Scroll to the bottom of the chat box
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageElement;
  }
});