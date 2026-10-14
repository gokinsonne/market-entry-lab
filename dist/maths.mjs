export function calculate(stake, quote, mode = 'percent') {
  if (!Number.isFinite(stake) || stake < 0.01 || stake > 1000000) {
    throw new RangeError('Enter a stake between $0.01 and $1,000,000.');
  }
  if (!['percent', 'multiplier'].includes(mode)) throw new RangeError('Choose a payout format.');
  if (!Number.isFinite(quote)) throw new RangeError('Enter a payout.');
  if (mode === 'percent' && (quote < 0 || quote > 1000)) throw new RangeError('Enter a profit payout from 0% to 1,000%.');
  if (mode === 'multiplier' && (quote < 1 || quote > 11)) throw new RangeError('Enter a total return from 1× to 11×, including the stake.');
  const profitRatio = mode === 'percent' ? quote / 100 : quote - 1;
  const winProfit = stake * profitRatio;
  return {
    stake, profitRatio, profitPercent: profitRatio * 100,
    returnMultiplier: 1 + profitRatio, winProfit,
    totalReturn: stake + winProfit, loss: -stake,
    breakEvenPercent: 100 / (1 + profitRatio),
    fiftyFiftyNet: 50 * winProfit - 50 * stake,
  };
}

export function parseInput(value) {
  return value.trim() === '' ? NaN : Number(value);
}
