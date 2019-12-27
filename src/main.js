import App from "./app";

async function main() {
    const app = new App();
    await app.load();
    app.init();
    app.run();
}

document.body.onload = () => {
    main();
};
