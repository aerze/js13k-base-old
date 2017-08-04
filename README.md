# js13k-base
Boilerplate template for making very small games


### Usage
Run `npm install`

- `npm start`
  - builds files from `./src/index.js` as an entry point
  - places files into `./build`
  - serves `./build`
  - watches `./src` for specific file types

- `npm test` (doesn't actually run tests)
  - builds minified files from `./src/index.js` as an entry point
  - places files into `./build`
  - builds a single html file and moves assets into `./compile`
  - serves `./compile`
  - watches `./src` for specific file types

- `npm run package`
  - builds minified files from `./src/index.js` as an entry point
  - places files into `./build`
  - builds a single html file and moves assets into `./compile`
  - zips `./compile` into a `./releases`
