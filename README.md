# QuickChat

## Installation

This project uses `npm ci` for faster, reliable, and reproducible builds.

```bash
# Install dependencies (recommended for CI/CD and reproducible builds)
npm ci

# Or use the npm script
npm run install:ci

# For development, you can also use
npm install
```

## How to Use

1. **Start the application**:
   ```bash
   npm start
   # or
   ng serve
   ```

2. **Open multiple tabs**: Navigate to `http://localhost:4200/` in multiple browser tabs

3. **Start chatting**: 
   - Each tab will be assigned a unique sequential name (e.g., "Вкладка №1", "Вкладка №2")
   - Tab numbers are assigned based on the order of opening tabs
   - Type messages in any tab to see them appear in all tabs
   - See typing indicators when other tabs are composing messages

4. **Mobile experience**: On mobile devices, the user panel moves to the top for better usability

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
# Development build
npm run build

# Production build
npm run build:prod

# Or use Angular CLI directly
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

**Note**: A build will automatically run before every git push to ensure code compiles successfully.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Code Quality Tools

This project includes several code quality tools to maintain consistency and best practices:

### Prettier
Code formatting tool that ensures consistent code style across the project.

```bash
# Format all files
npm run format

# Check if files are formatted correctly
npm run format:check
```

### Stylelint
CSS/SCSS linting tool that helps maintain consistent styling standards.

```bash
# Lint stylesheets
npm run lint:style

# Lint and fix stylesheets
npm run lint:style:fix
```

### Commitlint
Validates commit messages to ensure they follow conventional commit format.

Commit messages should follow this format:
```
type(scope): description

feat: add user authentication
fix: resolve navigation issue
docs: update API documentation
```

### Husky & lint-staged
Git hooks that run automatically:

- **Pre-commit hook**: Runs Prettier and Stylelint on staged files
- **Commit-msg hook**: Validates commit messages using Commitlint
- **Pre-push hook**: Runs build to ensure code compiles successfully

### Tailwind CSS
Utility-first CSS framework for rapid UI development.

Tailwind classes are available throughout the project. Import Tailwind utilities in your components as needed.

### Angular Material
Material Design components for Angular applications.

This project includes Angular Material 20 with:
- Material Design components (buttons, cards, forms, etc.)
- Material Design icons
- Responsive design patterns
- Theme support (light/dark themes)

**Example Material components available:**
- MatButtonModule - Various button styles
- MatCardModule - Card layouts
- MatIconModule - Material icons
- MatInputModule - Form inputs
- MatFormFieldModule - Form fields
- MatToolbarModule - Navigation toolbars
- MatSidenavModule - Side navigation
- MatListModule - Lists and menus
