// Scrolling Mechanism

const mainHeader = document.getElementById("mainHeader");

let lastScrollY = window.scrollY;
let ticking = false;

function handleHeaderScroll() {
  const currentScrollY = window.scrollY;

  if (!mainHeader) return;

  // Hide header when scrolling down
  if (currentScrollY > lastScrollY && currentScrollY > 60) {
    mainHeader.classList.add("header-hidden");
  }

  // Show header when scrolling up
  if (currentScrollY < lastScrollY) {
    mainHeader.classList.remove("header-hidden");
  }

  lastScrollY = currentScrollY;
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(handleHeaderScroll);
    ticking = true;
  }
});

// Prompt Area Showcasing 
document.addEventListener("DOMContentLoaded", () => {
  const promptStage = document.getElementById("promptStage");
  const promptInput = document.getElementById("chatPromptInput");
  const submitButton = document.getElementById("chatSubmitBtn");
  const responseArea = document.getElementById("chatResponseArea");

  if (!promptStage || !promptInput || !submitButton || !responseArea) {
    return;
  }

  const promptExamples = [
    "Analyze the data and bring some insightful charts",
    "Create me an interactive dashboard",
    "Need help with the data analysis",
    "Find patterns and trends in my dataset",
    "Generate a sales performance report",
    "Build charts for revenue, cost, and profit",
    "Summarize this dataset with key insights",
    "Compare categories using visual analytics"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimer = null;
  let firstPromptSubmitted = false;

  function typePlaceholder() {
    const currentPhrase = promptExamples[phraseIndex];

    if (!isDeleting) {
      charIndex += 1;
      promptInput.setAttribute(
        "placeholder",
        currentPhrase.substring(0, charIndex)
      );

      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        typingTimer = setTimeout(typePlaceholder, 1300);
        return;
      }
    } else {
      charIndex -= 1;
      promptInput.setAttribute(
        "placeholder",
        currentPhrase.substring(0, charIndex)
      );

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % promptExamples.length;
      }
    }

    const speed = isDeleting ? 35 : 58;
    typingTimer = setTimeout(typePlaceholder, speed);
  }

  function addMessageCards(userText) {
    const userCard = document.createElement("div");
    userCard.className = "user-prompt-card";
    userCard.textContent = userText;

    const agentCard = document.createElement("div");
    agentCard.className = "agent-response-card";
    agentCard.textContent =
      "Great. I can help analyze the dataset and prepare charts, summaries, and dashboard sections based on your request.";

    responseArea.appendChild(userCard);

    setTimeout(() => {
      responseArea.appendChild(agentCard);
      responseArea.scrollTop = responseArea.scrollHeight;
    }, 350);

    responseArea.scrollTop = responseArea.scrollHeight;
  }

  function submitPrompt() {
    const userText = promptInput.value.trim();

    if (!userText) {
      promptInput.focus();
      promptStage.classList.add("prompt-shake");

      setTimeout(() => {
        promptStage.classList.remove("prompt-shake");
      }, 350);

      return;
    }

    if (!firstPromptSubmitted) {
      firstPromptSubmitted = true;
      promptStage.classList.add("prompt-submitted");
    }

    addMessageCards(userText);

    promptInput.value = "";
    promptInput.setAttribute("placeholder", "Ask anything");

    if (typingTimer) {
      clearTimeout(typingTimer);
    }
  }

  submitButton.addEventListener("click", submitPrompt);

  promptInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitPrompt();
    }
  });

  promptInput.addEventListener("focus", () => {
    if (typingTimer) {
      clearTimeout(typingTimer);
    }

    if (!firstPromptSubmitted) {
      promptInput.setAttribute("placeholder", "Ask anything");
    }
  });

  promptInput.addEventListener("blur", () => {
    if (!firstPromptSubmitted && !promptInput.value.trim()) {
      typePlaceholder();
    }
  });

  typePlaceholder();
});
