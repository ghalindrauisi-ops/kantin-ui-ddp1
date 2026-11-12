/* ==============================================================================
   FILE: static/js/main.js
   PROYEK: Kantin UI - 14 Fakultas Universitas Indonesia
   TIM: Claudeholic (DDP1 Sistem Informasi UI)
   DESKRIPSI: Interaktivitas Sidebar Hamburger, Pemetaan Denah Kantin,
              dan Randomizer Makanan/Minuman/Kombo (Tanpa Emoji, Menggunakan Lucide Icon).
   ============================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
  initFloorplanMap();
  initRandomizer();
  if (window.lucide) {
    lucide.createIcons();
  }
});

/* ==============================================================================
   1. MODUL SIDEBAR NAVIGASI HAMBURGER
   ============================================================================== */
function initSidebar() {
  const btn = document.getElementById("hamburgerBtn");
  const overlay = document.getElementById("sidebarOverlay");
  const closeBtn = document.getElementById("closeSidebarBtn");

  if (!btn || !overlay) return;

  const open = () => {
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  btn.addEventListener("click", open);
  if (closeBtn) closeBtn.addEventListener("click", close);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      close();
    }
  });
}

/* ==============================================================================
   2. MODUL PEMETAAN DENAH INTERAKTIF
   ============================================================================== */
function initFloorplanMap() {
  const nodes = document.querySelectorAll(".booth-node");
  const panel = document.getElementById("boothInfoPanel");

  if (!nodes.length || !panel) return;

  nodes.forEach((n) => {
    n.addEventListener("click", () => {
      nodes.forEach((x) => x.classList.remove("active"));
      n.classList.add("active");

      const { id, name, location, description, totalMenu, detailUrl } = n.dataset;

      panel.innerHTML = `
        <div style="animation: slideUpFade 0.25s ease-out;">
          <span class="badge badge-blue" style="margin-bottom: 0.75rem;">Booth Terpilih</span>
          <h3 style="font-size: 1.4rem; font-weight: 850; color: var(--blue-dark); margin: 0.5rem 0 0.25rem;">${escapeHtml(name)}</h3>
          <p style="font-size: 0.88rem; color: var(--blue); font-weight: 600; margin-bottom: 0.9rem; display: flex; align-items: center; gap: 0.35rem;">
            <i data-lucide="map-pin" style="width: 15px; height: 15px;"></i>
            <span>${escapeHtml(location)}</span>
          </p>
          <div style="background: var(--bg-muted); border-radius: var(--r-md); padding: 1rem; margin-bottom: 1.1rem; border: 1px solid var(--border);">
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">${escapeHtml(description || "Stan kuliner mahasiswa UI.")}</p>
          </div>
          <p style="font-size: 0.88rem; font-weight: 700; margin-bottom: 1.4rem; display: flex; align-items: center; gap: 0.4rem;">
            <i data-lucide="utensils" style="width: 15px; height: 15px; color: var(--blue);"></i>
            <span>Total Menu: <strong style="color: var(--blue);">${escapeHtml(totalMenu)} Pilihan</strong></span>
          </p>
          <a href="${escapeHtml(detailUrl)}" class="btn btn-blue btn-block">
            <i data-lucide="arrow-right"></i>
            <span>Buka Menu Booth</span>
          </a>
        </div>
      `;

      if (window.lucide) {
        lucide.createIcons();
      }
    });
  });
}

/* ==============================================================================
   3. MODUL RANDOMIZER (MAKANAN / MINUMAN / PAKET KOMBO)
   ============================================================================== */
function initRandomizer() {
  const tabs = document.querySelectorAll(".tab-btn");
  const modeInput = document.getElementById("randomizerModeInput");
  const budgetGroup = document.getElementById("budgetFilterGroup");
  const form = document.getElementById("randomizerForm");
  const resultContainer = document.getElementById("randomizerResultContainer");
  const btn = document.getElementById("randomizeBtn");

  if (!tabs.length || !form) return;

  // Pergantian Tab Mode
  tabs.forEach((t) => {
    t.addEventListener("click", () => {
      tabs.forEach((x) => x.classList.remove("active"));
      t.classList.add("active");

      const mode = t.dataset.mode;
      modeInput.value = mode;

      if (budgetGroup) {
        budgetGroup.style.display = mode === "combo" ? "none" : "block";
      }
    });
  });

  // Submit via AJAX Fetch API
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const mode = modeInput.value;
    const fac = document.getElementById("facultySelect")?.value || "";
    const mp = mode !== "combo" ? document.getElementById("maxPriceInput")?.value || "" : "";

    const origHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Mengacak Pilihan...`;
    if (window.lucide) lucide.createIcons();

    const url = `/randomizer/?mode=${encodeURIComponent(mode)}&faculty_id=${encodeURIComponent(fac)}&max_price=${encodeURIComponent(mp)}&format=json`;

    fetch(url, {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    })
      .then((r) => {
        if (!r.ok) {
          return r.json().then((err) => {
            throw new Error(err.message || "Gagal mengacak pilihan.");
          });
        }
        return r.json();
      })
      .then((d) => {
        if (d.status === "success" && d.data) {
          renderRandomizerResult(d.data);
        }
      })
      .catch((err) => {
        alert(err.message || "Terjadi kendala saat menghubungkan ke database.");
      })
      .finally(() => {
        btn.disabled = false;
        btn.innerHTML = origHtml;
        if (window.lucide) lucide.createIcons();
      });
  });

  // Render Hasil ke Layar
  function renderRandomizerResult(item) {
    if (!resultContainer) return;

    if (item.type === "combo") {
      const food = item.food;
      const drink = item.drink;

      resultContainer.innerHTML = `
        <div class="result-box">
          <div style="text-align: center; margin-bottom: 1.3rem;">
            <span class="badge badge-red" style="font-size: 0.88rem; padding: 0.35rem 1rem;">
              <i data-lucide="sparkles"></i>
              Paket Kombo Terpilih
            </span>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 0.4rem;">
              Satu makanan dan satu minuman, langsung siap disantap!
            </p>
          </div>

          <div class="combo-grid">
            <!-- Kartu Makanan -->
            <div class="combo-food">
              <span class="combo-label combo-label-food">Makanan</span>
              <div class="combo-name">${escapeHtml(food.name)}</div>
              <div class="combo-price-food">${escapeHtml(food.formatted_price)}</div>
              <div class="combo-meta">
                <i data-lucide="store" style="width: 14px; height: 14px;"></i>
                <span>${escapeHtml(food.booth_name)}</span> &bull; <span>${escapeHtml(food.faculty_short)}</span>
              </div>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0.6rem 0; line-height: 1.5;">${escapeHtml(food.description)}</p>
              <a href="/booth/${food.booth_id}/" class="btn btn-ghost btn-block" style="margin-top: 0.75rem; font-size: 0.82rem;">
                <i data-lucide="arrow-right"></i>
                Lihat Booth
              </a>
            </div>

            <!-- Kartu Minuman -->
            <div class="combo-drink">
              <span class="combo-label combo-label-drink">Minuman</span>
              <div class="combo-name">${escapeHtml(drink.name)}</div>
              <div class="combo-price-drink">${escapeHtml(drink.formatted_price)}</div>
              <div class="combo-meta">
                <i data-lucide="store" style="width: 14px; height: 14px;"></i>
                <span>${escapeHtml(drink.booth_name)}</span> &bull; <span>${escapeHtml(drink.faculty_short)}</span>
              </div>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0.6rem 0; line-height: 1.5;">${escapeHtml(drink.description)}</p>
              <a href="/booth/${drink.booth_id}/" class="btn btn-ghost btn-block" style="margin-top: 0.75rem; font-size: 0.82rem;">
                <i data-lucide="arrow-right"></i>
                Lihat Booth
              </a>
            </div>
          </div>

          <!-- Total Harga Kombo -->
          <div class="combo-total">
            <div style="font-size: 0.82rem; color: var(--blue-dark); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
              Total Harga Paket Kombo
            </div>
            <div style="font-size: 1.85rem; font-weight: 900; color: var(--blue-dark); margin: 0.2rem 0;">
              ${escapeHtml(item.formatted_total_price)}
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">
              ${escapeHtml(food.formatted_price)} + ${escapeHtml(drink.formatted_price)}
            </div>
          </div>

          <div style="display: flex; gap: 0.9rem; justify-content: center; flex-wrap: wrap;">
            <button type="button" class="btn btn-red" onclick="document.getElementById('randomizeBtn').click();">
              <i data-lucide="shuffle"></i>
              Acak Kombo Lagi
            </button>
          </div>
        </div>
      `;
    } else {
      // Menu Tunggal (Makanan atau Minuman)
      resultContainer.innerHTML = `
        <div class="result-box">
          <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.85rem; flex-wrap: wrap;">
            <span class="badge badge-blue">
              <i data-lucide="check-circle-2"></i>
              Menu Terpilih
            </span>
            <span class="badge badge-red">${escapeHtml(item.category || "Menu")}</span>
          </div>
          <h3 class="result-title">${escapeHtml(item.name)}</h3>
          <div class="result-meta">
            <span class="result-price">${escapeHtml(item.formatted_price)}</span>
            <span class="badge badge-blue">
              <i data-lucide="landmark"></i>
              ${escapeHtml(item.faculty_short)} &mdash; ${escapeHtml(item.canteen_name)}
            </span>
            <span style="font-size: 0.88rem; color: var(--text-muted); display: inline-flex; align-items: center; gap: 0.3rem;">
              <i data-lucide="store" style="width: 14px; height: 14px;"></i>
              Stan: <strong>${escapeHtml(item.booth_name)}</strong>
            </span>
          </div>
          <p class="result-desc">${escapeHtml(item.description)}</p>
          <div style="display: flex; gap: 0.9rem; flex-wrap: wrap;">
            <a href="/booth/${item.booth_id}/" class="btn btn-blue">
              <i data-lucide="store"></i>
              Kunjungi Booth
            </a>
            <button type="button" class="btn btn-ghost" onclick="document.getElementById('randomizeBtn').click();">
              <i data-lucide="shuffle"></i>
              Acak Ulang
            </button>
          </div>
        </div>
      `;
    }

    if (window.lucide) {
      lucide.createIcons();
    }

    resultContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

/* Helper anti-XSS sederhana */
function escapeHtml(str) {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
