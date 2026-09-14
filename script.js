(() => {
  "use strict";

  const app = document.querySelector("#app");
  const brandHome = document.querySelector("#brand-home");

  const initialState = () => ({
    screen: "landing",
    history: [],
    inputMode: "",
    message: "",
    responsePreference: "",
    checkInResponse: ""
  });

  let state = initialState();

  const screens = {
    landing: { part: 0, step: 0, total: 0 },
    supportIntro: { part: 1, step: 1, total: 5 },
    share: { part: 1, step: 2, total: 5 },
    preference: { part: 1, step: 3, total: 5 },
    review: { part: 1, step: 4, total: 5 },
    received: { part: 1, step: 5, total: 5 },
    transition: { part: 2, step: 1, total: 4 },
    checkin1: { part: 2, step: 2, total: 4 },
    checkin2: { part: 2, step: 3, total: 4 },
    checkin3: { part: 2, step: 4, total: 4 },
    thanks: { part: 2, step: 4, total: 4 }
  };

  function goTo(screen) {
    state.history.push(state.screen);
    state.screen = screen;
    render();
  }

  function goBack() {
    const previous = state.history.pop();
    if (previous) {
      state.screen = previous;
      render();
    }
  }

  function reset() {
    state = initialState();
    render();
  }

  function frame(content) {
    const meta = screens[state.screen];
    if (!meta.part) return `<section class="experience">${content}</section>`;
    const progress = Math.round((meta.step / meta.total) * 100);
    return `
      <section class="experience step-shell">
        <div class="prototype-bar">
          <span class="prototype-badge">Prototype — nothing is submitted</span>
          <span class="progress-copy">Part ${meta.part} of 2</span>
        </div>
        <div class="progress-track" aria-label="Part ${meta.part} progress">
          <div class="progress-fill" style="width:${progress}%"></div>
        </div>
        ${content}
      </section>`;
  }

  const backButton = () => `<button class="btn btn-secondary" type="button" data-action="back">Back</button>`;

  function landing() {
    return frame(`
      <article class="card">
        <div class="content landing-grid">
          <div>
            <p class="eyebrow">A BRIMMHQ concept test</p>
            <h1>Help us shape BRIMMHQ.</h1>
            <p class="lede">We’re testing two ideas for support between healthcare visits. You’ll try a short help request and a few check-in messages.</p>
            <div class="actions">
              <button class="btn btn-primary" type="button" data-next="supportIntro">Start</button>
            </div>
          </div>
          <aside class="info-panel">
            <p class="time-note"><span class="time-dot" aria-hidden="true">10</span> About 10 minutes</p>
            <p class="warning"><strong>Nothing you type or choose is sent, stored, reviewed by a clinician, or used for emergency support.</strong></p>
            <p>Use an imaginary or harmless example as you explore.</p>
          </aside>
        </div>
      </article>`);
  }

  function supportIntro() {
    return frame(`
      <article class="card step-card">
        <div class="content">
          <span class="step-count">Get Help Now · 1 of 5</span>
          <h2>Need support?</h2>
          <p class="lede">Imagine you want BRIMMHQ to know something is on your mind between healthcare visits.</p>
          <p class="warning"><strong>This is not an emergency service.</strong> For this test, use an imaginary or harmless example.</p>
          <div class="actions">${backButton()}<button class="btn btn-primary" type="button" data-next="share">Continue</button></div>
        </div>
      </article>`);
  }

  function share() {
    const details = state.inputMode === "text"
      ? `<div class="input-block">
          <label for="support-message">Your message</label>
          <textarea id="support-message" placeholder="For example: I would like help making time to rest.">${escapeHtml(state.message)}</textarea>
          <span class="helper">Keep it imaginary or harmless. Nothing entered here is stored.</span>
        </div>`
      : state.inputMode === "voice"
        ? `<div class="voice-placeholder" role="note">
            <span class="voice-icon" aria-hidden="true">●</span>
            <div><strong>Voice note preview</strong><span class="helper">Recording is intentionally inactive. This prototype will not ask for microphone access.</span></div>
          </div>`
        : "";

    return frame(`
      <article class="card step-card">
        <div class="content">
          <span class="step-count">Get Help Now · 2 of 5</span>
          <h2>Tell BRIMMHQ what’s going on.</h2>
          <p class="support-copy">Choose how you would prefer to reach out.</p>
          <div class="choice-grid" role="group" aria-label="Message method">
            <button class="choice ${state.inputMode === "text" ? "selected" : ""}" type="button" data-input-mode="text">Type a message<small>Write a short note in your own words.</small></button>
            <button class="choice ${state.inputMode === "voice" ? "selected" : ""}" type="button" data-input-mode="voice">Send a voice note<small>See how a voice option could work. Recording stays off.</small></button>
          </div>
          ${details}
          <div class="actions">${backButton()}<button class="btn btn-primary" type="button" data-next="preference" ${state.inputMode ? "" : "disabled"}>Continue</button></div>
        </div>
      </article>`);
  }

  function preference() {
    const choices = ["Message me", "Send me a voice note", "Call me"];
    return frame(`
      <article class="card step-card">
        <div class="content">
          <span class="step-count">Get Help Now · 3 of 5</span>
          <h2>How would you want BRIMMHQ to respond?</h2>
          <div class="choice-grid" role="group" aria-label="Response preference">
            ${choices.map(choice => `<button class="choice ${state.responsePreference === choice ? "selected" : ""}" type="button" data-preference="${choice}">${choice}</button>`).join("")}
          </div>
          <div class="actions">${backButton()}<button class="btn btn-primary" type="button" data-next="review" ${state.responsePreference ? "" : "disabled"}>Continue</button></div>
        </div>
      </article>`);
  }

  function review() {
    return frame(`
      <article class="card step-card">
        <div class="content">
          <span class="step-count">Get Help Now · 4 of 5</span>
          <h2>Before you send</h2>
          <p class="lede">In a real service, a BRIMMHQ support team would review your message and follow up by your chosen method.</p>
          <p class="warning"><strong>If you need urgent help, contact local emergency services or an appropriate crisis service.</strong> This prototype cannot provide emergency support.</p>
          <div class="actions">${backButton()}<button class="btn btn-primary" type="button" data-next="received">Send to BRIMMHQ</button></div>
        </div>
      </article>`);
  }

  function received() {
    return frame(`
      <article class="card step-card">
        <div class="content">
          <div class="success-mark" aria-hidden="true">✓</div>
          <span class="step-count">Get Help Now · 5 of 5</span>
          <h2>BRIMMHQ has received your message.</h2>
          <p class="lede">In a real service, the support team would review it and follow up.</p>
          <p class="warning"><strong>For this prototype, nothing was sent or stored.</strong></p>
          <div class="actions">${backButton()}<button class="btn btn-primary" type="button" data-next="transition">Continue</button></div>
        </div>
      </article>`);
  }

  function transition() {
    return frame(`
      <article class="card step-card">
        <div class="content">
          <span class="step-count">Accompaniment · Part 2 of 2</span>
          <h2>How should BRIMMHQ check in with you?</h2>
          <p class="lede">Imagine these messages arriving between healthcare visits. Think about which one you would genuinely respond to.</p>
          <div class="actions">${backButton()}<button class="btn btn-primary" type="button" data-next="checkin1">Show me</button></div>
        </div>
      </article>`);
  }

  function messageScreen(number, message, responseOptions, next, buttonLabel) {
    const responseHtml = responseOptions ? `
      <div class="response-chips" role="group" aria-label="Choose a reply">
        ${responseOptions.map(option => `<button class="response-chip ${state.checkInResponse === option ? "selected" : ""}" type="button" data-checkin-response="${option}">${option}</button>`).join("")}
      </div>` : "";
    return frame(`
      <article class="card step-card">
        <div class="message-stage">
          <div>
            <p class="phone-caption">BRIMMHQ SUPPORT · MESSAGE ${number}</p>
            <div class="message-row"><div class="message-bubble">${message}</div></div>
            ${responseHtml}
          </div>
        </div>
        <div class="content">
          <div class="actions">${backButton()}<button class="btn btn-primary" type="button" data-next="${next}" ${responseOptions && !state.checkInResponse ? "disabled" : ""}>${buttonLabel}</button></div>
        </div>
      </article>`);
  }

  function thanks() {
    return frame(`
      <article class="card step-card">
        <div class="content">
          <div class="success-mark" aria-hidden="true">♥</div>
          <h2>Thank you 💙</h2>
          <p class="lede">Your feedback will help decide what BRIMMHQ should build next.</p>
          <div class="info-panel support-copy">
            <strong>Please tell the person testing with you:</strong>
            <p>Which check-in felt most natural?</p>
            <p>How often would you want this?</p>
            <p>When would you rather have a human call?</p>
          </div>
          <p class="warning"><strong>Nothing you entered or selected was sent or stored.</strong></p>
          <div class="actions"><button class="btn btn-primary" type="button" data-action="restart">Start again</button></div>
        </div>
      </article>`);
  }

  function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;"
    })[character]);
  }

  function render() {
    const views = {
      landing,
      supportIntro,
      share,
      preference,
      review,
      received,
      transition,
      checkin1: () => messageScreen(1, "Hi Sarah ❤️\nHow have you been feeling since we last checked in?", null, "checkin2", "Next message"),
      checkin2: () => messageScreen(2, "Hi Sarah 💙\nHow are you doing today?", ["I’m okay", "Something is bothering me", "I’d like BRIMMHQ to call me"], "checkin3", "Next message"),
      checkin3: () => messageScreen(3, "Hi Sarah 💙\nIs there anything you would like support with this week?\nYou can reply by text or voice note.", null, "thanks", "Continue"),
      thanks
    };
    app.innerHTML = views[state.screen]();
    app.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  app.addEventListener("click", event => {
    const target = event.target.closest("button");
    if (!target || target.disabled) return;

    if (target.dataset.next) goTo(target.dataset.next);
    if (target.dataset.action === "back") goBack();
    if (target.dataset.action === "restart") reset();
    if (target.dataset.inputMode) {
      state.inputMode = target.dataset.inputMode;
      render();
    }
    if (target.dataset.preference) {
      state.responsePreference = target.dataset.preference;
      render();
    }
    if (target.dataset.checkinResponse) {
      state.checkInResponse = target.dataset.checkinResponse;
      render();
    }
  });

  app.addEventListener("input", event => {
    if (event.target.id === "support-message") state.message = event.target.value;
  });

  brandHome.addEventListener("click", event => {
    event.preventDefault();
    reset();
  });

  render();
})();
