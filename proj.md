# step 1 : create npm package

`nvm use 22.15.0`

1. npm init -y
2. npm install express, dotenv
3. npm install nodemon -D
4. update the package.json

```json
{
  "name": "backend-api-proj",
  "version": "1.0.0",
  "description": "backend api project",
  "main": "server.js",
  "type": "module", // 🔑 Critical ESM switch

  "scripts": {
    "start": "NODE_ENV=production node server.js",
    "dev": "NODE_ENV=development nodemon server.js"
  },
  "engines": {
    "node": "22.15.0"
  },
  "repository": {
    "type": "git",
    "url": "node_backend_api"
  },
  "keywords": ["node", "backend", "api"],
  "author": "aaron wai",
  "license": "ISC",
  "dependencies": {
    "dotenv": "^16.5.0",
    "express": "^5.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}
```

# step 2 : modules system

As of 2025, **ECMAScript Modules (ESM)** are the strongly recommended module system for new Node.js projects, while **CommonJS (CJS)** remains viable for specific legacy scenarios. Here’s a concise comparison and guidance:

### 🚀 **Recommendation: Use ESM for New Projects**

1. **Modern Standard & Ecosystem Alignment**  
   ESM is the official JavaScript standard (ES6) and aligns with browser support, frontend frameworks, and tools like Vite, Webpack, and TypeScript. New libraries increasingly prioritize ESM compatibility.

2. **Performance & Optimization**

   - Asynchronous loading ⚡️ prevents blocking the event loop (unlike synchronous CJS `require()`) .
   - Enables **tree shaking** (dead-code elimination) via static analysis, reducing bundle sizes .

3. **Syntax and Features**

   - Clean `import`/`export` syntax with named exports:
     ```javascript
     import { func } from "./module.js"; // Static analysis supported
     ```
   - Supports **top-level `await`** and dynamic imports (`import()`) .

4. **Node.js Compatibility**  
   Fully stable since Node.js v14+ and enabled via:

   - `"type": "module"` in `package.json`, or
   - `.mjs` file extensions .

5. **Future-Proofing**  
   Major ecosystems (React, Vue, etc.) and Deno/Bun runtimes default to ESM. CJS is now in maintenance mode in Node.js .

### ⚠️ **When to Use CommonJS**

- **Legacy Codebases**: Existing CJS projects without immediate migration plans.
- **Synchronous Dependencies**: Rare cases requiring synchronous module resolution (e.g., config files).
- **Partial Migration**: Use dynamic `import()` to load ESM from CJS, or `createRequire` for CJS in ESM:
  ```javascript
  // In ESM, load CJS
  import { createRequire } from "node:module";
  const require = createRequire(import.meta.url);
  const cjsModule = require("./legacy.cjs");
  ```

### 🔧 **Key Differences Summary**

| **Feature**            | **CommonJS**                   | **ES Modules (ESM)**                                    |
| ---------------------- | ------------------------------ | ------------------------------------------------------- |
| **Loading**            | Synchronous (blocking)         | Asynchronous (non-blocking)                             |
| **Syntax**             | `require()` / `module.exports` | `import` / `export`                                     |
| **Tree Shaking**       | ❌ No                          | ✅ Yes                                                  |
| **Top-Level `await`**  | ❌ No                          | ✅ Yes                                                  |
| **Browser Support**    | ❌ Via bundlers only           | ✅ Native                                               |
| **`__dirname` Access** | ✅ Yes                         | ❌ Use `import.meta.url`                                |
| **JSON Imports**       | `require('./data.json')`       | `import data from './data.json' with { type: 'json' };` |

### 🔄 **Migration Tips**

1. **Gradual Adoption**: Rename files to `.mjs` or add `"type": "module"` to `package.json`.
2. **Replace CJS Features**: Use `import.meta.url` instead of `__filename`, and `import.meta.resolve()` for path resolution.
3. **Hybrid Projects**: Leverage dynamic `import()` to load ESM in CJS during transition.
4. **Tooling**: Ensure ESLint/TypeScript configs target ESM (`"module": "ESNext"`).

### ✅ **Conclusion**

**Use ESM** for all new Node.js projects in 2025. It offers better performance, tooling, and alignment with JavaScript’s future. Reserve **CommonJS** for maintaining older systems or specific synchronous needs. The Node.js ecosystem now fully supports ESM, making migration smoother than ever .

For deep dives, see [ESM vs. CJS technical breakdowns](https://betterstack.com/community/guides/scaling-nodejs/commonjs-vs-esm/) or [migration guides](https://dev.to/ruben_alapont/navigating-nodejs-module-systems-commonjs-vs-es-modules-with-typescript-2lak) .

To configure your Node.js project to use **ES Modules (ESM)** instead of CommonJS, modify your `package.json` as follows:

### 1️⃣ **Enable ESM Globally**

Add the `"type": "module"` field to your `package.json`:

```json
{
  "name": "your-project",
  "version": "1.0.0",
  "type": "module", // 👈 Critical for ESM support
  "main": "./src/index.js", // Entry point (use .js extension)
  "scripts": {
    "start": "node src/index.js"
  }
}
```

- **Result**: All `.js` files will be treated as ESM modules.

---

### 2️⃣ **Update File Extensions (Optional but Recommended)**

- Use `.js` for ESM files (works automatically with `"type": "module"`).
- For **hybrid projects** (mixing CJS/ESM):
  - `.mjs` → ESM modules (always treated as ESM)
  - `.cjs` → CommonJS modules (always treated as CJS)

---

### 3️⃣ **Key Adjustments for ESM Syntax**

Replace CommonJS syntax:

```javascript
// ❌ CommonJS (CJS)
const lodash = require('lodash');
module.exports = { ... };
```

With ESM syntax:

```javascript
// ✅ ESM
import lodash from 'lodash';
export default { ... }; // or named exports: export const func = ...
```

---

### 4️⃣ **Handling JSON Imports**

ESM requires explicit JSON import assertions:

```javascript
import data from "./data.json" assert { type: "json" };
```

---

### 5️⃣ **Replace CJS-Specific Variables**

| CommonJS          | ESM Equivalent                      |
| ----------------- | ----------------------------------- |
| `__dirname`       | `import.meta.url` + `fileURLToPath` |
| `__filename`      | `import.meta.url` + `fileURLToPath` |
| `require.resolve` | `import.meta.resolve`               |

Example:

```javascript
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

---

### 6️⃣ **Tooling Configuration**

Update these tools for ESM compatibility:

#### **TypeScript** (`tsconfig.json`):

```json
{
  "compilerOptions": {
    "module": "ESNext", // or "NodeNext"
    "moduleResolution": "NodeNext"
  }
}
```

#### **ESLint** (`.eslintrc.json`):

```json
{
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": "latest"
  }
}
```

#### **Jest** (`jest.config.js`):

```javascript
export default {
  testEnvironment: "node",
  transform: {},
  extensionsToTreatAsEsm: [".js"],
};
```

---

### 7️⃣ **Dealing with CommonJS Dependencies**

Use `createRequire` to load CJS modules in ESM:

```javascript
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const legacyModule = require("cjs-only-package");
```

---

### 8️⃣ **Dynamic Imports**

Load modules conditionally:

```javascript
const module = await import("./path/to/module.js");
```

---

### ⚠️ **Common Pitfalls**

1. **File Extensions**: Always include extensions in imports:
   ```javascript
   import "./utils.js"; // ✅ Required in ESM
   ```
2. **Top-Level `await`**: Only works in ESM (no wrapper needed).
3. **Dual-Mode Packages**: Use `"exports"` in `package.json` for conditional ESM/CJS entry points:
   ```json
   {
     "exports": {
       "import": "./esm/index.js",
       "require": "./cjs/index.js"
     }
   }
   ```

---

### ✅ **Final Checklist**

- [ ] `"type": "module"` in `package.json`
- [ ] Replace `require`/`module.exports` with `import`/`export`
- [ ] Add `.js` extensions to relative imports
- [ ] Update tooling (TypeScript, ESLint, Jest)
- [ ] Replace `__dirname`/`__filename` with `import.meta.url` helpers

After these changes, run your app with:

```bash
node src/index.js
```

> **Note**: Most modern packages support ESM, but if a dependency only uses CommonJS, use `createRequire` or dynamic `import()` to load it.

# step 2 : create server.js

1. create server.js

```javascript
import express from "express";
import dotenv from "dotenv";
// load env variables
dotenv.config({ path: "./config/config.env" });
const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
```

2. create config/config.env
3. create gitignore
4. test the server mode, run `node server.js` in terminal and `npm run dev` in terminal

# step 3 : create route

1. add route for testing
2. in the postman, inspect the response header (1.png)

```js
import express from "express";
import dotenv from "dotenv";
// load env variables
dotenv.config({ path: "./config/config.env" });
const app = express();

app.get("/", (req, res) => {
  // send different content type
  res.send("API is running..."); // send plain text
  res.json({ message: "API is running..." }); // send json
  res.send("<h1>API is running...</h1>"); // send html
  // send status code
  res.sendStatus(200); // send 200 status code
  res.status(200).send("API is running..."); // send 200 status code with message
  res.status(400).json({ success: false }); // send 500 status code with json message
  res.status(200).json({ success: true, data: { id: 1 } }); // send 200 status code with json object including data
});
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
```

3. based on different response type, postman will show different result content-type (2.png)

# step 4 : API versioning

Great questions! Let's break down the core concepts clearly:

### 1. **What is an API?**

An **API (Application Programming Interface)** is a set of rules/protocols that allows different software systems to communicate. For the web:

- **It's not a webpage**: It doesn't return HTML/CSS/JS for browsers to render visually.
- **It's a data service**: It returns structured machine-readable data (usually JSON/XML).
- **Purpose**: Enable apps to request/send data programmatically (e.g., mobile apps, JavaScript frontends, other servers).

---

### 2. **Web Page Rendering vs. API Endpoints**

| **`/resources` (Web Page Route)**                        | **`/api/v1/resources` (API Endpoint)**                            |
| -------------------------------------------------------- | ----------------------------------------------------------------- |
| Returns **HTML/CSS/JS**                                  | Returns pure **structured data** (JSON/XML)                       |
| Rendered by the **browser** as a visible page            | Consumed by **code** (apps, scripts, services)                    |
| Example: `GET /users` → Renders a "User Profile" webpage | Example: `GET /api/v1/users` → Returns `[{id: 1, name: "Alice"}]` |
| For **humans** using browsers                            | For **machines/programs**                                         |

---

### 3. **What is `/api/v1`?**

- **`/api`**: Signals this is an _API endpoint_ (not a webpage).
- **`/v1`**: Explicit **API version** (Version 1).

  - Why? APIs evolve. If you later change data structures:

    ```json
    // v1 Response
    { "id": 1, "name": "Alice" }

    // v2 Response (added "email")
    { "id": 1, "name": "Alice", "email": "alice@example.com" }
    ```

  - Old apps keep using `v1` → no breaking changes.
  - New apps use `v2` → access new features.

---

### 4. **Real-World Flow**

Imagine a Twitter-like app:

1. **Browser requests `/home`**:  
   → Server returns **HTML/CSS** (renders the page skeleton).  
   → _Empty feed_ (no data yet).

2. **Browser's JavaScript fetches data**:

   ```javascript
   // Client-side code calls API
   fetch("/api/v1/posts")
     .then((response) => response.json())
     .then((posts) => renderPosts(posts)); // Populates the page
   ```

3. **API Response (pure data)**:
   ```json
   // GET /api/v1/posts
   [
     { "id": 101, "user": "Bob", "text": "Hello world!" },
     { "id": 102, "user": "Alice", "text": "Learning APIs!" }
   ]
   ```

---

### Key Takeaways

1. **APIs serve raw data**, not visual content.
2. **`/api/v1`** = Versioned API endpoint (avoids breaking existing apps).
3. **Separation of concerns**:
   - `GET /resources` → Returns a **webpage** (for humans).
   - `GET /api/v1/resources` → Returns **JSON/XML** (for code).
4. **Modern web apps combine both**:
   - Initial page load: HTML from `/home`.
   - Dynamic data: API calls to `/api/v1/*`.

> 💡 **Analogy**:
>
> - **Webpage** = A printed restaurant menu (formatted for humans).
> - **API** = The kitchen's ingredient list (raw data for chefs/machines).
> - **`/v1`** = Today's menu version. If the menu changes tomorrow, old copies (`v1`) still work.

The practice of structuring API routes like `/api/v1/resources` instead of `/resources` serves several important purposes in modern API design:

### 1. **Explicit API Identification**

- **`/api`** clearly signals that the endpoint belongs to an API, not a UI route. This avoids conflicts with frontend routes (e.g., `/resources` could be a webpage or an API).
- **Example**:
  - `/resources` → Might render an HTML page.
  - `/api/v1/resources` → Unambiguously an API endpoint.

### 2. **Version Control (`v1`)**

- **Critical for backward compatibility**: APIs evolve over time. Including the version (`v1`) lets you introduce breaking changes in `v2` without disrupting existing clients.
- **Migration strategy**: Old clients stay on `v1`, new clients use `v2`. Example:

  ```bash
  # Legacy
  GET /api/v1/resources → Returns { id, name }

  # Updated
  GET /api/v2/resources → Returns { id, name, createdAt }
  ```

- **Without versioning**, changes risk breaking integrators (mobile apps, third-party services).

### 3. **Organizational Scalability**

- **Logical grouping**: All API endpoints share the `/api` prefix, simplifying routing, middleware, and security policies.
- **Team coordination**: Engineers instantly recognize API routes vs. other server-side logic (e.g., SSR, static files).

### 4. **Proxy and Infrastructure Flexibility**

- **Load balancing**: Easily route all `/api/*` traffic to API-specific servers.
- **Security**: Apply stricter rules (rate limiting, authentication) to `/api` paths.
- **Example Nginx rule**:
  ```nginx
  location /api/ {
      proxy_pass http://api_servers;
      rate_limit 100r/s;
  }
  ```

### 5. **Client-Side Clarity**

- Developers integrating your API immediately understand:
  - `https://example.com/api/v1/*` → Core API endpoints.
  - `https://example.com/v1/*` → Less intuitive (could be confused with UI routes).

### Why Not Just `/resources`?

- **Ambiguity**: Is this an API, a web page, or a redirect?
- **Versioning headaches**: No clear path to evolve the API without breaking clients.
- **Scalability issues**: Hard to enforce API-specific policies (e.g., authentication, logging).

### Best Practices

1. **Always version APIs** (via URL path or headers). URL paths are simpler to debug.
2. **Use semantic versioning**:
   - `v1` → Initial release.
   - `v2` → Breaking changes (e.g., field renames).
3. **Deprecate gracefully**:
   - Maintain `v1` until clients migrate to `v2`.
   - Use HTTP headers (e.g., `Deprecation: true`) to warn users.

### Alternatives to Path-Based Versioning

- **Header versioning** (e.g., `Accept: application/vnd.myapi.v1+json`).  
  → Less visible but "cleaner" URLs.  
  → Harder to debug without tools.

### Conclusion

`/api/v1/resources` is a **deliberate, future-proof convention** that:

- Separates API concerns from other application logic,
- Enables safe API evolution,
- Simplifies infrastructure management,
- Prevents ambiguity for humans and systems.

For small internal projects, `/resources` _might_ suffice, but for public/long-lived APIs, structured paths are industry-standard.

# step 5 : add all the routes

1. add all the routes

```js
import express from "express";
import dotenv from "dotenv";
// load env variables
dotenv.config({ path: "./config/config.env" });
const app = express();

app.get("/api/v1/bootcamps", (req, res) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
});

app.get("/api/v1/bootcamps/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `show bootcamp ${req.params.id}` });
});

app.post("/api/v1/bootcamps", (req, res) => {
  res.status(200).json({ success: true, msg: "Create new bootcamp" });
});
app.put("/api/v1/bootcamps/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
});

app.delete("/api/v1/bootcamps/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `delete bootcamp ${req.params.id}` });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
```

2. testing all the routes in postman
   `localhost:5001/api/v1/bootcamps/1`
3. after testing all the routes, refactor routes into routes folder
4. create routes folder and name the file as `bootcamps.js`
5. move the routes to bootcamps.js, rename the app to router

```js
import express from "express";
const router = express.Router();

router.get("/api/v1/bootcamps", (req, res) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
});

router.get("/api/v1/bootcamps/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `show bootcamp ${req.params.id}` });
});

router.post("/api/v1/bootcamps", (req, res) => {
  res.status(200).json({ success: true, msg: "Create new bootcamp" });
});
router.put("/api/v1/bootcamps/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
});

router.delete("/api/v1/bootcamps/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `delete bootcamp ${req.params.id}` });
});

export default router;
```

6. within the server.js, import the router and add the router to the app
7. mount the api/v1/bootcamps to the app then within the bootcamps.js, refactor the api to simply '/'

```js
import express from "express";
import dotenv from "dotenv";

import bootcamps from "./routes/bootcamps.js";
// load env variables
dotenv.config({ path: "./config/config.env" });
const app = express();

// mount routers
app.use("/api/v1/bootcamps", bootcamps);
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
```

8. testing the api in postman
