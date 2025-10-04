# Contributing to QuickChat

## Development Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm (version 8 or higher)

### Installation

**For development:**
```bash
# Clone the repository
git clone <repository-url>
cd quick-chat

# Install dependencies using npm ci for reproducible builds
npm run install:ci

# Start development server
npm start
```

**For CI/CD environments:**
```bash
# Always use npm ci for consistent builds
npm ci

# Run build
npm run build
```

## Development Workflow

### Before Committing
1. Make your changes
2. Run formatting: `npm run format`
3. Check styles: `npm run lint:style`
4. Commit your changes (Husky will run pre-commit hooks automatically)

### Before Pushing
- The pre-push hook will automatically run `npm run build` to ensure the project builds successfully
- If the build fails, the push will be aborted

### Commit Message Format
Follow conventional commits:
```
type: description

feat: add new feature
fix: resolve bug
docs: update documentation
style: formatting changes
refactor: code restructuring
test: add tests
```

## Why npm ci?

This project uses `npm ci` instead of `npm install` because:

1. **Faster**: npm ci is 2-10x faster than npm install
2. **Reproducible**: Uses package-lock.json for exact dependency versions
3. **Reliable**: Automatically removes node_modules before installing
4. **CI-friendly**: Designed for automated environments

## Git Hooks

This project uses Husky for Git hooks:

- **pre-commit**: Runs Prettier and Stylelint on staged files
- **commit-msg**: Validates commit messages
- **pre-push**: Runs build to ensure code compiles successfully

## Code Quality Tools

- **Prettier**: Code formatting
- **Stylelint**: CSS/SCSS linting
- **Commitlint**: Commit message validation
- **Tailwind CSS**: Utility-first CSS framework
