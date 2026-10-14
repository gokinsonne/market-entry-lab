function profitUnitsFromQuote(quote, mode) {
  if (!['percent', 'multiplier'].includes(mode)) throw new RangeError('Choose a payout format.');
  if (!Number.isFinite(quote)) throw new RangeError('Enter a payout.');
  if (mode === 'percent' && (quote < 0 || quote > 1000)) throw new RangeError('Enter a profit payout from 0% to 1,000%.');
  if (mode === 'multiplier' && (quote < 1 || quote > 11)) throw new RangeError('Enter a total return from 1× to 11×, including the stake.');
  const scale = mode === 'percent' ? 1000000 : 100000000;
  const scaled = quote * scale;
  const units = Math.round(scaled);
  if (Number(quote.toFixed(mode === 'percent' ? 6 : 8)) !== quote) {
    throw new RangeError(`Use at most ${mode === 'percent' ? '6' : '8'} decimal places for this payout format.`);
  }
  return mode === 'percent' ? units : units - 100000000;
}

function formatUnits(units, decimals) {
  const scale = 10 ** decimals;
  const whole = Math.floor(units / scale);
  const fraction = String(units % scale).padStart(decimals, '0').replace(/0+$/, '');
  return `${whole}${fraction ? '.' + fraction : ''}`;
}

export function convertQuote(quote, from, to) {
  if (!['percent', 'multiplier'].includes(to)) throw new RangeError('Choose a payout format.');
  const units = profitUnitsFromQuote(quote, from);
  return to === 'percent' ? formatUnits(units, 6) : formatUnits(units + 100000000, 8);
}

export function calculate(stake, quote, mode = 'percent') {
  if (!Number.isFinite(stake) || stake < 0.01 || stake > 1000000) {
    throw new RangeError('Enter a stake between $0.01 and $1,000,000.');
  }
  const profitRatio = profitUnitsFromQuote(quote, mode) / 100000000;
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
