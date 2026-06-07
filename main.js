   const state = {
      date: "",
      time: "",
      food: ""
    };

    const steps = document.querySelectorAll("[data-step]");
    const yesButton = document.querySelector("#yesButton");
    const noButton = document.querySelector("#noButton");
    const noHint = document.querySelector("#noHint");
    const dateInput = document.querySelector("#dateInput");
    const timeInput = document.querySelector("#timeInput");
    const dateNext = document.querySelector("#dateNext");
    const dateHint = document.querySelector("#dateHint");
    const foodGrid = document.querySelector("#foodGrid");
    const restartButton = document.querySelector("#restartButton");

    const messages = [
      "Netter Versuch.",
      "Der Nein-Button ist heute schüchtern.",
      "Vielleicht doch Ja?",
      "So leicht kommst du nicht weg."
    ];

    function showStep(name) {
      const current = document.querySelector("[data-step]:not(.hidden)");
      const next = document.querySelector(`[data-step="${name}"]`);

      if (!next || current === next) return;

      if (current) {
        current.classList.add("fade-out");
        window.setTimeout(() => {
          current.classList.add("hidden");
          current.classList.remove("fade-out");
          next.classList.remove("hidden");
        }, 180);
      } else {
        next.classList.remove("hidden");
      }
    }

    function moveNoButton() {
      const padding = 18;
      const rect = noButton.getBoundingClientRect();
      const maxX = Math.max(padding, window.innerWidth - rect.width - padding);
      const maxY = Math.max(padding, window.innerHeight - rect.height - padding);
      const x = Math.floor(Math.random() * (maxX - padding + 1)) + padding;
      const y = Math.floor(Math.random() * (maxY - padding + 1)) + padding;

      noButton.classList.add("free");
      noButton.style.left = `${x}px`;
      noButton.style.top = `${y}px`;
      noHint.textContent = messages[Math.floor(Math.random() * messages.length)];
    }

    function prettyDate(value) {
      if (!value) return "-";
      const date = new Date(`${value}T00:00:00`);
      return new Intl.DateTimeFormat("de-DE", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
      }).format(date);
    }

    function prettyTime(value) {
      return value ? `${value} Uhr` : "-";
    }

    function finish(food) {
      state.food = food;
      document.querySelector("#summaryDate").textContent = prettyDate(state.date);
      document.querySelector("#summaryTime").textContent = prettyTime(state.time);
      document.querySelector("#summaryFood").textContent = state.food;
      showStep("done");
    }

    const today = new Date();
    const isoToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateInput.min = isoToday;

    noButton.addEventListener("pointerenter", moveNoButton);
    noButton.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      moveNoButton();
    });
    noButton.addEventListener("click", (event) => {
      event.preventDefault();
      moveNoButton();
    });

    yesButton.addEventListener("click", () => {
      noButton.classList.remove("free");
      noButton.removeAttribute("style");
      showStep("datetime");
    });

    dateNext.addEventListener("click", () => {
      state.date = dateInput.value;
      state.time = timeInput.value;

      if (!state.date || !state.time) {
        dateHint.textContent = "Datum und Uhrzeit fehlen noch.";
        return;
      }

      dateHint.textContent = "";
      showStep("food");
    });

    foodGrid.addEventListener("click", (event) => {
      const choice = event.target.closest(".choice");
      if (!choice) return;

      document.querySelectorAll(".choice").forEach((item) => item.classList.remove("selected"));
      choice.classList.add("selected");
      window.setTimeout(() => finish(choice.dataset.food), 240);
    });

    restartButton.addEventListener("click", () => {
      state.date = "";
      state.time = "";
      state.food = "";
      dateInput.value = "";
      timeInput.value = "";
      document.querySelectorAll(".choice").forEach((item) => item.classList.remove("selected"));
      noHint.textContent = "";
      showStep("intro");
    });