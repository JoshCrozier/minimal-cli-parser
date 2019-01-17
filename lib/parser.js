'use strict';

function parser(argv) {
  const args = normalizeArgs(argv || []);
  const results = { _: [] };

  iterateArgs(args, (arg, prevArg, nextArg) => {
    const identifier = getFlagIdentifier(arg);

    if (isFlag(arg)) {
      const isBool = nextArg === null || isFlag(nextArg);

      results[identifier] = isBool ? true : getValueImplicitType(nextArg);
    } else {
      if (prevArg === null || !isFlag(prevArg)) {
        results._.push(identifier);
      }
    }
  });

  return results;
}

function normalizeArgs(argv) {
  validateInputArgv(argv);

  const normalized = argv
    .join(' ')
    .replace(/((?:^|\s)-[a-z]+)/ig, '$1 ')
    .split(/\s+|=/)
    .map(flag => normalizeFlag(flag));

  return flatten(normalized).filter(value => value);
}

function normalizeFlag(value) {
  if (isFlagGroup(value)) {
    return value
      .split('')
      .filter(value => /[a-z]/i.test(value))
      .map(value => `-${value}`);
  }

  return value;
}

function iterateArgs(args, callback) {
  args.forEach((arg, index) => {
    const prev = args[index - 1] || null;
    const next = args[index + 1] || null;

    callback(arg, prev, next);
  });
}

function validateInputArgv(argv) {
  if (argv.some(value => typeof value !== 'string')) {
    throw new TypeError('The parser method expects an array of strings.');
  }
}

function getFlagIdentifier(flag) {
  return flag.replace(/-+/g, '');
}

function isFlag(value) {
  return /^-[a-z]|--[a-z\d]+$/i.test(value);
}

function isFlagGroup(value) {
  return /^-[a-z\d]{2,}$/i.test(value);
}

function getValueImplicitType(value) {
  return !isNaN(value) ? +value : value;
}

function flatten(array) {
  return [].concat.apply([], array);
}

module.exports = parser;
