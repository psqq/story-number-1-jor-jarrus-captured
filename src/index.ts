import App from './app';

async function main() {
    const app = new App();
    eval('window.app = app');
    await app.load();
    app.init();
    app.run();
}

main();
