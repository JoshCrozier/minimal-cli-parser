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

  it('should support multiple boolean flags', () => {
    const parsed = parser(['--alpha', '--beta', '--gamma']);

    expect(parsed).to.have.property('alpha', true);
    expect(parsed).to.have.property('beta', true);
    expect(parsed).to.have.property('gamma', true);
    expect(parsed).to.have.property('_').with.length(0);
  });

  it('should support flags with string values', () => {
    const parsed = parser(['--alpha', 'value1']);

    expect(parsed).to.have.property('alpha', 'value1');
    expect(parsed).to.have.property('_').with.length(0);
  });

  it('should support implicit type coercion for flags with number values', () => {
    const parsed = parser(['--alpha', '1']);

    expect(parsed).to.have.property('alpha', 1);
    expect(parsed).to.have.property('_').with.length(0);
  });

  it('should support decimal values', () => {
    const parsed = parser(['--alpha', '1.0', '--beta', '2.9999', '--gamma', '3.', '--delta', '.4']);

    expect(parsed).to.have.property('alpha', 1.0);
    expect(parsed).to.have.property('beta', 2.9999);
    expect(parsed).to.have.property('gamma', 3);
    expect(parsed).to.have.property('delta', 0.4);
    expect(parsed).to.have.property('_').with.length(0);
  });

  it('should set the value of a flag if using an equal sign', () => {
    const parsed = parser(['--alpha=value1', '--beta=value2']);

    expect(parsed).to.have.property('alpha', 'value1');
    expect(parsed).to.have.property('beta', 'value2');
    expect(parsed).to.have.property('_').with.length(0);
  });

  it('should push command arguments to the _ property', () => {
    const parsed = parser(['command', '--alpha', 'value1', '--beta', '--gamma=value2']);

    expect(parsed).to.have.property('alpha', 'value1');
    expect(parsed).to.have.property('beta', true);
    expect(parsed).to.have.property('gamma', 'value2');
    expect(parsed).to.have.property('_').that.contains('command');
  });

  it('should handle spacing consistently', () => {
    const parsed = parser(['--alpha123', '--beta=value1']);

    expect(parsed).to.have.property('alpha123', true);
    expect(parsed).to.have.property('beta', 'value1');
    expect(parsed).to.have.property('_').with.length(0);
  });
});
