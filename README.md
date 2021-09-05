# TikTok clone example

This project is an example for Jamstack web app using:
- React bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
- Serverless function from netlify-cli.

Original example by [@kubowania](https://github.com/kubowania/stargate-tik-tok).

## Create the project
```bash
npx create-react-app tiktok-clone
cd tiktok-clone
npm start
```

## Install required packages
```bash
npm install react-router-dom --save
npm install netlify-cli --save-dev
npm install axios --save
npm install faker --save
```
Notes:
- `netlify-cli` to use serverless function
- `axios` to make http request
- `faker` to generate a unique `uuid` for storing objects.


## AstraDB (DataStax)
You can use AstraDB API to interact with Cassandra cluster.

1- First you'll need to install `astrajs`:
```bash
npm install @astrajs/collections --save
```

2- Then you need define environment variables in your system or at `.env` config file (`netlify` will automatically configure `.env` for you):
```bash
# You need to defined API keys:
export ASTRA_DB_ID={databaseid}
export ASTRA_DB_REGION={region}
export ASTRA_DB_APPLICATION_TOKEN={token}
```
3- Now you're ready to interact with Cassandra cluster:

You can use either Client with Nodejs using `ASTRA_DB_APPLICATION_TOKEN` like so:
```javascript
const { createClient } = require("@astrajs/collections");

// create an {astra_db} client
const astraClient = await createClient({
    astraDatabaseId: process.env.ASTRA_DB_ID,
    astraDatabaseRegion: process.env.ASTRA_DB_REGION,
    applicationToken: process.env.ASTRA_DB_APPLICATION_TOKEN,
});

// create a shortcut to the users collection in the app namespace/keyspace
// collections are created automatically
const usersCollection = astraClient.namespace("app").collection("users");

// get a single user by document id
const user = await usersCollection.get("cliff@wicklow.com");

// get a subdocument by path
const userBlogComments = await usersCollection.get("cliff@wicklow.com/blog/comments");

// search a collection of documents
const users = await usersCollection.find({ name: { $eq: "Cliff" } });

// find a single user
const user = await usersCollection.findOne({ name: { $eq: "dang" } });

// create a new document (a documentId is generated)
const user = await usersCollection.create({
  name: "New Guy",
});

// create a new user (specifying documentId)
const user = await usersCollection.create("cliff@wicklow.com", {
  name: "cliff",
});

// create a user subdocument
const user = await usersCollection.create("cliff@wicklow.com/blog", {
  title: "new blog",
});

// partially update user
const user = await usersCollection.update("cliff@wicklow.com", {
  name: "cliff",
});

// partially update a user subdocument
const userBlog = await usersCollection.update("cliff@wicklow.com/blog", {
  title: "my spot",
});

// replace a user subdocumet
const userBlog = await usersCollection.replace("cliff@wicklow.com/blog", {
  title: "New Blog",
});

// delete a user
const user = await usersCollection.delete("cliff@wicklow.com");

// delete a user subdocument
const userBlog = await usersCollection.delete("cliff@wicklow.com/blog");
```

or using the REST API using `username/password` like so:

```bash
# You need to defined API keys & username/password:
export ASTRA_DB_ID={databaseid}
export ASTRA_DB_REGION={region}
export ASTRA_DB_USERNAME={username}
export ASTRA_DB_PASSWORD={password}
```
REST API:
```javascript
const { createClient } = require("@astrajs/rest");

// create an {astra_db} client
const astraClient = await createClient({
    astraDatabaseId: process.env.ASTRA_DB_ID,
    astraDatabaseRegion: process.env.ASTRA_DB_REGION,
    username: process.env.ASTRA_DB_USERNAME,
    password: process.env.ASTRA_DB_PASSWORD,
});

const basePath = "/api/rest/v2/keyspaces/<namespace>/<collectionName>";

// get a single user by document id
const { data, status } = await astraClient.get(`${basePath}/<documentId>`);

// get a subdocument by path
const { data, status } = await astraClient.get(`${basePath}/<documentId>/<subdocument>/<subdocument>`);

// search a collection of documents
const { data, status } = await astraClient.get(basePath, {
  params: {
    where: {
      name: { $eq: "<documentId>" }
    }
  }
});

// create a new user without a document id
const { data, status } = await astraClient.post(basePath, {
  name: "<documentId>",
});

// create a new user with a document id
const { data, status } = await astraClient.put(`${basePath}/<documentId>`, {
  name: "cliff",
});

// create a user subdocument
const { data, status } = await astraClient.put(`${basePath}/<documentId>/<subdocument>`, {
  title: "new blog",
});

// partially update user
const { data, status } = await astraClient.patch(`${basePath}/<documentId>`, {
  name: "cliff",
});

// delete a user
const { data, status } = await astraClient.delete(`${basePath}/<documentId>`);
```
Read more at: https://docs.datastax.com/en/astra/docs/astra-collection-client.html


## Run with netlify
This allows you to use serverless function on netlify:
```bash
netlify dev
```
P.S. The app will start on `http://localhost:8888/#`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
