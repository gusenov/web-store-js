```js
var WebStore = require("web-store"),
    WebTreeStore = require("web-store/tree");
``` 

# Публикация npm-пакета

Фиксация изменений:

```bash
$ git add .
$ git commit -S -m "0.0.4"
$ git tag -s v0.0.4 -m 'signed 0.0.4 tag'
```

или

```bash
$ npm version patch
```

Отправка на [github.com](https://github.com/gusenov/web-store-js):

```bash
$ git push --tags origin master:master
```

Отправка на [npmjs.com](https://www.npmjs.com/package/web-store):

```bash
$ npm login
$ npm config ls
$ npm publish
```
