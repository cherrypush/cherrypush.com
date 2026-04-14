## What is Cherry?

Cherry (cherrypush.com) is a technical debt tracking tool. Users configure codebase patterns to track, and Cherry reports stats on every commit to a dashboard. The app is a Rails 7 monolith with a React SPA for authenticated pages.

## Commands

### Development

```sh
bin/dev                  # Start dev server (Rails + Tailwind + Vite) on port 3001
rails db:setup           # Create and seed database
```

### Testing

```sh
HEADLESS=1 bin/rails test:all            # Run all tests (unit + system, headless)
bin/rails test                           # Unit/integration tests only
HEADLESS=1 bin/rails test:system         # System tests only (headless Chrome)
bin/rails test test/models/metric_test.rb              # Single test file
bin/rails test test/models/metric_test.rb:42            # Single test by line number
bin/rails test:system                    # System tests with visible Chrome (no HEADLESS)
```

When making changes, always run the related tests before considering the work done.

### Linting

```sh
bundle exec rubocop                      # Ruby linter
npx eslint app/javascript/               # JS/TS linter
npx prettier --check .                   # Formatting check
```

## Architecture

### Hybrid Rails + React SPA

- **Static/public pages**: Server-rendered ERB templates (`app/views/pages/`), styled with Tailwind CSS
- **Authenticated app (`/user/*`)**: Single-page React app. Rails serves a shell via `User::ApplicationController#spa`, then React Router handles client-side routing. All `/user/*` JSON endpoints serve data to the React SPA via axios.
- **Frontend bundling**: Vite (via `vite_rails` gem and `vite-plugin-ruby`). React components live in `app/javascript/components/`, hooks in `app/javascript/hooks/`, helpers in `app/javascript/helpers/`.

### API layers

- **CLI API (`/api/*`)**: Used by the `cherrypush` npm CLI to push metrics. Authenticates via `api_key` param. Controllers in `app/controllers/api/`.
- **SPA API (`/user/*` JSON)**: Internal API for the React frontend. Authenticates via session cookie (Google OAuth via OmniAuth). Controllers in `app/controllers/user/`.

### Key models

The core domain: `Project` has many `Metric`s, each `Metric` has many `Occurrence`s (individual code locations) and `Contribution`s (who changed what). `Organization` groups projects; `User` belongs to organizations via `Membership`. `Dashboard` has many `Chart`s (via `ChartMetric` join).

### Testing

- Minitest with `minitest-spec-rails` (allows `describe`/`it` blocks)
- `FactoryBot` for test data (factories in `test/factories/`)
- System tests use Capybara + Selenium with Chrome. `HEADLESS` env var controls headless mode.
- Tests run in parallel by default (`parallelize(workers: :number_of_processors)`)

### Key conventions

- Ruby style: `rubocop` with compact class/module style (`class Foo::Bar` not nested)
- Memoized instance variables require leading underscore (`_` prefix) per rubocop config
- Authorization via Pundit policies
- Background jobs via DelayedJob
