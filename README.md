# Doris ![inspired by Dool](https://img.shields.io/badge/inspired%20by-Dool-orange.svg)

> Promise based XMLHttpRequest lib for the browser

```js
import doris from 'doris';

doris
  .get('http://achuan.me', { hello: 'world' })
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
  .catch(console.err);
```
