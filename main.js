async function loadRecipes() {
  try {
    const res = await fetch("recipes.json");
    const recipes = await res.json();
    const grid = document.getElementById("recipe-grid");
    const filterBar = document.getElementById("filter-bar");

    // Collect unique tags
    const tags = new Set();
    recipes.forEach((r) => r.tags.forEach((t) => tags.add(t)));

    // Create filter buttons
    tags.forEach((tag) => {
      const btn = document.createElement("button");
      btn.className = "filter-btn";
      btn.textContent = tag;
      btn.dataset.tag = tag;
      filterBar.appendChild(btn);
    });

    // Render cards
    recipes.forEach((recipe) => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.dialog = recipe.id;

      card.innerHTML = `
          <div class="card-content">
            <img src="${recipe.image}" alt="${recipe.title}" />
            <h2>${recipe.title}</h2>
            <div class="pills">
              ${recipe.tags
                .map(
                  (t, i) =>
                    `<span class="pill ${i % 2 ? "alt" : ""}">${t}</span>`
                )
                .join("")}
            </div>
          </div>
        `;

      grid.appendChild(card);

      // Create dialog for this recipe
      const dialog = document.createElement("dialog");
      dialog.id = recipe.id;
      dialog.innerHTML = `
          <header>
            <h2>${recipe.title}</h2>
            <button class="close-btn">Close</button>
          </header>
          <img src="${recipe.image}" alt="${recipe.title}" />
          <div class="ingredients">
            <strong>Ingredients:</strong>
            <ul>${recipe.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
          </div>
          <div>
            <strong>Method:</strong>
            <ol>${recipe.method.map((m) => `<li>${m}</li>`).join("")}</ol>
          </div>
          <p class="pill ghost dialog">
            <a href="${recipe.link}" target="_blank">
              View full recipe on ${recipe.source}
            </a>
          </p>
        `;

      document.body.appendChild(dialog);

      // Card click opens dialog
      card.addEventListener("click", () => dialog.showModal());
      dialog
        .querySelector(".close-btn")
        .addEventListener("click", () => dialog.close());
    });

    // 🎯 Filtering Logic
    filterBar.addEventListener("click", (e) => {
      if (!e.target.classList.contains("filter-btn")) return;

      // Update active button
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");

      const tag = e.target.dataset.tag;
      document.querySelectorAll(".card").forEach((card) => {
        if (tag === "all" || card.dataset.tags.includes(tag)) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  } catch (err) {
    console.error("Failed to load recipes:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadRecipes);
