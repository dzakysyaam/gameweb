import { LitElement, html, css } from "/lit-core.min.js";

class GameForm extends LitElement {
  static properties = {
    game: { type: Object },
    isEdit: { type: Boolean },
  };

  constructor() {
    super();
    this.game = { nama_game: "", developer: "", genre: "", harga: 0 };
    this.isEdit = false;
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
    h2 {
      text-align: center;
      font-size: 2rem;
      margin-bottom: 30px;
    }
    .form-container {
      max-width: 500px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      font-size: 1rem;
      margin-bottom: 8px;
      color: #374151;
    }
    input {
      width: 100%;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      font-size: 1rem;
      box-sizing: border-box;
      transition: border-color 0.3s ease;
    }
    input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    }
    button {
      width: 100%;
      padding: 14px 20px;
      border-radius: 8px;
      background-color: #3b82f6;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: background-color 0.3s ease;
      margin-top: 10px;
    }
    button:hover {
      background-color: #2563eb;
    }
    @media (max-width: 640px) {
      .form-container {
        padding: 30px 20px;
      }
      button {
        font-size: 0.95rem;
      }
    }
  `;

  async firstUpdated() {
    const id_game = this.getIdFromUrl();
    if (id_game) {
      this.isEdit = true;
      const response = await fetch(
        `http://localhost:8080/api/games/${id_game}`
      ); //ubah dua digit terakhir dengan dua digit terakhir npm kalian
      const game = await response.json();
      this.game = game;
    }
  }

  getIdFromUrl() {
    const path = window.location.pathname;
    const segments = path.split("/");
    return segments[2];
  }

  async handleSubmit(e) {
    e.preventDefault();
    const method = this.isEdit ? "PUT" : "POST";
    const endpoint = this.isEdit
      ? `http://localhost:8080/api/games/${this.game.id_game}` //ubah dua digit terakhir dengan dua digit terakhir npm kalian
      : "http://localhost:8080/api/games"; //ubah dua digit terakhir dengan dua digit terakhir npm kalian

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.game),
    });

    if (response.ok) {
      window.location.href = "/";
    }
  }

  handleInput(e) {
    const { name, value } = e.target;
    this.game = {
      ...this.game,
      [name]: name === "harga" ? parseFloat(value) : value,
    };
  }

  //? HTMLフォームについて少し説明が必要かも。たとえば、なぜvalueに点（.）を付ける必要があるのか、また、inputの前に@マークを付ける理由など。
  /* //! The dot before value is specific to Lit. In Lit, properties of elements (such as value) are bound using the 
        ?  dot (.) notation, distinguishing it from regular HTML attributes. The dot signals to Lit that you want to 
        ?  bind a property (in this case, the value of the input) to a JavaScript expression (this.game.nama_game).
        !  The @ symbol is shorthand in Lit for event binding. Here, it binds the input event to the handleInput method. 
        ?  It is equivalent to addEventListener("input", this.handleInput) in regular JavaScript.
    */
  render() {
    return html`
      <h2>${this.isEdit ? "Edit Game" : "Add New Game"}</h2>
      <div class="form-container">
        <form class="form" @submit="${this.handleSubmit}">
          <div class="form-group">
            <label for="nama_game">Nama Game</label>
            <input
              type="text"
              name="nama_game"
              id="nama_game"
              placeholder="Enter game name"
              .value="${this.game.nama_game}"
              @input="${this.handleInput}"
              required
            />
          </div>
          <div class="form-group">
            <label for="developer">Developer</label>
            <input
              type="text"
              name="developer"
              id="developer"
              placeholder="Enter developer name"
              .value="${this.game.developer}"
              @input="${this.handleInput}"
              required
            />
          </div>
          <div class="form-group">
            <label for="genre">Genre</label>
            <input
              type="text"
              name="genre"
              id="genre"
              placeholder="Enter game genre"
              .value="${this.game.genre}"
              @input="${this.handleInput}"
              required
            />
          </div>
          <div class="form-group">
            <label for="harga">Harga</label>
            <input
              type="number"
              name="harga"
              id="harga"
              placeholder="Enter price"
              .value="${this.game.harga}"
              step="0.01"
              @input="${this.handleInput}"
              required
            />
          </div>
          <button type="submit">
            ${this.isEdit ? "Update Game" : "Add Game"}
          </button>
        </form>
      </div>
    `;
  }
}

customElements.define("game-form", GameForm);
