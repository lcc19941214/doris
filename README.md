# Doris ![inspired by Dool](https://img.shields.io/badge/inspired%20by-Dool-orange.svg)

> Promise based XMLHttpRequest lib for the browser

## install

```bash
$ npm i --save-dev doris-request
```

## Usage

```js
import doris from 'doris-request';

doris
  .get('http://achuan.me', { hello: 'world' }) // http://achuan.me?hello=world
  .then(res => {
    const { body, status } = res;
    console.log(status); // 200
  })
  .catch(console.err);

doris
  .create({
    method: 'post',
    url: 'http://achuan.me',
    data: { hello: 'world' }
  })
  .then(res => {
    const { body, status } = res;
    console.log(status); // 200
  })
  .catch(console.err); // status 405
```
