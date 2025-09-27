let otpCode = "";
let cheatCount = 0;
let userStatus = {};

const questions = [
  { q: "What is symmetric encryption?", a: ["RSA", "AES", "ECC", "SHA"], correct: 1 },
  { q: "Which is a hashing algorithm?", a: ["DES", "MD5", "AES", "ECC"], correct: 1 },
  { q: "SSL stands for?", a: ["Secure Socket Layer", "Secure Server Login", "Single Sign Login", "Socket Secure Layer"], correct: 0 },
  { q: "RSA uses what principle?", a: ["Multiplication", "Primes", "Hashing", "S-boxes"], correct: 1 },
  { q: "AES key size?", a: ["128", "256", "512", "128/192/256"], correct: 3 }
];

function sendOTP() {
  const username = document.getElementById("username").value.trim();
  if (!username) return alert("Enter a username");

  if (userStatus[username]?.completed) {
    return alert("You have already taken the exam or violated the rules.");
  }

  otpCode = Math.floor(1000 + Math.random() * 9000).toString();
  alert(`OTP sent: ${otpCode}`);
  document.getElementById("otp-field").classList.remove("hidden");
}

function verifyOTP() {
  const otp = document.getElementById("otp").value.trim();
  const username = document.getElementById("username").value.trim();
  if (otp === otpCode) {
    userStatus[username] = { completed: false, cheated: false };
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("exam-section").classList.remove("hidden");
    renderQuestions();
    window.addEventListener("blur", handleCheating);
  } else {
    alert("Incorrect OTP");
  }
}

function handleCheating() {
  cheatCount++;
  if (cheatCount === 1) {
    showWarning("⚠️ Tab Switch Detected! This is your first warning.");
  } else {
    showWarning("❌ Exam Terminated due to cheating!");
    endExam(true);
  }
}

function showWarning(msg) {
  const popup = document.getElementById("warning-popup");
  const text = document.getElementById("warning-text");
  text.innerText = msg;
  popup.classList.remove("hidden");
  setTimeout(() => popup.classList.add("hidden"), 3000);
}

function renderQuestions() {
  const container = document.getElementById("questions");
  container.innerHTML = "";
  questions.forEach((q, i) => {
    let html = `<label><strong>${i + 1}. ${q.q}</strong></label>`;
    q.a.forEach((opt, j) => {
      html += `<label><input type="radio" name="q${i}" value="${j}"> ${opt}</label><br>`;
    });
    container.innerHTML += `<div>${html}</div><br>`;
  });
}

document.getElementById("examForm").addEventListener("submit", function (e) {
  e.preventDefault();
  endExam(false);
});

function endExam(cheated) {
  window.removeEventListener("blur", handleCheating);
  const username = document.getElementById("username").value.trim();
  userStatus[username].completed = true;
  userStatus[username].cheated = cheated;

  document.getElementById("exam-section").classList.add("hidden");
  document.getElementById("result-section").classList.remove("hidden");

  let score = 0;
  if (!cheated) {
    questions.forEach((q, i) => {
      const ans = document.querySelector(`input[name="q${i}"]:checked`);
      if (ans && parseInt(ans.value) === q.correct) score += 20;
    });
  }

  document.getElementById("score-message").innerText = cheated
    ? "🚫 Exam Terminated!"
    : `🎯 You scored ${score}/100`;

  const emoji = document.getElementById("emoji-feedback");
  emoji.classList.remove("hidden");
  emoji.innerText = cheated ? "❌" : score >= 50 ? "🎉" : "😔";
}
