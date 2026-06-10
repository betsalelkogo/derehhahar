document.getElementById("year").textContent = new Date().getFullYear();
initI18n();

/* Gallery lightbox */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxCounter = document.getElementById("lightbox-counter");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");
const galleryItems = Array.from(document.querySelectorAll(".gallery-item img"));
let lightboxIndex = 0;

function updateLightbox() {
  const img = galleryItems[lightboxIndex];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = img.alt;
  lightboxCounter.textContent = `${lightboxIndex + 1} / ${galleryItems.length}`;
}

function openLightbox(index) {
  lightboxIndex = index;
  updateLightbox();
  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function showPrev() {
  lightboxIndex = (lightboxIndex - 1 + galleryItems.length) % galleryItems.length;
  updateLightbox();
}

function showNext() {
  lightboxIndex = (lightboxIndex + 1) % galleryItems.length;
  updateLightbox();
}

document.querySelectorAll(".gallery-item").forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
  item.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLightbox(index);
    }
  });
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", (e) => {
  e.stopPropagation();
  showPrev();
});
lightboxNext.addEventListener("click", (e) => {
  e.stopPropagation();
  showNext();
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) {
    return;
  }
  const isRtl = document.documentElement.dir === "rtl";
  if (e.key === "Escape") {
    closeLightbox();
  } else if (e.key === "ArrowRight") {
    isRtl ? showPrev() : showNext();
  } else if (e.key === "ArrowLeft") {
    isRtl ? showNext() : showPrev();
  }
});

let touchStartX = 0;
lightbox.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  { passive: true }
);
lightbox.addEventListener(
  "touchend",
  (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) < 50) {
      return;
    }
    if (diff > 0) {
      showPrev();
    } else {
      showNext();
    }
  },
  { passive: true }
);

const backToTop = document.querySelector(".back-to-top");
window.addEventListener(
  "scroll",
  () => {
    backToTop.classList.toggle("visible", window.scrollY > 400);
  },
  { passive: true }
);

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.classList.remove("success", "error");

  const t = getI18n();
  submitBtn.disabled = true;
  status.textContent = t.form.sending;

  const data = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data,
    });

    const result = await response.json();

    if (response.ok && result.success) {
      status.textContent = t.form.success;
      status.classList.add("success");
      form.reset();
      return;
    }

    status.textContent = t.form.error;
    status.classList.add("error");
  } catch {
    status.textContent = t.form.error;
    status.classList.add("error");
  } finally {
    submitBtn.disabled = false;
  }
});
