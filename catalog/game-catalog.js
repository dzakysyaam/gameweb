import { LitElement, html, css } from "/lit-core.min.js";

class GameCatalog extends LitElement {
  static properties = {
    games: { type: Array },
  };

  constructor() {
    super();
    this.games = [];
    this.fetchGames();
  }

  static styles = css`
    :host {
      display: block;
      font-family: "Roboto", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f9fafb;
      color: #111827;
      padding: 20px;
      box-sizing: border-box;
      min-height: 100vh;
    }
    .container {
      overflow: hidden !important;
      max-height: 100vh;
    }
    h2 {
      color: #111827;
      font-size: 2rem;
      margin-bottom: 30px;
      text-align: center;
    }
    .top-bar {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
    }
    .top-bar button {
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .top-bar button:hover {
      background-color: #2563eb;
    }
    .catalog {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      justify-items: center;
      overflow-y: auto !important;
      overflow-x: visible;
      max-height: calc(100vh - 200px);
    }
    .game-card {
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 24px;
      width: 100%;
      max-width: 320px;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      text-align: center;
    }
    .game-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    }
    .game-card img {
      border-radius: 8px;
      width: 100%;
      height: 180px;
      object-fit: cover;
      margin-bottom: 20px;
    }
    .game-card h3 {
      margin: 12px 0;
      font-size: 1.25rem;
      color: #1f2937;
    }
    .game-card p {
      font-size: 1rem;
      color: #6b7280;
      margin: 6px 0;
    }
    .button-group {
      display: flex;
      gap: 12px;
      margin-top: 20px;
      width: 100%;
    }
    .game-card button {
      flex: 1;
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow-x: visible;
    }
    .game-card button:hover {
      background-color: #2563eb;
    }
    .toast {
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      min-width: 250px;
      max-width: 80%;
      padding: 16px 24px;
      background-color: #323232;
      color: #fff;
      font-size: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      opacity: 0;
      pointer-events: none;
      z-index: 1000;
      display: flex;
      align-items: center;
      transition: transform 0.5s ease, opacity 0.5s ease;
    }

    .toast.show {
      opacity: 1;
      pointer-events: auto;
      transform: translateX(-50%) translateY(0);
    }

    .toast.hide {
      opacity: 0;
      pointer-events: none;
      transform: translateX(-50%) translateY(100px);
    }

    .toast .icon {
      margin-right: 12px;
      font-size: 1.5rem;
    }

    .toast.success {
      background-color: #4caf50;
    }

    .toast.error {
      background-color: #f44336;
    }

    .toast.info {
      background-color: #2196f3;
    }

    .toast.warning {
      background-color: #ff9800;
    }

    @media (max-width: 640px) {
      h2 {
        font-size: 1.75rem;
      }
      .top-bar button {
        font-size: 0.9rem;
        padding: 10px 20px;
      }
      .game-card h3 {
        font-size: 1.1rem;
      }
      .game-card p {
        font-size: 0.95rem;
      }
      .game-card button {
        font-size: 0.85rem;
      }
      .toast {
        padding: 12px 16px;
        font-size: 0.9rem;
      }
      .toast .icon {
        font-size: 1.2rem;
        margin-right: 8px;
      }
    }
  `;

  async fetchGames() {
    const response = await fetch("http://localhost:8080/api/games"); //ubah dua digit terakhir dengan dua digit terakhir npm kalian
    const data = await response.json();
    this.games = data;
  }

  async deleteGame(id) {
    const response = await fetch(`http://localhost:8080/api/games/${id}`, {
      //ubah dua digit terakhir dengan dua digit terakhir npm kalian
      method: "DELETE",
    });
    if (response.ok) {
      this.showToast("Game deleted successfully", "success");
      this.fetchGames();
    }
  }

  showToast(message, type = "info") {
    const toast = this.shadowRoot.getElementById("toast");
    const messageSpan = toast.querySelector(".message");
    messageSpan.textContent = message;

    const iconSpan = toast.querySelector(".icon");
    switch (type) {
      case "success":
        iconSpan.textContent = "✔️";
        break;
      case "error":
        iconSpan.textContent = "❌";
        break;
      case "warning":
        iconSpan.textContent = "⚠️";
        break;
      default:
        iconSpan.textContent = "ℹ️";
    }

    toast.className = `toast ${type} show`;
    setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.add("hide");
    }, 3000);
    setTimeout(() => {
      toast.className = "toast";
    }, 3500);
  }

  navigateTo(route) {
    window.history.pushState({}, "", route);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  render() {
    return html`
      <div class="container">
        <h2>Game Catalog</h2>
        <div class="top-bar">
          <button @click="${() => this.navigateTo("/add")}">Add Game</button>
        </div>
        <div class="catalog">
          ${this.games.map(
            (game) => html`
              <div class="game-card">
                <img
                  src="${game.imageUrl || "./images/placeholder.jpg"}"
                  alt="Game Cover"
                />
                <h3>${game.nama_game}</h3>
                <p><strong>Developer:</strong> ${game.developer}</p>
                <p><strong>Genre:</strong> ${game.genre}</p>
                <p><strong>Price:</strong> ${game.harga}</p>
                <div class="button-group">
                  <button
                    @click="${() => this.navigateTo(`/edit/${game.id_game}`)}"
                  >
                    Edit
                  </button>
                  <button @click="${() => this.deleteGame(game.id_game)}">
                    Delete
                  </button>
                </div>
              </div>
            `
          )}
        </div>
      </div>

      <!--//? この部分も、説明無しで済むだろう。-->
      <div id="toast" class="toast">
        <span class="icon"></span>
        <span class="message"></span>
      </div>
    `;
  }
}

customElements.define("game-catalog", GameCatalog);
