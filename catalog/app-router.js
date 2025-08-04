import { LitElement, html } from '/lit-core.min.js';
import '/game-catalog.js';
import '/game-form.js';

class AppRouter extends LitElement {
    static properties = {
        route: { type: String },
        gameId: { type: String }
    };

    constructor() {
        super();
        this.updateRoute();
        window.onpopstate = () => {
            this.updateRoute();
        };
    }

    updateRoute() {
        const path = window.location.pathname.replace(/^\/+/, '');
        const parts = path.split('/');
        this.route = parts[0] || 'catalog';
        this.gameId = parts[1] || null;
        this.requestUpdate();
    }

    navigateTo(route) {
        window.history.pushState({}, '', route);
        this.updateRoute();
    }

    render() {
        return html`
            ${this.route === 'catalog' ? html`
                <game-catalog .navigateTo="${this.navigateTo.bind(this)}"></game-catalog>
            ` : this.route === 'add' ? html`
                <game-form></game-form>
            ` : this.route === 'edit' && this.gameId ? html`
                <game-form .gameId="${this.gameId}" .isEdit="${true}"></game-form>
            ` : html`
                <p>Page not found</p>
            `}
        `;
    }
}

customElements.define('app-router', AppRouter);
