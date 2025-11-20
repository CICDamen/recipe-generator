# GitHub Copilot Instructions for Recipe Generator

## Project Overview
This is a modern Recipe Generator application built with React, TypeScript, and Vite. The app generates recipes using an n8n workflow that integrates with LLM services (e.g., Anthropic Claude) to create detailed, structured recipes based on user preferences.

## Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui (Radix UI components)
- **Styling**: Tailwind CSS
- **State Management**: @tanstack/react-query
- **Routing**: React Router v6
- **Internationalization**: i18next, react-i18next
- **Form Handling**: react-hook-form with Zod validation
- **Linting**: ESLint with TypeScript support
- **Deployment**: Docker with Coolify

## Code Style and Conventions

### TypeScript
- Use TypeScript for all new files
- Prefer interfaces over types for object shapes
- Path aliases: Use `@/*` for imports from `src/` directory (e.g., `@/components/ui/button`)
- Configure `tsconfig.json` with `noImplicitAny: false`, `strictNullChecks: false` as per project settings

### React Components
- Use functional components with hooks
- Export components as default exports
- Use named exports for utilities, constants, and helper functions
- Follow the existing component structure in `src/components/`

### UI Components
- Use shadcn/ui components from `@/components/ui/`
- Maintain consistency with existing UI component patterns
- Apply Tailwind utility classes for styling
- Use `cn()` utility from `@/lib/utils` for conditional class names

### File Structure
```
src/
├── components/     # Reusable UI components
│   └── ui/        # shadcn/ui components
├── pages/         # Route pages
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── types/         # TypeScript type definitions
├── locales/       # i18n translation files
└── App.tsx        # Main application component
```

### Internationalization
- All user-facing strings should be internationalized using i18next
- Add translations to both `src/locales/en/translation.json` and `src/locales/nl/translation.json`
- Use the `useTranslation()` hook: `const { t } = useTranslation();`
- Translation keys should be descriptive: `t('recipe.generateButton')`

### API Integration
- The app connects to an n8n workflow endpoint configured via environment variables
- Use `VITE_N8N_ENDPOINT`, `VITE_N8N_USERNAME`, `VITE_N8N_PASSWORD` for n8n configuration
- Authentication credentials: `VITE_USERNAME` and `VITE_PASSWORD` (frontend-only, not secure for production)
- All environment variables must be prefixed with `VITE_` to be accessible in the frontend

### Recipe Data Structure
Recipes returned from the n8n workflow should follow this structure:
```typescript
{
  recipe: {
    name: string;
    description: string;
    cuisine: string;
    difficulty: string;
    prepTime: string;
    cookTime: string;
    totalTime: string;
    servings: number;
    ingredients: Array<{ item: string; amount: string; notes?: string }>;
    instructions: Array<{ step: number; instruction: string; time?: string; temperature?: string }>;
    nutrition: { calories: string; highlights: string[] };
    tips: string[];
    tags: string[];
  };
  success: boolean;
  timestamp: string;
}
```

## Development Guidelines

### Scripts
- `npm run dev` - Start development server on port 8080
- `npm run build` - Production build
- `npm run build:dev` - Development build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Linting
- ESLint is configured with TypeScript and React plugins
- Some warnings about fast refresh are expected for UI components
- Follow the existing ESLint configuration in `eslint.config.js`
- Unused variables are allowed (`@typescript-eslint/no-unused-vars: off`)

### Docker
- The app is containerized and deployed using Docker
- Environment variables must be set at build time (not runtime) for Vite
- Use build args for Docker builds to inject environment variables

### Git Workflow
- Main branch: `main`
- Auto-deploy workflow triggers on push to main
- Deployment is handled via Coolify

## Common Patterns

### Adding a New Page
1. Create component in `src/pages/`
2. Add route in `src/App.tsx` (before the catch-all `*` route)
3. Add translations if needed
4. Use existing layout patterns from `Index.tsx`

### Adding a New UI Component
1. Check if shadcn/ui has the component needed
2. If yes, add it to `src/components/ui/` following shadcn patterns
3. If custom, create in `src/components/` with proper TypeScript types
4. Use Tailwind CSS for styling

### State Management
- Use `@tanstack/react-query` for server state
- Use React hooks (`useState`, `useEffect`) for local state
- Use localStorage for authentication state

## Testing
Currently, the project does not have a formal test suite. When adding tests:
- Consider using Vitest (Vite's test runner)
- Follow React Testing Library best practices
- Test user interactions and component rendering

## Best Practices
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use TypeScript types for props and function parameters
- Follow accessibility best practices (use semantic HTML)
- Optimize performance (lazy loading, memoization when needed)
- Keep dependencies up to date
- Document complex logic with comments

## Security Considerations
- Current authentication is frontend-only (not secure for production)
- Environment variables are exposed in the built frontend
- For production deployments, implement proper backend authentication
- Validate all user inputs
- Sanitize data from external APIs

## Resources
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
