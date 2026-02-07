const CONFIG_KEY = 'portfolio_admin_config';

const Config = {
    token: '',
    repo: '',
    pin: '1234',

    load() {
        try {
            const saved = localStorage.getItem(CONFIG_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                this.token = data.token || '';
                this.repo = data.repo || '';
                this.pin = data.pin || '1234';
            }
        } catch (e) {
            console.warn('Config load failed, using defaults');
        }
    },

    save() {
        try {
            const data = {
                token: this.token,
                repo: this.repo,
                pin: this.pin
            };
            localStorage.setItem(CONFIG_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Config save failed:', e);
            return false;
        }
    },

    isConfigured() {
        return this.token && this.repo && this.token.startsWith('ghp_');
    }
};

Config.load();
