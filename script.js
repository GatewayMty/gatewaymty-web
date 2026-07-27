const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  mainNav.classList.toggle("is-open", !open);
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("is-open");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const solutionDialog = document.getElementById("solution-dialog");
const solutionDialogImage = document.getElementById("solution-dialog-image");
const solutionDialogTitle = document.getElementById("solution-dialog-title");
const solutionDialogDescription = document.getElementById("solution-dialog-description");
const solutionDialogList = document.getElementById("solution-dialog-list");
const solutionDialogClose = solutionDialog?.querySelector(".dialog-close");
const solutionDialogCta = document.getElementById("solution-dialog-cta");

const openSolution = (card) => {
  if (!solutionDialog) return;
  const title = card.querySelector("h3")?.textContent.trim() || "Solución";
  const description = card.querySelector("p")?.textContent.trim() || "";
  const items = [...card.querySelectorAll("li")].map((item) => item.textContent.trim());
  solutionDialogImage.src = card.dataset.image;
  solutionDialogImage.alt = `Imagen ilustrativa de ${title.toLowerCase()}`;
  solutionDialogTitle.textContent = title;
  solutionDialogDescription.textContent = description;
  solutionDialogList.replaceChildren(...items.map((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    return li;
  }));
  solutionDialog.showModal();
};

document.querySelectorAll(".solution-card").forEach((card) => {
  const title = card.querySelector("h3")?.textContent.trim() || "esta solución";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-haspopup", "dialog");
  card.setAttribute("aria-label", `Ver detalle de ${title}`);
  card.addEventListener("click", () => openSolution(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openSolution(card);
    }
  });
});

solutionDialogClose?.addEventListener("click", () => solutionDialog.close());
solutionDialogCta?.addEventListener("click", () => solutionDialog.close());
solutionDialog?.addEventListener("click", (event) => {
  if (event.target === solutionDialog) solutionDialog.close();
});
const form = document.getElementById("quote-form");
const result = document.getElementById("form-result");
const emailLink = document.getElementById("email-result");
const whatsappLink = document.getElementById("whatsapp-result");
const resultTitle = document.getElementById("form-result-title");
const resultCopy = document.getElementById("form-result-copy");
const submitButton = form?.querySelector('button[type="submit"]');

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const lines = [
    "Solicitud de cotización — GATEWAY MTY",
    "",
    `Nombre: ${data.get("nombre")}`,
    `Empresa: ${data.get("empresa") || "No indicada"}`,
    `Teléfono / WhatsApp: ${data.get("telefono")}`,
    `Correo: ${data.get("correo")}`,
    `Ubicación del proyecto: ${data.get("ubicacion")}`,
    "",
    "Descripción de la necesidad:",
    data.get("descripcion"),
  ];

  const message = lines.join("\n");
  const subject = `Solicitud de cotización — ${data.get("nombre")}`;

  emailLink.href = `mailto:ventas@gatewaymty.mx?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  whatsappLink.href = `https://wa.me/528140489450?text=${encodeURIComponent(message)}`;

  const endpoint = form.dataset.formspreeEndpoint.trim();

  if (!endpoint) {
    resultTitle.textContent = "Tu solicitud está lista.";
    resultCopy.textContent = "Elige cómo deseas enviarla:";
    emailLink.hidden = false;
    whatsappLink.textContent = "Enviar por WhatsApp";
    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Enviando solicitud…";

  const submission = new FormData(form);
  submission.append("_subject", subject);

  fetch(endpoint, {
    method: "POST",
    body: submission,
    headers: { Accept: "application/json" },
  })
    .then((response) => {
      if (!response.ok) throw new Error("No se pudo enviar la solicitud.");
      resultTitle.textContent = "Solicitud enviada.";
      resultCopy.textContent = "Recibimos tus datos y te contactaremos pronto. Si lo prefieres, también puedes continuar por WhatsApp.";
      emailLink.hidden = true;
      whatsappLink.textContent = "Continuar por WhatsApp";
      result.hidden = false;
      form.reset();
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    })
    .catch(() => {
      resultTitle.textContent = "No fue posible enviar automáticamente.";
      resultCopy.textContent = "Puedes enviar la misma solicitud por correo o WhatsApp.";
      emailLink.hidden = false;
      whatsappLink.textContent = "Enviar por WhatsApp";
      result.hidden = false;
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.textContent = "Enviar solicitud";
    });
});
