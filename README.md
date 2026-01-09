## Prerequisites

Before running tests, make sure the following are installed:

- **Node.js v18+** — [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)

## Installation

Clone the repository and install dependencies:
  ```bash
  git clone https://github.com/NongMin1/ViliusNedz.git
  cd ViliusNedz
  npm install

```
## Environment Variables

Create a `.env` file in the project root with at least the following line:

```env
BASE_URL=https://your-url-link.com #Update URL to your preferred one
```

## Running Tests

You can run your Playwright tests directly from the command line using npm scripts defined in `package.json`. 
| Script                | Description                                                                     |
| --------------------- | ------------------------------------------------------------------------------- |
| `npm run test`        | Runs all tests in **headless mode** (default).                                  |
| `npm run test:headed` | Runs tests in **headed mode** (browser visible) **one by one** (`--workers=1`). |
| `npm run test:ui`     | Opens the **Playwright Test Runner UI** for interactive debugging.              |
| `npm run test:debug`  | Runs tests in **debug mode**, useful for pausing and stepping through tests.    |
| `npm run report`      | Shows the latest **Playwright HTML test report**.                               |
| `npm run trace`       | Opens **Playwright trace viewer** for detailed debugging of a previous run.     |
