import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

// Create a function to show a loading indicator
function showLoadingIndicator(element) {
  element.textContent = '';
  
  loadInterval = setInterval(() => {
    element.textContent += '.';
    if (element.textContent.length === 4) {
      element.textContent = '';
    }
  }, 300);
}

// Create a function to type out text
function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

// Create a function to generate a unique ID for each bot message
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

// Create a function to generate a chat stripe HTML
function createChatStripe(isAi, value, uniqueId) {
  return `
    <div class="wrapper ${isAi ? 'ai' : ''}">
      <div class="chat">
        <div class="profile">
          <img src=${isAi ? bot : user} alt="${isAi ? 'bot' : 'user'}" />
        </div>
        <div class="message" id="${uniqueId}">${value}</div>
      </div>
    </div>
  `;
}

// Handle form submit
const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // Add the user's chat stripe to the chat container
  chatContainer.innerHTML += createChatStripe(false, data.get('prompt'));

  // Reset the form
  form.reset();

  // Generate a unique ID for the bot message
  const uniqueId = generateUniqueId();

  // Add the bot's chat stripe to the chat container
  chatContainer.innerHTML += createChatStripe(true, ' ', uniqueId);

  // Scroll to the bottom of the chat container
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Get the message div for the bot message
  const messageDiv = document.getElementById(uniqueId);

  // Show the loading indicator
  showLoadingIndicator(messageDiv);

  // Fetch the bot's response from the server
  const response = await fetch('https://elots.onrender.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: data.get('prompt'),
    }),
  });

  // Clear the loading indicator
  clearInterval(loadInterval);
  messageDiv.innerHTML = "";

if(response.ok) {
const data = await response.json();
const parsedData = data.bot.trim();

// Display the response from the server
typeText(messageDiv, parsedData);
} else {
// Display an error message
const error = await response.text();
messageDiv.innerHTML = "Something went wrong";
alert(error);
}
};

form.addEventListener("submit", handleSubmit);

form.addEventListener("keyup", (e) => {
if(e.key === 13) {
handleSubmit(e);
}
});





