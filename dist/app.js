import { calculate, parseInput } from './maths.mjs';

const form = document.getElementById('payout-form');
const stakeInput = document.getElementById('stake');
const payoutInput = document.getElementById('payout');
const error = document.getElementById('error-message');
const results = document.getElementById('results');
const scenario = document.getElementById('scenario');
const invalidResults = document.getElementById('invalid-results');
const equivalence = document.getElementById('equivalence');
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const compactNumber = value => new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(value);
const setText = (id, value) => { document.getElementById(id).textContent = value; };
const signedMoney = value => `${value < 0 ? '−' : value > 0 ? '+' : ''}${currency.format(Math.abs(value))}`;
let currentMode = 'percent';

function render() {
  const stake = parseInput(stakeInput.value);
  const quote = parseInput(payoutInput.value);
  const invalidStake = !Number.isFinite(stake) || stake < 0.01 || stake > 1000000;
  stakeInput.setAttribute('aria-invalid', String(invalidStake));
  payoutInput.setAttribute('aria-invalid', String(!Number.isFinite(quote) || (currentMode === 'percent' ? quote < 0 || quote > 1000 : quote < 1 || quote > 11)));
  try {
    const values = calculate(stake, quote, currentMode);
    error.hidden = true;
    error.textContent = '';
    results.hidden = false;
    scenario.hidden = false;
    invalidResults.hidden = true;
    equivalence.hidden = false;
    equivalence.textContent = `${compactNumber(values.profitPercent)}% profit = ${compactNumber(values.returnMultiplier)}× total return`;
    const breakEven = document.getElementById('break-even');
    breakEven.replaceChildren(document.createTextNode(values.breakEvenPercent.toFixed(2)));
    const percentSign = document.createElement('span');
    percentSign.textContent = '%';
    breakEven.append(percentSign);
    setText('result-explanation', values.profitRatio === 0
      ? 'Every trade must win just to break even. With no winning profit, finishing ahead is impossible in this model.'
      : `The exact break-even rate is 100 ÷ (1 + ${compactNumber(values.profitRatio)})%. Finishing ahead requires a higher win rate, before fees. Display rounded to two decimals.`);
    setText('win-profit', signedMoney(values.winProfit));
    setText('total-return', currency.format(values.totalReturn));
    setText('loss', signedMoney(values.loss));
    setText('formula', `Break-even = 1 ÷ (1 + ${compactNumber(values.profitRatio)})`);
    const net = Math.abs(values.fiftyFiftyNet) < 1e-8 ? 0 : values.fiftyFiftyNet;
    setText('scenario-net', signedMoney(net));
    document.getElementById('scenario-net').classList.toggle('positive', net >= 0);
    setText('scenario-calculation', `50 × ${currency.format(values.winProfit)} − 50 × ${currency.format(stake)} = ${signedMoney(net)}`);
  } catch (err) {
    error.textContent = err.message;
    error.hidden = false;
    results.hidden = true;
    scenario.hidden = true;
    equivalence.hidden = true;
    invalidResults.hidden = false;
  }
}

form.addEventListener('submit', event => event.preventDefault());
form.addEventListener('input', event => {
  if (event.target.name === 'mode') {
    const quote = parseInput(payoutInput.value);
    const nextMode = event.target.value;
    if (Number.isFinite(quote) && nextMode !== currentMode) {
      const profitRatio = currentMode === 'percent' ? quote / 100 : quote - 1;
      payoutInput.value = String(Number((nextMode === 'percent' ? profitRatio * 100 : 1 + profitRatio).toFixed(8)));
    }
    currentMode = nextMode;
    const percent = currentMode === 'percent';
    document.getElementById('payout-label').firstChild.textContent = percent ? 'Profit payout ' : 'Total return ';
    setText('payout-unit', percent ? '%' : '×');
    payoutInput.min = percent ? '0' : '1';
    payoutInput.max = percent ? '1000' : '11';
    setText('payout-help', percent ? 'Profit on a winning trade, excluding your stake.' : 'Total amount returned on a win, including your stake.');
  }
  render();
});

render();
