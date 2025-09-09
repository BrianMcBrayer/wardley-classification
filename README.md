## Wardley EVTP Role Quiz

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Now-blue?style=for-the-badge)](https://brianmcbrayer.github.io/wardley-classification/) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

An elegant, single-file quiz that helps you discover which role from Simon Wardley’s EVTP framework best fits you: Explorer, Villager, or Town Planner. Built with vanilla HTML/JS and Tailwind via CDN — no build step, no dependencies.

### Features
- **Zero setup**: open `index.html` in a browser
- **Responsive UI**: TailwindCSS + Inter font
- **Simple logic**: 8 questions, randomized answers, progress bar
- **Tie handling**: fair random pick among tied top roles
- **Accessible touches**: focus styles, Escape closes the framework modal
- **URL-based navigation**: Shareable links to specific questions and states
- **Browser history support**: Back/forward buttons work during navigation
- **State persistence**: Quiz progress survives page refreshes (for 1 hour)

### Navigation Features
The quiz now supports modern web navigation with shareable URLs:

- **Home**: `#/` or just the base URL
- **Questions**: `#/quiz/1`, `#/quiz/2`, etc. (up to `#/quiz/8`)
- **Results**: `#/results`
- **Framework Modal**: `#/framework`

**Examples:**
- Direct link to question 3: `https://yourusername.github.io/yourrepo/#/quiz/3`
- Share your results: `https://yourusername.github.io/yourrepo/#/results`
- Link to framework explanation: `https://yourusername.github.io/yourrepo/#/framework`

This works perfectly on GitHub Pages and other static hosting services using hash-based routing.

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

### Live Demo
🚀 **[Try the quiz now!](https://brianmcbrayer.github.io/wardley-classification/)**

The live version is automatically deployed via GitHub Actions whenever changes are pushed to the main branch. You can also view the original framework by Simon Wardley [here](https://blog.gardeviance.org/2023/12/how-to-organise-yourself-dangerous-path.html).

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
- [page.js](https://github.com/visionmedia/page.js) for routing
- Tailwind CSS via CDN
- Google Fonts (Inter) via CDN

### Deploy
Because this is a static site, any static host works.

- **GitHub Pages** (Automatic via GitHub Actions)
  1. Push this repository to GitHub (already done!)
  2. The site automatically deploys when you push to the `main` branch
  3. Check the "Actions" tab in your repository to see deployment status
  4. Your site will be available at `https://BrianMcBrayer.github.io/wardley-classification/`
  5. See the official docs: [GitHub Pages](https://docs.github.com/en/pages)

The GitHub Actions workflow (`.github/workflows/deploy.yml`) handles the deployment automatically on every push to main.

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
