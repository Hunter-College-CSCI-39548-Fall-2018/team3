# Biscuit README

The main repo for the Biscuit project.

DEMO: http://woof.synology.me:5000/

Install all dependencies:

```bash
npm install
```


## Commands

To run both the Webpack and Express server: 
```bash
npm start
```

Run only the Express server: 
```bash
npm run client-express
```

Run only the Webpack dev server: 
```bash
npm run client-react
```

Bundle React and its dependencies for production: 
```bash
npm run prestart:prod
```
## Paths

/config - Lists the webpack files that contain the settings for local dev and production.

/dist - Where the packaged files are located after Webpack compiles them.

/server - Logic for the Express server and Socket.IO

/src - All the React files are here.
