<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Coding Style Guidelines

### Explicit Comparisons
Avoid implicit truthiness/falsiness checks, especially for values that can be `undefined`, `null`, `0`, or empty strings. Be explicit about what you are checking for.

**Bad:**
```typescript
if (!value) { ... }
if (item.count) { ... }
```

**Good:**
```typescript
if (value === undefined || value === null || value === "") { ... }
if (item.count !== undefined && item.count !== 0) { ... }
```
This prevents subtle bugs where valid falsy values (like `0` or `false`) are unintentionally treated as missing or invalid.
