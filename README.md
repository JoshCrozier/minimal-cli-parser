# minimal-cli-parser

[![npm package](https://nodei.co/npm/minimal-cli-parser.png?downloads=true)](https://www.npmjs.com/package/minimal-cli-parser)

[![NPM version](https://img.shields.io/npm/v/minimal-cli-parser.svg?style=flat-square)](https://www.npmjs.com/package/minimal-cli-parser)
[![Build status](https://img.shields.io/travis/JoshCrozier/minimal-cli-parser.svg?style=flat-square)](https://travis-ci.org/JoshCrozier/minimal-cli-parser)
[![Coverage](https://img.shields.io/codecov/c/github/JoshCrozier/minimal-cli-parser.svg?style=flat-square)](https://codecov.io/github/JoshCrozier/minimal-cli-parser)
[![Vulnerabilities](https://snyk.io/test/npm/minimal-cli-parser/badge.svg?style=flat-square)](https://snyk.io/test/npm/minimal-cli-parser)

The command-line parser used by the package [minimal-cli](https://github.com/JoshCrozier/minimal-cli).

- Useful for parsing [`process.argv`](https://nodejs.org/docs/latest/api/process.html)
- Supports regular flags `--flag` and shorthand flags `-f`
- Automatically infers variable types by default

## Installation

    $ npm install minimal-cli-parser --save

## Usage

```js
const parser = require('minimal-cli-parser');
const args = ['command', '--alpha', '1', '--beta', '-g', '2', '--delta=value'];
const parsed = parser(args);

console.log(parsed);
```

Output:

```json
{
  "_": ["command"],
  "alpha": 1,
  "beta": true,
  "g": 2,
  "delta": "value"
}
```

## License

[MIT License](https://opensource.org/licenses/MIT)

Copyright (c) 2019 [Josh Crozier](https://joshcrozier.com)