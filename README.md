## html-require-loader

Webpack loader for including requiring other HTML files with a <require> tag.

Allows for including HTML files like:

```html
<body>
  <h1 id="foo"></h1>
  <h2 id="bar"></h2>

  <require path="baz.html">
  <require path="templates/qux.html">
</body>
```

### Usage

```
npm install --save html-require-loader
```

#### Configuration

| Option         | Description                         | Default                          |
|----------------|-------------------------------------|----------------------------------|
| root           | Root path to look for templates.    | Same path as required HTML file. |
| markerPrefix   | Prefix override for comment marker. | Same path as required HTML file. |

```js
var path = require('path');

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.html/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'html-require-loader',
            options: {
              root: path.resolve(__dirname, 'src'),
              markerPrefix: '/path/to/file'
            }
          }
        ]
      }
    ]
  }
  // ...
}
```

And your require...

```js
require('./index.html');
```

And then requiring or including other HTML files.

```html
<body>
  <h1 id="foo"></h1>
  <h2 id="bar"></h2>

  <require path="baz.html"></require>
  <require path="templates/qux.html"></require>
</body>
```

Will be transformed into something like:

```html
<body>
  <h1 id="foo"></h1>
  <h2 id="bar"></h2>

  <!-- <require path="/path/to/baz.html"> -->
  <h3 id="baz"></h3>
  <!-- </require> -->

  <!-- <require path="/path/to/qux.html"> -->
  <h4 id="qux"></h4>
  <!-- </require> -->
</body>
```

The HTML comments (require markers) are left in to potentially assist with
other loaders for sourcemaps and hot reloading.
