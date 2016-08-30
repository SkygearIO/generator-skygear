## Scaffolding for Skygear JS App

This generator extend
[generator-react-webpack](https://github.com/react-webpack-generators/generator-react-webpack)

You can start create an react app with [Skygear](https://skygear.io) by the
following steps:

---

## Installation

```bash
# Make sure both is installed globally
npm install -g yo
npm install -g generator-skygear
```

## Setting up projects

```bash
# Create a new directory, and `cd` into it:
mkdir my-new-project && cd my-new-project

# Run the generator
yo skygear
```

You will be prompt for endpoint and api key which can obtain from
https://portal.skygear.io/app/info

## Basic Usage
The following commands are available in your project:
```bash
# Start for development
npm start # or
npm run serve

# Start the dev-server with the dist version
npm run serve:dist

# Just build the dist version and copy static files
npm run dist

# Run unit tests
npm test

# Auto-run unit tests on file changes
npm run test:watch

# Lint all files in src (also automatically done AFTER tests are run)
npm run lint

# Clean up the dist directory
npm run clean

# Just copy the static assets
npm run copy
```

For more advance usage and option detail, please refer to [README.md of
generator-react-webpack]
(https://github.com/react-webpack-generators/generator-react-webpack)
