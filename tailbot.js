// ===============================
// TailBot v1.0
// TailMates
// ===============================

const tailbotBtn = document.getElementById("tailbot-btn");
const tailbotWindow = document.getElementById("tailbot-window");
const closeChat = document.getElementById("close-chat");

const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");

const messages = document.getElementById("tailbot-messages");

const quickButtons =
document.querySelectorAll("#quick-buttons button");


// ===============================
// Open Chat
// ===============================

tailbotBtn.addEventListener("click",()=>{

    if(tailbotWindow.style.display==="flex"){

        tailbotWindow.style.display="none";

        resetChat();

    }

    else{

        tailbotWindow.style.display="flex";

        userInput.focus();

    }

});


// ===============================
// Close Chat
// ===============================

closeChat.addEventListener("click", () => {

    tailbotWindow.style.display = "none";

    resetChat();

});


// ===============================
// Welcome Message
// ===============================

const welcomeMessage = `

<div class="bot-message">

<strong>Hello!</strong>

<br><br>

I'm <strong>TailBot</strong>, an assistant for you.

<br><br>

Welcome to TailMates

<br><br>

You can ask me about:

</div>

`;


// ===============================
// Reset Chat
// ===============================

function resetChat(){

    messages.innerHTML = welcomeMessage;

    userInput.value = "";

}


// Run once when page loads

resetChat();


// ===============================
// Add Message
// ===============================

function addMessage(type,text){

    const bubble = document.createElement("div");

    bubble.className =

        type === "user"

        ? "user-message"

        : "bot-message";

    bubble.innerHTML = text;

    messages.appendChild(bubble);

    scrollChat();

}


// ===============================
// Scroll Down
// ===============================

function scrollChat(){

    messages.scrollTop = messages.scrollHeight;

}


// ===============================
// Typing Animation
// ===============================

function botTyping(callback){

    const typing = document.createElement("div");

    typing.className = "bot-message";

    typing.id = "typing";

    typing.innerHTML =

    "TailBot is typing";

    messages.appendChild(typing);

    scrollChat();

    let dots = 0;

    const animation = setInterval(()=>{

        dots++;

        typing.innerHTML =

        "TailBot is typing" +

        ".".repeat(dots % 4);

    },300);

    setTimeout(()=>{

        clearInterval(animation);

        typing.remove();

        callback();

    },900);

}
// ===============================
// Quick Button Clicks
// ===============================

quickButtons.forEach(button => {

    button.addEventListener("click", () => {

        const question = button.dataset.question;

        addMessage("user", question);

        botTyping(() => {

            addMessage("bot", getReply(question));

        });

    });

});

// ===============================
// Bot Replies
// ===============================

function getReply(question){

    switch(question){

        case "How do I adopt a pet?":

            return `
<b>Pet Adoption</b><br><br>

1. Click on the <b>Adopt</b> page from the navigation bar.<br>
2. Browse the available pets.<br>
3. Choose a pet you love.<br>
4. Fill in the adoption request form.<br>
5. Wait for approval from our team.
`;

        case "How do I register my pet?":

            return `
<b>Register a Pet</b><br><br>

Go to the <b>Register</b> page and fill in:

• Pet Name<br>
• Age<br>
• Breed<br>
• Description<br>
• Photo<br>
• Location

After verification, your pet will appear for adoption.
`;

        case "What services do you provide?":

            return `
<b>TailMates Services</b><br><br>

• Pet Adoption<br>
• Register Stray Pets<br>
• Adoption Support<br>
• Pet Care Resources<br>
• Community Assistance
`;

        case "Where can I buy pet food?":

            return `
<b>Pet Shop</b><br><br>

Our shop offers:<br>
• Pet Food<br>
• Toys<br>
• Beds<br>
• Bowls<br>
• Accessories
`;

        case "What is TailMates?":

            return `
<b>About TailMates</b><br><br>

TailMates is a community-driven platform dedicated to rescuing, registering, and rehoming pets while connecting them with loving families.
`;

        default:

            return "I'm still learning!";
    }

}
