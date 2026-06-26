// Text library for each level
const texts = {
    easy: [
        "cats like milk and dogs love bones every child likes to play outside",
        "the sun rises every morning and birds sing in the trees happily",
        "reading books helps people learn new things every single day",
        "water is important for life and everyone should drink enough",
        "students study hard to achieve success in school and life"
    ],

    medium: [
        "Learning to code requires patience, practice, and dedication every day.",
        "Technology changes rapidly, so developers must continuously improve their skills.",
        "Typing accurately is just as important as typing quickly in professional environments.",
        "Regular exercise improves both physical health and mental well being significantly.",
        "Time management helps students complete tasks efficiently and reduce stress."
    ],

    hard: [
        "JavaScript ES6 introduced features such as arrow functions, template literals, and destructuring.",
        "In 2025, web applications must support responsive design, accessibility, and performance optimization.",
        "Developers often debug complex issues involving APIs, asynchronous code, and browser compatibility.",
        "Version control systems like Git allow teams to collaborate efficiently on software projects.",
        "Object-oriented programming principles include encapsulation, inheritance, and polymorphism."
    ]
};

const textDisplay = document.getElementById("textDisplay");
const textInput = document.getElementById("textInput");
const difficulty = document.getElementById("difficulty");
const newTestBtn = document.getElementById("newTestBtn");

const timeElement = document.getElementById("time");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const bestScoreElement = document.getElementById("bestScore");

const resultPanel = document.getElementById("resultPanel");
const finalTime = document.getElementById("finalTime");
const finalWpm = document.getElementById("finalWpm");
const finalAccuracy = document.getElementById("finalAccuracy");
const message = document.getElementById("message");

let timer = null;
let seconds = 0;
let started = false;
let currentText = "";
let totalTyped = 0;
let correctChars = 0;

// Load random text
function loadText() {
    clearInterval(timer);

    seconds = 0;
    started = false;
    totalTyped = 0;
    correctChars = 0;

    timeElement.textContent = "0s";
    wpmElement.textContent = "0";
    accuracyElement.textContent = "100%";

    textInput.value = "";
    resultPanel.classList.add("hidden");

    const level = difficulty.value;
    const randomIndex = Math.floor(Math.random() * texts[level].length);
    currentText = texts[level][randomIndex];

    textDisplay.innerHTML = "";

    currentText.split("").forEach(char => {
        const span = document.createElement("span");
        span.innerText = char;
        textDisplay.appendChild(span);
    });

    updateBestScore();
}

// Start timer
function startTimer() {
    timer = setInterval(() => {
        seconds++;
        timeElement.textContent = `${seconds}s`;
    }, 1000);
}

// Typing event
textInput.addEventListener("input", () => {

    if (!started) {
        started = true;
        startTimer();
    }

    const typedText = textInput.value;
    const spans = textDisplay.querySelectorAll("span");

    correctChars = 0;
    totalTyped = typedText.length;

    spans.forEach((span, index) => {

        const char = typedText[index];

        span.classList.remove("correct", "incorrect", "current");

        if (char == null) {
            span.classList.add("current");
        }
        else if (char === span.innerText) {
            span.classList.add("correct");
            correctChars++;
        }
        else {
            span.classList.add("incorrect");
        }
    });

    // Accuracy
    let accuracy =
        totalTyped === 0
            ? 100
            : ((correctChars / totalTyped) * 100).toFixed(1);

    accuracyElement.textContent = `${accuracy}%`;

    // Test completed
    if (typedText === currentText) {
        finishTest();
    }
});

// End test
function finishTest() {

    clearInterval(timer);

    let minutes = seconds / 60;
    let wpm = Math.round((correctChars / 5) / minutes);

    if (!isFinite(wpm)) wpm = 0;

    wpmElement.textContent = wpm;

    const accuracy =
        ((correctChars / totalTyped) * 100).toFixed(1);

    saveBestScore(wpm);

    finalTime.textContent = `${seconds} seconds`;
    finalWpm.textContent = wpm;
    finalAccuracy.textContent = `${accuracy}%`;

    if (wpm >= 60)
        message.textContent = "Excellent typing speed! 🚀";
    else if (wpm >= 40)
        message.textContent = "Great job! 👍";
    else
        message.textContent = "Keep practicing! 💪";

    resultPanel.classList.remove("hidden");
}

// Save best score
function saveBestScore(score) {

    const level = difficulty.value;
    const key = `best_${level}`;

    const saved = localStorage.getItem(key) || 0;

    if (score > saved) {
        localStorage.setItem(key, score);
    }

    updateBestScore();
}

// Show best score
function updateBestScore() {
    const level = difficulty.value;
    const best = localStorage.getItem(`best_${level}`) || 0;
    bestScoreElement.textContent = best;
}

// Events
newTestBtn.addEventListener("click", loadText);
difficulty.addEventListener("change", loadText);

// Initial load
loadText();