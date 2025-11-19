const questions = [
    "Q1: I often find it difficult to understand what others mean when they say things like 'it's cool' or 'that's sick'. (0 = No, 1 = Yes)",
    "Q2: I prefer to do things the same way every time. (0 = No, 1 = Yes)",
    "Q3: I find it hard to work out what someone is thinking or feeling just by looking at their face. (0 = No, 1 = Yes)",
    "Q4: I frequently get so strongly absorbed in one thing that I lose sight of other things. (0 = No, 1 = Yes)",
    "Q5: I often notice small sounds that other people do not. (0 = No, 1 = Yes)",
    "Q6: I usually focus on the whole picture rather than small details. (0 = No, 1 = Yes)",
    "Q7: I find it hard to switch my focus from one task to another. (0 = No, 1 = Yes)",
    "Q8: I prefer to do things on my own rather than in a group. (0 = No, 1 = Yes)",
    "Q9: I find social situations confusing. (0 = No, 1 = Yes)",
    "Q10: I find it difficult to make new friends. (0 = No, 1 = Yes)"
];


let currentQuestion = 0;
let answers = {};

window.onload = () => {
    typeBot("👋 Hello! I will ask you 10 screening questions.");
    setTimeout(() => typeBot(questions[currentQuestion]), 1200);
};

function typeBot(text) {
    let box = document.getElementById("chat-box");
    let bubble = document.createElement("div");
    bubble.className = "message bot";
    box.appendChild(bubble);

    let i = 0;
    let interval = setInterval(() => {
        bubble.innerHTML = text.substring(0, i++);
        box.scrollTop = box.scrollHeight;
        if (i > text.length) clearInterval(interval);
    }, 20);
}

function userMessage(text) {
    let box = document.getElementById("chat-box");
    box.innerHTML += `<div class='message user'>${text}</div>`;
    box.scrollTop = box.scrollHeight;
}

async function sendMessage() {
    let input = document.getElementById("user-input");
    let text = input.value.trim();
    if (!text) return;

    userMessage(text);

    if (text !== "0" && text !== "1") {
        typeBot("❗ Please enter only 0 or 1.");
        input.value = "";
        return;
    }

    let key = "A" + (currentQuestion + 1);
    answers[key] = Number(text);

    input.value = "";
    currentQuestion++;

    if (currentQuestion === questions.length) {
        typeBot("Processing your answers...");
        await sendToBackend();
        return;
    }

    typeBot(questions[currentQuestion]);
}

async function sendToBackend() {
    try {
        let res = await fetch("https://autism-backend-d8c1.onrender.com/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(answers),
        });

        let result = await res.json();

        let msg = (result.prediction === "1")
            ? `🧠 AI Result: High likelihood of autism traits.<br><br📊 Model Accuracy: ${(result.accuracy * 100).toFixed(2)}%`
            : `🧠 AI Result: Low likelihood of autism traits.<br><br📊 Model Accuracy: ${(result.accuracy * 100).toFixed(2)}%`;

        typeBot(msg);

    } catch (err) {
        typeBot("⚠️ Error connecting to the server.");
    }
}
