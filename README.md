## Wardley EVTP Role Quiz

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

An elegant, single-file quiz that helps you discover which role from Simon Wardley’s EVTP framework best fits you: Explorer, Villager, or Town Planner. Built with vanilla HTML/JS and Tailwind via CDN — no build step, no dependencies.

### Features
- **Zero setup**: open `index.html` in a browser
- **Responsive UI**: TailwindCSS + Inter font
- **Simple logic**: 8 questions, randomized answers, progress bar
- **Tie handling**: fair random pick among tied top roles
- **Accessible touches**: focus styles, Escape closes the framework modal

### Quick start
- **Option A (double-click)**: Open `index.html` in your browser.
- **Option B (local server)**: Useful if you prefer a local URL.

```bash
# From the project root
python3 -m http.server 8080
# then open http://localhost:8080
```

### What is EVTP?
EVTP stands for Explorers, Villagers, and Town Planners — three complementary roles in Wardley’s strategy framework. This quiz offers a lightweight way to self-assess which role you naturally lean toward.

### Project structure
```
.
├── EVTP.011.jpeg        # Framework image (used on results + modal)
└── index.html           # Entire app (UI, questions, logic)
```

### Customize the quiz
All content and logic live inside `index.html`.

- **Questions**: Update the `quizQuestions` array. Each answer maps to a `type` of `explorer`, `villager`, or `townPlanner`.
- **Results copy**: Edit the `resultsData` object (titles/descriptions for each role).
- **Styling**: Change Tailwind utility classes in the HTML for colors, spacing, etc. You can also add custom CSS in the `<style>` block at the top of the file.
- **Add a role**: Add a new `type` value in answers, extend the `scores` object’s keys, and add an entry to `resultsData`. Ensure the type strings match across all three.

### How scoring works
- Each selected answer increments the score for its `type`.
- The highest total wins.
- If there’s a tie between top roles, a fair random choice is made among the tied roles.

### Tech stack
- HTML + vanilla JavaScript
- Tailwind CSS via CDN
- Google Fonts (Inter) via CDN

### Deploy
Because this is a static site, any static host works.

- **GitHub Pages**
  1. Push this repository to GitHub
  2. In your repo, go to Settings → Pages
  3. Set Source to “Deploy from a branch”, branch `main` (root)
  4. Save — your site will be available shortly at `https://<username>.github.io/<repo>/`
  5. See the official docs: [GitHub Pages](https://docs.github.com/en/pages)

### Accessibility
- Uses semantic buttons and visible focus rings
- Modal supports closing with the Escape key
- Consider adding focus trapping in the modal and ARIA `role="dialog"` if you want stricter accessibility behavior

### Attribution
- The EVTP framework is attributed to Simon Wardley. Learn more at [Wardley Maps community resources](https://learnwardleymapping.com/).
- The included framework image `EVTP.011.jpeg` is sourced from Simon Wardley's blog post ["How to organise yourself: a dangerous path"](https://blog.gardeviance.org/2023/12/how-to-organise-yourself-dangerous-path.html) and is used for illustration with permission through fair use. All rights remain with the original author.

### License
- Code in this repository is released under the [MIT License](./LICENSE) (no warranty).
- The included image `EVTP.011.jpeg` is not covered by the MIT license; it may be subject to its own terms by the original author.

### Contributing
Issues and pull requests are welcome! For significant changes, open an issue first to discuss what you’d like to improve.

---

If you build something fun with this, share it! PRs with additional questions, improved copy, or enhanced accessibility are especially appreciated.
