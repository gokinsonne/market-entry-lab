# Market Entry Lab payout calculator

[Open the live calculator](https://market-entry-lab.onrender.com/)

A dependency-free static utility for fixed-payout arithmetic. It converts profit percentage and total-return multiplier quotes, shows winning/loss cash outcomes and the mathematical break-even win rate, and clearly labels a hypothetical equal-count example. No market predictions, accounts or server-side data collection. A separately labelled platform-notes section links to our existing Telegram demo/account guide and payment FAQ; the guide contains affiliate links. This site does not link directly to a broker registration or deposit form.

For example, an 80% profit payout and a 1.8× total return are equivalent. With a $10 stake, a win earns $8 and a loss costs $10. Fifty wins and fifty losses produce a hypothetical $100 loss before fees, with a break-even win rate of about 55.56%. The tool does not estimate the probability of winning.

Serve `dist/` with a static HTTP server. Tests: `node --test tests/maths.test.mjs` (Node 20+). Render static site: build command `true`, publish directory `dist`, branch `main`.

The published site includes a canonical URL, Open Graph text metadata, `robots.txt` and a one-page `sitemap.xml`. These help identify and discover the existing calculator; they do not guarantee crawling, indexing, search ranking or traffic.

Assumptions: every loss loses the full stake, fixed payout, no fees or refunds. USD is the calculator's example currency. Supported quote precision: up to6 decimal places for profit percentage and8 for total-return multiplier; unsupported precision is rejected. Cash is displayed to the nearest cent and break-even rate to two decimal places. Inputs stay in the browser; linked third-party sites have their own policies.

The original Market Entry Lab SVG mark is supplied with the project. No third-party visual assets or font files are redistributed.
