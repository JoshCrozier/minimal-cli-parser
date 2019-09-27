'use strict';

const expect = require('chai').expect;
const parser = require('./../index.js');

describe('minimal-cli-parser', () => {
  it('should return an object without commands when no arguments are provided', () => {
    const parsed = parser();

    expect(parsed).to.deep.equal({ _: [] });
  });

  it('should return an object without commands when provided with an empty array', () => {
    const parsed = parser([]);

    expect(parsed).to.deep.equal({ _: [] });
  });

  it('should throw a type error if strings are not passed in the arguments array', () => {
    expect(() => parser([1, {}, []])).to.throw(TypeError);
  });

  it('should parse a boolean flag', () => {
    const parsed = parser(['--alpha']);

    expect(parsed).to.have.property('alpha', true);
    expect(parsed).to.have.property('_').with.length(0);
  });

  it('should parse a shorthand boolean flag', () => {
    const parsed = parser(['-a']);

    expect(parsed).to.have.property('a', true);
    expect(parsed).to.have.property('_').with.length(0);
  });

  it('should support multiple boolean flags', () => {
    const parsed = parser(['--alpha', '--beta', '--gamma', '-d']);

    expect(parsed).to.have.property('alpha', true);
    expect(parsed).to.have.property('beta', true);
    expect(parsed).to.have.property('gamma', true);
    expect(parsed).to.have.property('d', true);
    expect(parsed).to.have.property('_').with.length(0);
  });

  it('should expand shorthand flags that are grouped', () => {
    const parsed = parser(['-abc']);

    expect(parsed).to.have.property('a', true);
    expect(parsed).to.have.property('b', true);
    expect(parsed).to.have.property('c', true);
    expect(parsed).to.have.property('_').with.length(0);
  });

  it('should support flags with string values', () => {
    const parsed = parser(['--alpha', 'value1', '-b', 'value2']);

    expect(parsed).to.have.property('alpha', 'value1');
    expect(parsed).to.have.property('b', 'value2');
    expect(parsed).to.have.property('_').with.length(0);
  });

  it('should support implicit type coercion for flags with number values', () => {
    const parsed = parser(['--alpha', '1', '-b', '2']);

    expect(parsed).to.have.property('alpha', 1);
    expect(parsed).to.have.property('b', 2);
    expect(parsed).to.have.property('_').with.length(0);
  });

  it('should support decimal values', () => {
    const parsed = parser(['--alpha', '1.0', '--beta', '2.9999', '--gamma', '3.', '-d', '.4', '-e', '0.5']);

    expect(parsed).to.have.property('alpha', 1.0);
    expect(parsed).to.have.property('beta', 2.9999);
    expect(parsed).to.have.property('gamma', 3);
    expect(parsed).to.have.property('d', 0.4);
    expect(parsed).to.have.property('e', 0.5);
    expect(parsed).to.have.property('_').with.length(0);
  });

  it('should set the value of the last shorthand flag in a group', () => {
    const parsed = parser(['-abc', 'value', '--delta', '1']);

    expect(parsed).to.have.property('a', true);
    expect(parsed).to.have.property('b', true);
    expect(parsed).to.have.property('c', 'value');
    expect(parsed).to.have.property('delta', 1);
    expect(parsed).to.have.property('_').with.length(0);
  });

  it('should set the value of a flag if using an equal sign', () => {
    const parsed = parser(['--alpha=1', '-b=2', '--gamma=345']);

    expect(parsed).to.have.property('alpha', 1);
    expect(parsed).to.have.property('b', 2);
    expect(parsed).to.have.property('gamma', 345);
    expect(parsed).to.have.property('_').with.length(0);
  });

  it('should push command arguments to the _ property', () => {
    const parsed = parser(['command', '--alpha', '1', '--beta', '-g', '2', '--delta=value']);

    expect(parsed).to.have.property('alpha', 1);
    expect(parsed).to.have.property('beta', true);
    expect(parsed).to.have.property('g', 2);
    expect(parsed).to.have.property('delta', 'value');
    expect(parsed).to.have.property('_').that.contains('command');
  });

  it('should handle hyphenated flags', () => {
    const parsed = parser(['command', '--output-path', './results', '--has-multiple-hyphens', '--has--odd---hyphen-usage']);

    expect(parsed).to.have.property('output-path', './results');
    expect(parsed).to.have.property('has-multiple-hyphens', true);
    expect(parsed).to.have.property('has--odd---hyphen-usage', true);
  });

  it('should convert hyphenated flags to camel case', () => {
    const parsed = parser(['command', '--output-path', './results', '--has-multiple-hyphens', '--has--odd---hyphen-usage']);

    expect(parsed).to.have.property('outputPath', './results');
    expect(parsed).to.have.property('hasMultipleHyphens', true);
    expect(parsed).to.have.property('hasOddHyphenUsage', true);
  });

  it('should handle spacing consistently', () => {
    const parsed = parser(['-a123', '-bc456', '--beta456', '--gamma=value1', '-d=value2', '-e', '-fg90', '-x', '7', '-y=8.9', '-z', '1.2']);

    expect(parsed).to.have.property('a', 123);
    expect(parsed).to.have.property('b', true);
    expect(parsed).to.have.property('c', 456);
    expect(parsed).to.have.property('beta456', true);
    expect(parsed).to.have.property('gamma', 'value1');
    expect(parsed).to.have.property('d', 'value2');
    expect(parsed).to.have.property('e', true);
    expect(parsed).to.have.property('f', true);
    expect(parsed).to.have.property('g', 90);
    expect(parsed).to.have.property('x', 7);
    expect(parsed).to.have.property('y', 8.9);
    expect(parsed).to.have.property('z', 1.2);
    expect(parsed).to.have.property('_').with.length(0);
  });
});
