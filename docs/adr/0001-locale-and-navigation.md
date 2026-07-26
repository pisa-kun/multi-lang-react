# ADR 0001: Locale resolution and navigation strategy

- Status: Accepted
- Date: 2026-07-26

## Context

The sample app needs to support multilingual UI behavior while keeping the implementation simple enough for a demo and for future extension. The app has three main screens:

- Login screen
- Home screen
- Profile screen

The design must satisfy the following goals:

1. The user can switch languages explicitly from the UI.
2. The selected language persists across refreshes and browser sessions.
3. The URL remains simple and does not require locale-prefixed routes.
4. The auth flow and locale state stay understandable for a sample implementation.

## Decision

The app uses the following locale resolution order:

1. Query parameter `?lang=ja` or `?lang=en`
2. Browser localStorage value (`app-locale`)
3. Default locale `ja`

The app also keeps the locale in sync with the translation engine and the auth state. When the user changes the language, the app updates:

- the active i18n language
- the stored locale value
- the query parameter in the URL

Navigation remains path-based with simple routes:

- `/login`
- `/`
- `/profile`

The locale is not encoded as a path segment right now. This keeps the design lightweight and avoids adding route-prefix complexity to the sample app.

## Why this approach

- The query parameter makes the selected language explicit and easy to share.
- localStorage provides a simple persistence mechanism for repeated visits.
- Keeping the URL clean is better for a demo app and avoids route duplication.
- The current implementation is easy to reason about because locale handling is centralized in the app layer.

## Consequences

### Positive

- Locale switching is predictable and easy to test.
- Users keep their choice across page reloads.
- The route structure stays simple.

### Negative

- The locale is not expressed as part of the path, so it is less SEO-friendly than a locale-prefixed URL strategy.
- This design is suitable for a sample app, but a production app may need a more structured server-side strategy.

## Alternatives considered

- Locale-prefixed routes such as `/ja` and `/en`
  - Pros: very explicit and SEO-friendly
  - Cons: adds route complexity and more special-case handling
- Browser `Accept-Language` only
  - Pros: automatic
  - Cons: less explicit and less predictable for manual switching
- Server-side locale detection only
  - Pros: strong consistency
  - Cons: unnecessary for this front-end sample and harder to demo locally
