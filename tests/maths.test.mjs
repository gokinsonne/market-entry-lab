import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculate, convertQuote, parseInput } from '../dist/maths.mjs';

test('80% quote: a $10 win earns $8 and returns $18; loss costs $10', () => {
  const result = calculate(10, 80);
  assert.equal(result.winProfit, 8);
  assert.equal(result.totalReturn, 18);
  assert.equal(result.loss, -10);
  assert.ok(Math.abs(result.breakEvenPercent - 55.55555555555556) < 1e-10);
  assert.equal(result.fiftyFiftyNet, -100);
});
test('1.8x total return is equivalent to 80% profit', () => {
  const result = calculate(10, 1.8, 'multiplier');
  assert.equal(result.winProfit, 8);
  assert.equal(result.totalReturn, 18);
  assert.equal(result.fiftyFiftyNet, -100);
});
test('an 80% win on $8 after losing $1+$2+$4 leaves -$0.60', () => {
  assert.ok(Math.abs(calculate(8, 80).winProfit - 7 - (-0.60)) < 1e-10);
});
test('100% profit balances an equal count of wins and losses', () => {
  const result = calculate(17.25, 100);
  assert.equal(result.breakEvenPercent, 50);
  assert.equal(result.fiftyFiftyNet, 0);
});
test('zero profit requires 100% wins just to break even', () => {
  const result = calculate(10, 1, 'multiplier');
  assert.equal(result.breakEvenPercent, 100);
  assert.equal(result.winProfit, 0);
  assert.equal(result.fiftyFiftyNet, -500);
});
test('a >100% payout is supported, with a profitable 50/50 hypothetical', () => {
  const result = calculate(10, 150);
  assert.equal(result.breakEvenPercent, 40);
  assert.equal(result.fiftyFiftyNet, 250);
});
test('blank input is not silently treated as zero; range and finite guards hold', () => {
  assert.ok(Number.isNaN(parseInput('  ')));
  assert.equal(parseInput('1.8'), 1.8);
  for (const stake of [0, -1, Infinity, NaN, 1000001, 0.001]) assert.throws(() => calculate(stake, 80), RangeError);
  for (const quote of [-1, Infinity, NaN, 1001]) assert.throws(() => calculate(10, quote), RangeError);
  for (const quote of [0.8, 0, 11.01]) assert.throws(() => calculate(10, quote, 'multiplier'), RangeError);
  assert.throws(() => calculate(10, 80, 'other'), RangeError);
});
test('supported payout precision survives both mode switches without changing outcomes', () => {
  for (const percent of [0, 0.000001, 0.00004, 0.123456, 80, 123.456789, 1000]) {
    const multiplier = convertQuote(percent, 'percent', 'multiplier');
    const restored = convertQuote(Number(multiplier), 'multiplier', 'percent');
    assert.equal(Number(restored), percent);
    assert.deepEqual(calculate(1000000, Number(multiplier), 'multiplier'), calculate(1000000, percent));
  }
  assert.equal(convertQuote(0.00004, 'percent', 'multiplier'), '1.0000004');
  assert.ok(Math.abs(calculate(1000000, 0.00004).winProfit - 0.4) < 1e-10);
});
test('unsupported precision is rejected explicitly instead of silently rounding to zero', () => {
  assert.throws(() => calculate(1000000, 0.0000004), /6 decimal places/);
  assert.throws(() => convertQuote(0.0000004, 'percent', 'multiplier'), /6 decimal places/);
  assert.throws(() => calculate(1000000, 1.000000004, 'multiplier'), /8 decimal places/);
  assert.throws(() => calculate(10, 1e-15), /6 decimal places/);
  assert.throws(() => calculate(10, 1.000000000000004, 'multiplier'), /8 decimal places/);
});
