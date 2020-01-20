# Typechess

This is a simple chess engine written in Typescript, minified with [Webpack](https://webpack.js.org/).  This was originally written in ES6.  I've been translating it to TS and adding tests via [Mocha](https://mochajs.org/).

This is simply my way of figuring out chess for JavaScript, it's not intended to be redistributable.  If you want a library that is redistributable to build your own chess game, use the official [Chessboard.js](https://chessboardjs.com/).  If you want to see what this thing can do because you're curious, read on.

## Installation and Running the Dev Build

1. Download the archive (.zip) and unpack it to your desired destination (e.g. `C:\Dev\js\chess`).
2. Install project dependencies (Babel and Webpack):
    ```
    cd C:\Dev\ts\chess
    npm install
    ```
3. Build the dev version of the bundle.  The dev version is not committed to VCS.  This prevents an old version of the dev build from being persisted in VCS and distributed with the code:
    ```
    npm run build
    ```
4. Run the development server:
    ```
    npm start
    ```
5. Visit the appropriate URL in a browser (defaults to http://localhost:3000, configured in `config/webpack.dev.js`).
6. 