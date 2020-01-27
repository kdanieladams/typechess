# Typechess

This is a simple chess engine written in Typescript and minified with [Webpack](https://webpack.js.org/).  This was originally written in ES6.  I've been translating it to TS and adding tests via [Mocha](https://mochajs.org/).

This is simply my way of figuring out chess for JavaScript, it's not intended to be redistributable.  If you want a library that is redistributable to build your own chess game, use the official [Chessboard.js](https://chessboardjs.com/).  If you want to see what this thing can do because you're curious, read on.

## Usage

1. Get a copy of the project.  This can be done one of two ways:
    
    i. Download the archive (.zip) and unpack it to your desired destination (e.g. `C:\Dev\ts\typechess`).
    
    ii. Clone the repository to your desired destination:
    ```
    cd C:\Dev\ts
    git clone git@github.com:kdanieladams/typechess.git
    ```

2. Install project dependencies (Webpack, Mocha, and Typescript):
    ```
    cd C:\Dev\ts\typechess
    npm install
    ```
3. Build the dev version and start the dev server (*webpack-dev-server*)
    ```
    npm start
    ```
4. Visit the appropriate URL in a browser (defaults to http://localhost:3000, port can be configured in `config/webpack.dev.js`).

## Deployment

1. Build the prod version
```
npm run build
```
2. Upload the contents of the `/dist` directory to your webserver.
