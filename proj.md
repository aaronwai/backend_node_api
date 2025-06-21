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

# step 3 :
