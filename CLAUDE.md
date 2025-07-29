# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cayenne-core-js is a JavaScript client library for the Cayenne IoT platform that provides a unified interface to access multiple microservices (Cayenne, DeloreanES, Executor, Hermes, etc.).

## Essential Commands

```bash
# Install dependencies
npm install

# Run tests
npm test

# Check code style
npm run lint

# Auto-fix code style issues
npm run lint-fix
```

## Architecture

The library follows a service-oriented architecture:

- **Core Class** (`/lib/Core.js`): Main entry point that instantiates all service clients
- **Request Base** (`/lib/Request.js`): Base class for HTTP requests with auth, caching, error handling
- **Service Classes** (`/lib/Services/*.js`): Individual service clients extending Request class
  - Each service handles a specific domain (devices, time-series data, messaging, etc.)
  - Services use consistent patterns for authentication and error handling

## Code Style Requirements

- ESLint with Prettier integration
- Single quotes for strings
- Semicolons required
- No trailing commas
- No underscore-prefixed variables

## Testing

- Framework: Mocha with Code assertion library
- Tests located in `/test` directory
- Test timeout: 5 seconds

## Common Development Patterns

When adding new service methods:
1. Extend the appropriate service class in `/lib/Services/`
2. Follow existing method patterns for parameter handling and error wrapping
3. Use the inherited `makeRequest()` method for HTTP calls
4. Add corresponding tests in `/test`

Example service method pattern:
```javascript
async getResource(param1, param2, options = {}) {
    return this.makeRequest('GET', `/endpoint/${param1}`, { 
        query: { param2 },
        ...options 
    });
}
```