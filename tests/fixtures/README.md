# Test fixtures

This frozen demonstration configuration and its original MIT-licensed SVG studies test template behavior independently of the portfolio owner's content. Keep these fixtures when replacing or removing artwork under `public/images/`.

Unit tests and development-browser tests use these fixtures. The production smoke test reads the real `src/content/portfolio.json` and actual build, so custom portfolios (including zero projects) are still verified. The sharing-image path in the JSON is metadata-only; browser fixtures do not need to load it.
