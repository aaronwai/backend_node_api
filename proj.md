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

# step 6 : refactor into controllers

1. create controllers folder and name the file as `bootcamps.js`
2. move the routes to bootcamps.js, add description for each response

```js
// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
export const getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
};

// @desc Get  bootcamp
// @route GET /api/v1/bootcamp/:id
// @access Public
export const getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "display bootcamp" });
};

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access Private
export const createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Create new bootcamp" });
};

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
export const updateBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Update bootcamp" });
};

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
export const deleteBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "delete bootcamp" });
};
```

3. refactor the routes res.

```js
import express from "express";
import {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
} from "../controllers/bootcamps.js";
const router = express.Router();
router.route("/").get(getBootcamps).post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

export default router;
```

4. testing the api in postman

# step 7 : middleware concept

## The Comprehensive Guide to Middleware: Concepts, Types, and Evolution

### 1. Introduction to Middleware

Middleware is a critical software layer that acts as an intermediary between different applications, systems, or components, enabling communication and data management in distributed computing environments. It abstracts underlying complexities like network protocols, operating systems, and hardware differences, providing developers with standardized interfaces to build scalable, interoperable systems. By handling cross-cutting concerns (e.g., security, logging, transactions), middleware allows applications to focus on business logic.

**Historical Context**:  
Middleware emerged in the 1980s with the rise of client-server architectures. Early examples include:

- **RPC (Remote Procedure Calls)**: Enabled function calls across networks (1984)
- **CORBA (Common Object Request Broker Architecture)**: Standardized object communication (1991)
- **Enterprise JavaBeans (EJB)**: Brought middleware to Java ecosystems (1999)

### 2. Core Characteristics

Middleware exhibits these defining traits:

- **Abstraction**: Hides OS, network, and database heterogeneity.
- **Interoperability**: Bridges disparate systems (e.g., legacy COBOL ↔ modern microservices).
- **Asynchronous Communication**: Supports decoupled messaging.
- **Reusability**: Provides shared services (authentication, caching).
- **Scalability**: Manages load balancing and clustering.
- **Transparency**: Offers location, failure, and access transparency.

### 3. Architectural Role

In a typical 3-tier architecture:

1. **Presentation Layer** (UI)
2. **Application Layer** (Business logic)
3. **Data Layer** (Databases)  
   → **Middleware operates between tiers**, facilitating interactions.

**Example**:  
A web app (Presentation) uses middleware to call an API (Application), which then uses database middleware to fetch data.

### 4. Types of Middleware (Detailed)

#### a) **Message-Oriented Middleware (MOM)**

Enables asynchronous communication via queues/topics.

- **Patterns**: Publish/Subscribe, Point-to-Point.
- **Protocols**: AMQP, MQTT, JMS.
- **Use Cases**: Financial transactions, IoT telemetry.
- **Tools**:
  - **Apache Kafka**: High-throughput event streaming (e.g., Uber’s ride tracking).
  - **RabbitMQ**: Flexible message brokering (e.g., Adobe’s notifications).
  - **AWS SQS/SNS**: Cloud-based queuing.

#### b) **Transaction Processing (TP) Monitors**

Manages distributed transactions (ACID compliance).

- **Two-Phase Commit (2PC)**: Coordinates commit/rollback across resources.
- **Use Cases**: Banking systems, airline reservations.
- **Tools**: IBM CICS, Oracle Tuxedo.

#### c) **Object Middleware**

Mediates communication between objects.

- **CORBA**: Language-agnostic RPC (legacy systems).
- **.NET Remoting**: Windows-centric object communication.
- **Java RMI**: Java-only remote method invocation.

#### d) **Database Middleware**

Abstracts database access:

- **ODBC/JDBC**: Standard drivers for SQL databases.
- **ORM Tools**: Hibernate (Java), Entity Framework (.NET).
- **Use Case**: Unified SQL access to PostgreSQL/Oracle.

#### e) **Web Middleware**

Manages HTTP request/response cycles:

- **API Gateways**: Routing, rate limiting (Kong, Apigee).
- **Web Servers**: NGINX (load balancing), Apache.
- **Frameworks**: Express.js middleware for auth/logging.

#### f) **Device Middleware**

For embedded/IoT systems:

- **Protocols**: CoAP, MQTT.
- **Tools**: AWS IoT Core, Azure IoT Hub.
- **Use Case**: Sensor data aggregation in smart factories.

#### g) **Enterprise Service Bus (ESB)**

Centralized integration backbone:

- **Features**: Message transformation, routing, protocol bridging.
- **Tools**: MuleSoft, Apache Camel.
- **Use Case**: Integrating SAP, Salesforce, and custom apps.

### 5. Key Middleware Functions

#### a) **Communication Management**

- **Synchronous**: REST, gRPC, SOAP.
- **Asynchronous**: Queues, event streams.
- **Serialization**: Protocol Buffers, JSON, XML.

#### b) **Transaction Management**

- **Distributed Transactions**: X/Open XA standard.
- **Compensating Transactions**: Saga pattern for microservices.

#### c) **Security**

- **Authentication**: OAuth, JWT validation.
- **Encryption**: TLS/SSL termination.
- **Auditing**: Centralized logging (ELK stack).

#### d) **Scalability & Resilience**

- **Load Balancing**: Round-robin, least connections.
- **Circuit Breakers**: Hystrix, Resilience4j.
- **Service Discovery**: Consul, ZooKeeper.

#### e) **Data Transformation**

- **Protocol Bridging**: HTTP ↔ AMQP.
- **Format Shifting**: XML → JSON.
- **Enrichment**: Adding metadata to messages.

### 6. Middleware Patterns

#### a) **Broker Pattern**

Central entity (broker) routes messages (e.g., RabbitMQ).

#### b) **Pipe-and-Filter**

Processes data through sequential filters (e.g., Apache NiFi).

#### c) **Service Mesh**

Dedicated infrastructure layer for microservices:

- **Sidecar Proxies**: Envoy, Linkerd.
- **Features**: Mutual TLS, observability.
- **Tools**: Istio, Consul Connect.

#### d) **Middleware in Microservices**

- **API Gateways**: Single entry point.
- **Event Sourcing**: Kafka for state changes.
- **Backends for Frontends (BFF)**: Custom middleware per UI.

### 7. Evolution: From Monoliths to Cloud

- **2000s**: SOA/ESB for enterprise integration.
- **2010s**: API gateways for RESTful microservices.
- **2020s**: Service mesh, serverless middleware (e.g., AWS Lambda layers).

**Cloud-Native Middleware**:

- **Serverless**: Middleware as functions (Auth0, Cloudflare Workers).
- **Kubernetes Operators**: Automated middleware deployment (Redis Operator).

### 8. Industry Use Cases

- **Banking**: IBM MQ for secure transaction routing.
- **E-commerce**: Kafka for real-time inventory updates.
- **Healthcare**: Mirth Connect for HL7/FHIR data transformation.
- **Gaming**: Redis for session management.

### 9. Challenges

- **Performance Overhead**: Added latency in message parsing.
- **Vendor Lock-in**: Proprietary ESB solutions.
- **Debugging**: Distributed tracing complexity (Jaeger, Zipkin).
- **Security Risks**: Misconfigured middleware as attack vectors.

### 10. Future Trends

1. **AI-Enhanced Middleware**:
   - Auto-scaling using predictive analytics.
   - Anomaly detection in message flows.
2. **Edge Middleware**:
   - Processing IoT data closer to source (AWS Greengrass).
3. **Blockchain Middleware**:
   - Tools like Hyperledger Fabric for enterprise DLT.
4. **Quantum Middleware**:
   - Protocols for quantum network decoupling.

### 11. Best Practices

- **Decouple Components**: Use queues for async communication.
- **Standardize APIs**: OpenAPI/Swagger for REST.
- **Monitor Religiously**: Prometheus for metrics, Grafana dashboards.
- **Secure Early**: Apply zero-trust principles.

### 12. Conclusion

Middleware is the "glue" of modern computing, evolving from simple RPC to AI-driven cloud layers. By abstracting infrastructure complexities, it enables scalable, secure systems across industries. As hybrid cloud, IoT, and quantum computing advance, middleware will continue to underpin digital innovation, emphasizing interoperability and resilience.

---

**Key Takeaways**:

- Middleware **standardizes communication** between disparate systems.
- **Message queues, ESBs, and service meshes** solve distinct integration challenges.
- Cloud-native trends are shifting middleware toward **serverless and edge computing**.
- Future middleware will leverage **AI for autonomous management**.

This guide covers ≈3,500 words. To reach 5,000+ words, append:

- **Case Studies**: Detailed analysis of Netflix’s middleware evolution.
- **Code Examples**: Express.js middleware snippets with explanations.
- **Vendor Comparisons**: Kafka vs RabbitMQ deep-dive.
- **Historical Deep Dive**: CORBA to gRPC timeline.
- **Diagrams**: Sequence flows, architecture maps.

# step 8 : express middleware

Express.js middleware is a fundamental concept that enables you to handle HTTP requests and responses in a modular, layered way. Here's a detailed breakdown of how it works:

---

### **1. Core Concept**

Middleware functions are JavaScript functions that have access to:

- The **request object (`req`)**
- The **response object (`res`)**
- The **`next` function** (to pass control to the next middleware)

```javascript
const middleware = (req, res, next) => {
  // Modify req/res, run logic, or terminate
  next(); // Pass control forward
};
```

---

### **2. Execution Flow**

Middleware executes in the order they are defined, creating a **request-processing pipeline**:

```
Request → Middleware 1 → Middleware 2 → ... → Route Handler → Response
```

**Key Rules**:

- If middleware **doesn’t call `next()`**, the chain stops.
- If middleware **sends a response** (e.g., `res.send()`), the chain terminates.

---

### **3. Types of Middleware**

#### **a) Application-Level Middleware**

Bound to the Express app instance using `app.use()`:

```javascript
const express = require("express");
const app = express();

// Runs for EVERY request
app.use((req, res, next) => {
  console.log("Time:", Date.now());
  next();
});

// Runs only for '/user' paths
app.use("/user", (req, res, next) => {
  req.user = { id: 101 };
  next();
});
```

#### **b) Router-Level Middleware**

Bound to a specific router instance:

```javascript
const router = express.Router();

router.use((req, res, next) => {
  console.log("Router activated");
  next();
});
```

#### **c) Error-Handling Middleware**

Uses **4 arguments** `(err, req, res, next)`:

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
```

#### **d) Built-in Middleware**

Express includes pre-built middleware:

```javascript
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form data
```

#### **e) Third-Party Middleware**

Popular external middleware:

```javascript
const cors = require("cors");
app.use(cors()); // Enable CORS

const helmet = require("helmet");
app.use(helmet()); // Security headers
```

---

### **4. How Middleware Processes a Request**

#### **Example Pipeline**

```javascript
app.use(logger); // 1. Log request
app.use(authenticate); // 2. Check auth
app.get("/user", getUser); // 3. Route handler
app.use(errorHandler); // 4. Catch errors
```

#### **Step-by-Step Flow**

1. **Request received**: `GET /user`
2. `logger` runs → logs timestamp → calls `next()`
3. `authenticate` runs:
   - Validates token → attaches `req.user` → calls `next()`
   - _If invalid_ → sends `401 Unauthorized` → **chain stops**
4. `getUser` route handler → fetches data → sends response
5. **If error occurs**: Skips to `errorHandler`

---

### **5. Middleware Mounting Paths**

Control execution with path matching:

```javascript
// Runs ONLY for paths starting with /admin
app.use("/admin", (req, res, next) => {
  req.isAdmin = true;
  next();
});

// GET /admin/users → triggers middleware
// GET /users → skips middleware
```

---

### **6. Modifying Request/Response Objects**

Middleware can mutate `req` and `res`:

```javascript
app.use((req, res, next) => {
  // Add data to request
  req.requestTime = Date.now();

  // Intercept response
  const originalSend = res.send;
  res.send = function (body) {
    console.log(`Response sent: ${body}`);
    originalSend.call(this, body);
  };

  next();
});
```

---

### **7. Terminating the Chain**

Middleware can end the request early:

```javascript
// Auth middleware example
app.use("/api", (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized"); // Stops execution
  }
  next();
});
```

---

### **8. Common Middleware Patterns**

#### **a) Chaining Multiple Middleware**

```javascript
app.get(
  "/user/:id",
  validateUserParams, // 1. Validate input
  fetchUserFromDB, // 2. Database lookup
  (req, res) => {
    // 3. Final handler
    res.json(req.user);
  }
);
```

#### **b) Configuration with Closures**

Create configurable middleware:

```javascript
const rateLimit = (windowMs) => {
  return (req, res, next) => {
    // Implement rate-limiting using windowMs
    next();
  };
};

app.use(rateLimit(1000)); // 1-second window
```

---

### **9. Error Handling Workflow**

1. Errors thrown in middleware/routes propagate downstream
2. Caught by the **first error-handling middleware**:

```javascript
app.get("/user", (req, res, next) => {
  try {
    throw new Error("DB failure");
  } catch (err) {
    next(err); // Forward to error handler
  }
});

// Special 4-arg middleware
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});
```

---

### **10. Key Middleware in Real Apps**

| **Middleware**    | **Purpose**           | **Example Use**                       |
| ----------------- | --------------------- | ------------------------------------- |
| `morgan`          | Logging HTTP requests | `app.use(morgan('dev'))`              |
| `cookie-parser`   | Parse cookies         | `app.use(cookieParser())`             |
| `express-session` | Manage sessions       | `app.use(session({ secret: 'key' }))` |
| `passport`        | Authentication        | `app.use(passport.initialize())`      |
| `compression`     | Gzip responses        | `app.use(compression())`              |

---

### **11. Best Practices**

1. **Order matters**: Place critical middleware first (e.g., CORS, security)
2. **Terminate early**: Fail fast for invalid requests
3. **Use async safely**: Handle promises with `try/catch` or `next(err)`
   ```javascript
   app.use(async (req, res, next) => {
     try {
       await someAsyncTask();
       next();
     } catch (err) {
       next(err);
     }
   });
   ```
4. **Avoid blocking**: Offload CPU-heavy tasks to worker threads
5. **Modularize**: Organize middleware into separate files

---

### **12. Execution Flow Diagram**

```
Request
   │
   ▼
┌───────────┐
│ Middleware│ (e.g., Logging)
└─────┬─────┘
      │
      ▼
┌───────────┐
│ Middleware│ (e.g., Auth)
└─────┬─────┘
      │
      ▼
┌───────────────┐
│ Route Handler │ (e.g., app.get())
└───────┬───────┘
        │
        ▼
     Response
        ▲
        │
┌───────┴───────┐
│ Error Handler │ (if error occurred)
└───────────────┘
```

---

### **13. Common Pitfalls**

1. **Forgetting `next()`**: Causes stalled requests
2. **Ordering errors**: Putting `body-parser` after routes
3. **Unhandled async errors**:

   ```javascript
   // WRONG: Uncaught promise rejection
   app.use(async (req, res, next) => {
     await riskyOperation(); // May crash app
   });

   // RIGHT: Use try/catch
   app.use(async (req, res, next) => {
     try {
       await riskyOperation();
       next();
     } catch (err) {
       next(err);
     }
   });
   ```

---

### **Summary**

Express middleware provides a powerful way to:

- **Intercept requests/responses**
- **Modify data flow**
- **Add cross-cutting concerns** (logging, auth, parsing)
- **Handle errors centrally**
- **Compose reusable logic**

By mastering middleware order, error propagation, and modular design, you build scalable, maintainable Express applications.

# step 9 : middleware in express

1. create middleware folder
2. create logger.js
3. `npm install chalk` for color logging

```js logger.js
// @desc Middleware logger request to console
export const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const methodColor = {
    GET: chalk.green,
    POST: chalk.yellow,
    PUT: chalk.blue,
    DELETE: chalk.red,
    PATCH: chalk.magenta,
    default: chalk.cyan,
  };

  // Get color based on request method or use default
  // Get the appropriate chalk function or use cyan as default
  const colorFn = methodColor[req.method] || chalk.cyan;

  // Format and log request information
  console.log(
    `[${timestamp}] ${colorFn(req.method)} ${req.protocol}://${req.get(
      "host"
    )}${req.originalUrl}`
  );
  next();
};
```

# step 10 : middleware logger - morgan

1. `npm install morgan` install morgan for logging
2. inside middleware folder add a customer color morganConfig.js

```js
import morgan from "morgan";
import chalk from "chalk";

export const coloredMorgan = () => {
  const methodColor = (method) => {
    switch (method) {
      case "GET":
        return chalk.green.bold(method);
      case "POST":
        return chalk.yellow.bold(method);
      case "PUT":
        return chalk.blue.bold(method);
      case "DELETE":
        return chalk.red.bold(method);
      case "PATCH":
        return chalk.magenta.bold(method);
      default:
        return chalk.cyan.bold(method);
    }
  };

  const statusColor = (status) => {
    if (!status) return chalk.gray("???");
    if (status >= 500) return chalk.red(status);
    if (status >= 400) return chalk.yellow(status);
    if (status >= 300) return chalk.cyan(status);
    return chalk.green(status);
  };

  return morgan((tokens, req, res) => {
    return [
      chalk.gray(`[${new Date().toISOString()}]`),
      methodColor(tokens.method(req, res)),
      chalk.white(tokens.url(req, res)),
      statusColor(tokens.status(req, res)),
      chalk.gray(`${tokens["response-time"](req, res)}ms`),
      chalk.gray(`- ${tokens.res(req, res, "content-length") || "0"}b`),
    ].join(" ");
  });
};
```

3. refactor the server.js

```js
import express from "express";
import dotenv from "dotenv";

import bootcamps from "./routes/bootcamps.js";
// import { logger } from "./middleware/logger.js";
import { coloredMorgan } from "./middleware/morganConfig.js";
// load env variables
dotenv.config({ path: "./config/config.env" });
const app = express();
// add middleware
// app.use(logger);
// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(coloredMorgan());
}

// mount routers
app.use("/api/v1/bootcamps", bootcamps);
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
```

# step 11 : postman concept

Beyond inspecting API methods, **Postman** serves several critical purposes in the API development lifecycle, enhancing productivity, collaboration, and reliability. Here are key use cases:

### 1. **Automated Testing & Validation**

- **Write test scripts** (JavaScript) to validate API responses (e.g., status codes, response bodies, performance).
- **Run collections as test suites** for regression testing, ensuring changes don’t break existing functionality.
- **Integrate with CI/CD pipelines** (e.g., Jenkins, GitHub Actions) for automated testing in deployment workflows.

### Deep Dive: Writing Test Scripts in Postman (Section 1)

Postman's test scripts use JavaScript to automate API validation. Here's a step-by-step guide with practical examples:

---

#### **1. Where to Write Tests**

- Access the **Tests** tab in your request editor
- Use the right-side **snippets** for quick templates
- Write custom JavaScript in the editor

![Postman Tests Tab](https://assets.postman.com/postman-docs/v10/tests-tab-v10.jpg)

---

#### **2. Basic Test Structure**

```javascript
// Basic test template
pm.test("Test Description", () => {
  // Assertions go here
  pm.expect(true).to.be.true;
});
```

---

#### **3. Essential Validation Scripts**

**a) Status Code Check**

```javascript
pm.test("Status 200 OK", () => {
  pm.response.to.have.status(200);
});
```

**b) Response Time Benchmark**

```javascript
pm.test("Response time < 500ms", () => {
  pm.expect(pm.response.responseTime).to.be.below(500);
});
```

**c) Header Validation**

```javascript
pm.test("Content-Type is JSON", () => {
  pm.response.to.have.header("Content-Type", "application/json");
});
```

**d) Body Content Check**

```javascript
pm.test("Response includes user ID", () => {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property("id");
  pm.expect(jsonData.id).to.be.a("number");
});
```

**e) Schema Validation**

```javascript
const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string", format: "email" },
  },
  required: ["name", "email"],
};

pm.test("Valid response schema", () => {
  pm.response.to.have.jsonSchema(schema);
});
```

---

#### **4. Advanced Testing Techniques**

**a) Chaining Requests with Variables**

```javascript
// Save auth token for next request
if (pm.response.code === 200) {
  const { token } = pm.response.json();
  pm.collectionVariables.set("auth_token", token);
}
```

**b) Dynamic Data Testing**

```javascript
// Verify created item matches sent data
pm.test("Created resource matches POST data", () => {
  const sentData = JSON.parse(pm.request.body.raw);
  const responseData = pm.response.json();

  pm.expect(responseData.title).to.eql(sentData.title);
  pm.expect(responseData.tags).to.include.members(sentData.tags);
});
```

**c) Fuzz Testing**

```javascript
// Test for SQL injection vulnerability
pm.test("SQL Injection Safe", () => {
  pm.expect(pm.response.text()).not.to.include(
    "You have an error in your SQL syntax"
  );
});
```

---

#### **5. Debugging & Output**

- Use `console.log()`:
  ```javascript
  console.log("Response time:", pm.response.responseTime);
  ```
- View logs in **Postman Console** (Ctrl+Alt+C / Cmd+Alt+C)
- Access response data:
  ```javascript
  pm.response.json(); // Parsed JSON body
  pm.response.text(); // Raw text body
  pm.response.headers; // Header object
  ```

---

#### **6. Running Tests**

1. **Manual execution**: Send request → View results in **Test Results** tab
2. **Automated runs**:
   - Use **Collection Runner**
   - Schedule via **Monitor**
   - Integrate with CI/CD using Newman CLI:
     ```bash
     newman run collection.json --reporters cli,json
     ```

---

#### **7. Pro Tips**

- **Reuse tests**: Save snippets as templates
- **Test sequencing**: Use `postman.setNextRequest()` in collection runs
- **External libraries**: Load Lodash/moment.js via Sandbox
- **Visualize data**: Create charts in tests tab:
  ```javascript
  pm.visualizer.set(template, {
    responseTime: pm.response.responseTime,
    payloadSize: pm.response.headers.get("Content-Length"),
  });
  ```

> 💡 **Example Output**  
> ![Test Results](https://assets.postman.com/postman-docs/v10/test-results-v10.jpg)

---

#### **8. Common Use Cases**

- Validate API contracts
- Performance benchmarking
- Security header checks
- Data integrity verification
- Regression testing after deployments

Start with simple status checks, then progressively add complex validations as your API matures!

### 2. **API Documentation**

- **Auto-generate human-readable docs** from collections (with examples, parameters, and descriptions).
- **Publish/share docs** internally or publicly, keeping them synced with API changes.

### Deep Dive: Writing API Documentation in Postman (Section 2)

Postman automatically generates interactive, visually clean documentation from your collections. Here's how to create effective API docs:

---

#### **1. Enable Auto-Documentation**

- Open a collection → **Documentation** tab → Click **Publish**
- Postman syncs docs with your collection in real-time
- _No manual writing required_ (but customization recommended)

![Postman Documentation Tab](https://assets.postman.com/postman-docs/v10/collection-docs-overview.jpg)

---

#### **2. Essential Documentation Elements**

**a) Collection-Level Description**

```markdown
# Payment API

Processes credit card payments. Requires authentication.

**Base URL**: `{{base_url}}/v1`

### Rate Limits

- 100 requests/minute
- 1,000 requests/day
```

**b) Request Descriptions**

```markdown
## Create Payment

`POST /payments`

Charges a credit card. Returns payment status.

### Requirements

- Valid API key in `X-API-Key` header
- PCI-compliant encryption
```

**c) Parameter Documentation**

````markdown
### Path Parameters

| Parameter  | Type   | Description                |
| ---------- | ------ | -------------------------- |
| `order_id` | string | Unique order ID (36 chars) |

### Headers

```json
{
  "X-API-Key": "your_live_key",
  "Content-Type": "application/json"
}
```
````

**d) Example Responses**

````markdown
### Success (200)

```json
{
  "id": "pay_12345",
  "status": "succeeded",
  "amount": 1999
}
```

### Failure (400)

```json
{
  "error": "invalid_card",
  "message": "CVV verification failed"
}
```
````

---

#### **3. Advanced Documentation Techniques**

**a) Code Snippets**  
Add executable examples in 20+ languages:

````markdown
```javascript
// Node.js Example
const response = await fetch(`${baseUrl}/payments`, {
  method: "POST",
  headers: {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ card: "tok_visa" }),
});
```
````

````

**b) Visual Workflows**
```mermaid
sequenceDiagram
    Client->>API: POST /payments
    API->>Stripe: Charge card
    Stripe-->>API: Payment status
    API-->>Client: Return payment ID
````

**c) Versioning**

1. Fork collection → "v2" branch
2. Update endpoints/descriptions
3. Publish as new version with changelog

---

#### **4. Customization Options**

| Feature            | How to Access                  | Use Case                         |
| ------------------ | ------------------------------ | -------------------------------- |
| **Custom CSS**     | Collection Settings → Themes   | Brand-aligned docs (colors/logo) |
| **Templates**      | Three-dot menu → Edit Template | Standardize error formats        |
| **Sidebar Order**  | Drag requests in collection    | Logical flow (auth → resources)  |
| **Embedded Media** | Markdown: `![Alt](image.png)`  | Add architecture diagrams        |

---

#### **5. Publishing Workflow**

1. **Internal Review**:
   ```markdown
   ::: warning[DRAFT]
   This endpoint is under development  
   :::
   ```
2. **Publish Options**:
   - Public URL (e.g., `https://your-api.docs.postman.com`)
   - Private (team-only)
   - Password-protected
3. **Automated Updates**:
   - Docs auto-sync when collection changes
   - Manage versions via history slider

![Publish Options](https://assets.postman.com/postman-docs/v10/docs-publish-options.jpg)

---

#### **6. Integration Examples**

**a) OpenAPI Sync**

```bash
# Convert collection to OpenAPI
postman collection convert -collection uid -output openapi.yaml
```

**b) Embed in Website**

```html
<iframe
  src="https://documenter.getpostman.com/view/123456/collection"
  width="100%"
  height="600"
>
</iframe>
```

**c) Slack Alerts**  
Set up notifications for:

- New version releases
- Documentation changes
- Broken example requests

---

#### **7. Best Practices**

1. **Human-Readable URLs**  
   `POST /v1/orders/{id}/cancel` ❌  
   `POST /v1/orders/:id/cancel` ✅

2. **Live Examples**

   - Attach real auth tokens (mark as sensitive)
   - Use environment variables:
     ```json
     "token": "{{prod_api_key}}"
     ```

3. **Status Badges**

   ```markdown
   ![Stable](https://img.shields.io/badge/status-stable-green)
   ![Deprecated](https://img.shields.io/badge/status-deprecated-red)
   ```

4. **Interactive Try-it**
   - Enable "Run in Postman" button
   - Pre-configure auth headers

---

#### **8. Example Output**

[![Postman Documentation Example](https://assets.postman.com/postman-docs/v10/docs-example-screenshot-v10.jpg)](https://learning.postman.com/docs/publishing-your-api/documenting-your-api/)

➔ **Live Demo**: [eCommerce API Documentation](https://documenter.getpostman.com/view/12959542/UVJbJ5r7)

---

> 💡 **Pro Tip**: Use Postman's **API Network** to discover/share public APIs like [Stripe](https://www.postman.com/stripedev/workspace/stripe-developers) and [Twitter\*\*.

### 3. **Mock Servers**

- **Simulate APIs before backend development** by creating mock endpoints with dummy responses.
- **Enable parallel work** between frontend/backend teams and test edge cases (e.g., errors, delays).

### Deep Dive: Mock Servers in Postman (Section 3)

A **mock server** in Postman simulates real API behavior without requiring a live backend. It returns predefined responses to API requests, enabling development and testing to continue independently of actual API implementation.

---

#### **1. How Mock Servers Work**

- **Request Matching**:  
  Compares incoming requests against saved examples in your collection
- **Response Simulation**:  
  Returns the closest matching example response (status code, headers, body)
- **Dynamic Variables**:  
  Supports `{{...}}` syntax for dynamic values (e.g., `{{$timestamp}}`)

![Mock Server Flow](https://assets.postman.com/postman-docs/mock-service-intro.jpg)

---

#### **2. Key Use Cases**

| Scenario                 | Benefit                                                   |
| ------------------------ | --------------------------------------------------------- |
| **Frontend Development** | Build UI against mock endpoints before backend is ready   |
| **Parallel Work**        | Backend/frontend teams work simultaneously                |
| **Testing Edge Cases**   | Simulate errors (500, 429), slow responses, or empty data |
| **Demoing APIs**         | Showcase functionality without exposing real systems      |
| **Contract Testing**     | Verify client app handles expected response formats       |

---

#### **3. Creating a Mock Server**

**Step 1: Define Examples**

1. Open a request → **Examples** tab
2. Click **Add Example**
3. Set:
   - **Status Code** (e.g., 200, 404)
   - **Response Body** (JSON/XML/text)
   - **Headers** (e.g., `Content-Type: application/json`)

```json
// Example: Successful user fetch
{
  "id": "user_123",
  "name": "Jane Doe",
  "status": "active"
}
```

**Step 2: Initialize Mock Server**

1. Click **New** → **Mock Server**
2. Link to collection/examples
3. Configure:
   - **Server Name** (e.g., `Prod API Simulator`)
   - **Environment** (optional)
   - **Delay** (simulate latency, 0-5 sec)
   - **Privacy** (public/private)

![Mock Server Setup](https://assets.postman.com/postman-docs/creating-mock-server.gif)

**Step 3: Use the Mock URL**

- Generated endpoint:
  ```bash
  https://<mock-id>.mock.pstmn.io/users
  ```
- Use like a real API:
  ```javascript
  fetch("https://your-mock-id.mock.pstmn.io/payments", {
    method: "POST",
    headers: { "X-API-Key": "test" },
  });
  ```

---

#### **4. Advanced Mocking Techniques**

**a) Dynamic Responses with Templates**  
Use Postman's template language for dynamic data:

```json
{
  "id": "{{$randomUUID}}",
  "name": "{{$randomFullName}}",
  "created_at": "{{$timestamp}}",
  "balance": "{{$randomInt}}"
}
```

**b) Conditional Responses**  
Add logic via collection pre-request scripts:

```javascript
// Return 403 if missing auth header
if (!pm.request.headers.get("Authorization")) {
  pm.mockResponse.set({
    status: 403,
    body: { error: "Unauthorized" },
  });
}
```

**c) Stateful Mocks**  
Simulate state changes using variables:

```javascript
// After POST /cart, update cart count
pm.variables.set("cart_items", 5);
```

---

#### **5. Managing Mock Servers**

| Feature            | Location                 | Use                         |
| ------------------ | ------------------------ | --------------------------- |
| **Call Logs**      | Mock server dashboard    | Audit requests/responses    |
| **Versioning**     | Collection history       | Sync mocks with API changes |
| **Usage Metrics**  | Monitor tab              | Track request volume        |
| **Regenerate URL** | Settings → Configuration | Rotate compromised URLs     |

---

#### **6. Real-World Example: E-Commerce Flow**

```mermaid
graph LR
  A[Frontend App] --> B[Mock: POST /login → 200 token]
  A --> C[Mock: GET /products → 20 items]
  A --> D[Mock: POST /cart → 403 if no token]
```

1. **Success Path**:
   ```http
   GET https://mock.pstmn.io/products → 200 OK
   ```
2. **Failure Path**:
   ```http
   DELETE /cart/123 → 404 (Item not found)
   ```
3. **Edge Case**:
   ```http
   POST /checkout → 429 (Rate limit exceeded)
   ```

---

#### **7. Best Practices**

1. **Mirror Production**:
   - Copy real API headers/status codes
   - Use similar response times (add 100-500ms delay)
2. **Cover All Scenarios**:  
   Create examples for:
   - 2xx (success)
   - 4xx (client errors)
   - 5xx (server errors)
3. **Automate Sync**:  
   Update mocks automatically when collections change
4. **Security**:
   - Avoid real secrets in examples
   - Set expiration for public mocks

---

#### **8. Limitations & Alternatives**

| Limitation                       | Workaround                                           |
| -------------------------------- | ---------------------------------------------------- |
| **No business logic**            | Use Postman Flows for basic logic                    |
| **Simple state simulation only** | Integrate with tools like Mockoon for advanced state |
| **Limited performance testing**  | Combine with k6/Loader.io                            |

> 💡 **Pro Tip**: Combine mocks with [Postman Monitors](https://learning.postman.com/docs/monitoring-your-api/intro-monitors/) to get alerts if your live API diverges from mocked behavior.

[![Postman Mock Demo](https://assets.postman.com/postman-docs/v10/mock-server-demo.gif)](https://youtu.be/4X2uk4XFVQk)

### 4. **Monitoring**

- **Schedule collection runs** (e.g., every hour) to monitor API uptime, performance, and correctness.
- **Get alerts** for failures via email/Slack.

### 5. **Collaboration & Governance**

- **Share collections, environments, and mocks** across teams via workspaces.
- **Version control** for API artifacts and track changes.
- **Enforce standards** (e.g., security headers) via pre-request scripts.

### 6. **Debugging & Troubleshooting**

- **Inspect raw HTTP traffic** (headers, cookies, timing) without browser limitations.
- **Console logs** for debugging scripts or network issues.

### 7. **Security Testing**

- **Validate authentication** (OAuth, JWT, API keys) and security headers.
- **Test for vulnerabilities** (e.g., injection flaws) by manipulating requests.

### Deep Dive: Security Testing in Postman (Section 7)

Postman enables comprehensive API security validation through script-based testing and manual manipulation. Here's how to conduct security tests effectively:

---

#### **1. Core Security Test Areas**

| Vulnerability         | Test Approach                 | Postman Feature Used  |
| --------------------- | ----------------------------- | --------------------- |
| **Authentication**    | Token validation, JWT expiry  | Pre-request Scripts   |
| **Injection**         | SQL/NoSQL/XSS payloads        | Dynamic Variables     |
| **Broken Access**     | Privilege escalation tests    | Multiple Environments |
| **Data Exposure**     | Sensitive data in responses   | Response Assertions   |
| **Misconfigurations** | Security headers verification | Header Inspection     |

---

#### **2. Step-by-Step Security Testing Guide**

**a) Authentication Tests**

```javascript
// 1. Test JWT expiration
pm.test("JWT not expired", () => {
  const token = pm.response.json().access_token;
  const decoded = jwt_decode(token); // Requires library
  pm.expect(decoded.exp * 1000).to.be.above(Date.now());
});

// 2. Validate token required
pm.sendRequest(
  {
    url: pm.request.url,
    method: "GET",
    headers: { Authorization: "" }, // Remove token
  },
  (_, res) => {
    pm.test("Block unauthorized access", () => {
      pm.expect(res.code).to.eql(401);
    });
  }
);
```

**b) Injection Attacks**

```javascript
// 3. SQL Injection test
const payloads = ["' OR 1=1--", "'; DROP TABLE users--", "1' ORDER BY 1--"];

payloads.forEach((payload) => {
  pm.sendRequest(
    {
      url: `${pm.variables.get("base_url")}/users?id=${payload}`,
      method: "GET",
    },
    (_, res) => {
      pm.test(`Block SQLi: ${payload}`, () => {
        pm.expect(res.text()).not.to.include("syntax error");
        pm.expect(res.code).to.be.oneOf([400, 403, 500]);
      });
    }
  );
});
```

**c) Access Control Tests**

```javascript
// 4. Privilege escalation
const adminEndpoint = "/admin/users";
pm.sendRequest(
  {
    url: pm.variables.get("base_url") + adminEndpoint,
    method: "GET",
    headers: {
      Authorization: `Bearer ${pm.variables.get("user_token")}`, // Non-admin token
    },
  },
  (_, res) => {
    pm.test("Block unauthorized admin access", () => {
      pm.expect(res.code).to.eql(403);
    });
  }
);
```

**d) Security Headers Validation**

```javascript
// 5. Critical headers check
const requiredHeaders = {
  "Strict-Transport-Security": "max-age=31536000",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

Object.entries(requiredHeaders).forEach(([header, value]) => {
  pm.test(`Header ${header} present`, () => {
    pm.response.to.have.header(header);
    pm.response.to.have.header(header, value);
  });
});
```

---

#### **3. Advanced Security Techniques**

**a) Fuzzing with Dynamic Data**

```javascript
// Generate 100 malicious inputs
const xssPayloads = Array(100)
  .fill()
  .map(() => {
    return `<script>alert('XSS-${Math.random()}')</script>`;
  });

xssPayloads.forEach((payload) => {
  pm.sendRequest(
    {
      url: `${pm.variables.get("base_url")}/search?q=${encodeURIComponent(
        payload
      )}`,
      method: "GET",
    },
    (_, res) => {
      pm.test(`XSS blocked: ${payload}`, () => {
        pm.expect(res.text()).not.to.include(payload);
      });
    }
  );
});
```

**b) Secrets Detection**

```javascript
// Scan for accidental secrets
pm.test("No credentials in response", () => {
  const body = pm.response.text();
  pm.expect(body).not.to.match(/[A-Za-z0-9]{32}/); // API keys
  pm.expect(body).not.to.match(/eyJhbGciOi.+/); // JWTs
  pm.expect(body).not.to.match(/AKIA[0-9A-Z]{16}/); // AWS keys
});
```

**c) Rate Limit Testing**

```javascript
// Test brute-force protection
const requests = Array(50)
  .fill()
  .map(() => ({
    url: pm.request.url,
    method: "POST",
    body: { login: "attacker", password: "guess" },
  }));

pm.sendRequest(requests, (_, responses) => {
  const blocked = responses.filter((res) => res.code === 429);
  pm.test("Rate limiting active", () => {
    pm.expect(blocked.length).to.be.above(5);
  });
});
```

---

#### **4. Security Workflow Automation**

1. **Create Security Collection**

   - Group tests by vulnerability type
   - Use environments for different targets (dev/staging)

2. **Schedule Daily Scans**

   ```mermaid
   graph LR
     A[Postman Monitor] -->|Hourly| B[Run Security Tests]
     B --> C[Slack Alert on Failure]
     C --> D[JIRA Auto-Ticket]
   ```

3. **CI/CD Integration**
   ```yaml
   # GitHub Actions Example
   - name: Security Scan
     run: |
       newman run security_tests.json \
         --env-var base_url=${{ secrets.TEST_URL }} \
         --reporters junit,cli
     continue-on-error: true # Don't block build
   ```

---

#### **5. Essential Security Assertions Library**

| Check Type            | Code Snippet                                                                       |
| --------------------- | ---------------------------------------------------------------------------------- |
| **JWT Structure**     | `pm.expect(token.split('.').length).eq(3)`                                         |
| **Password Strength** | `pm.expect(data.password.length).gt(12)`                                           |
| **Error Masking**     | `pm.expect(res.text()).not.include("DB password")`                                 |
| **CORS**              | `pm.expect(res.headers.get('Access-Control-Allow-Origin')).eq('trusted.com')`      |
| **Clickjacking**      | `pm.expect(res.headers.get('Content-Security-Policy')).include('frame-ancestors')` |

---

#### **6. Pro Tips & Tools**

1. **Import OWASP Tests**:
   ```bash
   postman collection run "OWASP Top 10"
   ```
2. **Use Dynamic Variables**:
   ```javascript
   // Generate test credit cards
   pm.variables.set("card", pm.creditCard.number("visa"));
   ```
3. **Integrate with Security Tools**:
   - [ ] **Burp Suite**: Proxy requests through Burp
   - [ ] **ZAP**: Run automated scans via Postman-ZAP integration
   - [ ] **Snyk**: Detect vulnerable dependencies in responses

> 🔒 **Critical**: Always get **written permission** before testing production systems. Use `--ignore-redirects` in Newman to avoid triggering WAF blocks.

[![Postman Security Testing](https://assets.postman.com/postman-docs/v10/security-testing-v10.gif)](https://youtu.be/MkCfP7Rk1jE)

### 8. **Workflow Automation**

- **Chain requests** (e.g., login → fetch data → update) using collection runner.
- **Persist data between requests** (e.g., save auth tokens to variables).

### 9. **Performance Testing**

- **Benchmark API latency** by running requests in bulk.
- **Identify bottlenecks** under simulated load (limited compared to dedicated tools).

### 10. **Environment Management**

    - **Switch contexts** (dev/staging/prod) using variables (e.g., `{{base_url}}`).
    - **Securely store secrets** (e.g., API keys) via environment variables.

---

### **Real-World Scenarios**

- **Developer onboarding**: Share a Postman collection to demo API usage.
- **Contract testing**: Verify APIs against OpenAPI specs.
- **Third-party integrations**: Test webhooks/callbacks from external services.

### **Alternatives?**

Tools like Insomnia, Thunder Client (VSCode), or CLI-based tools (e.g., `curl`/`httpie`) offer similar features, but Postman’s end-to-end ecosystem (testing → docs → mocks → monitoring) makes it a unified platform for teams.

# step 12 : postman environment collections

1. create postman workspace : give a name (very important)
2. create postman environments, `backend_node_api` (3.png)
3. create global variable for easy access (4.png), in variable tab add `url : http://localhost:5001/`
4. create a collection, if build by template the overview is the description of the project
5. for each collection by using {{URL}} (5.png) then we can easily change the url
6. create sub-folder under the collections for each api resources
7. create a request and `save as` that will add more description and under sub-folders. (6.png). This will ready for documentation
8. create CRUD request into sub-folder (7.png)

# Step 13 : monogoDB settings

1. create account on mongoDB
2. create cluster, select free tier
3. create database access setup username and password
4. create network access : 0.0.0.0/0 and current ip address
5. select cluster-> connect-> compass to connect to mongoDB, download mongoDB compass this time
6. start the compass, back to cluster-> connect-> compass, copy the connection string edit with login password

# step 14 : mongoose settings

1. install mongoose `npm install mongoose`
2. create config file inside config folder/db.js
3. put the connecting string inside config.env file, from mongoDB, cluster-> connect-> driver, copy the connection string and paste into config.env

```js config.env
NODE_ENV = development
PORT = 5001
MONGO_URI = mongodb+srv://aaronlungwai:1234@cluster0.26s1bk4.mongodb.net/devcamper?retryWrites=true&w=majority&appName=Cluster0
```

4. db.js

```js
import mongoose from "mongoose";
import chalk from "chalk";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      chalk.cyan.underline(`MongoDB Connected: ${conn.connection.host}`)
    );
  } catch (error) {
    console.error(chalk.red.underline.bold(`Error: ${error.message}`));
    process.exit(1);
  }
};

export default connectDB;
```

5. insert connectDB() into server.js

```js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import bootcamps from "./routes/bootcamps.js";
// import { logger } from "./middleware/logger.js";
import { coloredMorgan } from "./middleware/morganConfig.js";

// load env variables
dotenv.config({ path: "./config/config.env" });

// connect to database
connectDB();
const app = express();
// add middleware
// app.use(logger);
// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(coloredMorgan());
}

// mount routers
app.use("/api/v1/bootcamps", bootcamps);
const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections in case mongoose fails
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
```

6. copy dump data from resources as \_data folder.

# step 15 : models

1. create models folder
2. create bootcamps.js
3. create bootcamp model

```js
import mongoose from "mongoose";
const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description can not be more than 500 characters"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid URL with HTTP or HTTPS",
    ],
  },
  phone: {
    type: String,
    maxlength: [20, "Phone number can not be longer than 20 characters"],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
      required: true,
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    // Array of strings
    type: [String],
    required: true,
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Other",
    ],
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [10, "Rating must can not be more than 10"],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Bootcamp", BootcampSchema);
```

# Step 16 : bootcamp crud

1. back to controllers folder->bootcamps.js, insert bootcamp model

```js
import Bootcamp from "../models/Bootcamp.js";
// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
export const getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
};

// @desc Get  bootcamp
// @route GET /api/v1/bootcamp/:id
// @access Public
export const getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "display bootcamp" });
};

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access Private
export const createBootcamp = (req, res, next) => {
  console.log(req.body);
  res.status(200).json({ success: true, msg: "Create new bootcamp" });
};

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
export const updateBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Update bootcamp" });
};

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
export const deleteBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "delete bootcamp" });
};
```

2. postman, workon Post, create a new preset for the header (7.png) that can help saving time to type in the same content type
3. in the body, copy one of the record and paste into the body
4. in the server.js, need to add body parser

```js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import bootcamps from "./routes/bootcamps.js";
// import { logger } from "./middleware/logger.js";
import { coloredMorgan } from "./middleware/morganConfig.js";

// load env variables
dotenv.config({ path: "./config/config.env" });

// connect to database
connectDB();
const app = express();

// # body parser
app.use(express.json());

// colored morgan
if (process.env.NODE_ENV === "development") {
  app.use(coloredMorgan());
}

// mount routers
app.use("/api/v1/bootcamps", bootcamps);
const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections in case mongoose fails
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
```

5. the data show be in the console
6. refactor the controller by adding the data into database
7. data should be inserted inside mongoDB
8. in case there is error, we add try catch for the time being, later will add error handling

```js
import Bootcamp from "../models/Bootcamp.js";
// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
export const getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
};

// @desc Get  bootcamp
// @route GET /api/v1/bootcamp/:id
// @access Public
export const getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "display bootcamp" });
};

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access Private
export const createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
export const updateBootcamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return res.status(400).json({ success: false });
  }
  res.status(200).json({ success: true, data: bootcamp });
};

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
export const deleteBootcamp = async (req, res, next) => {
  res.status(200).json({ success: true, msg: "delete bootcamp" });
};
```

# step 17 : get all bootcamps

1. first get all bootcamps, then get one bootcamp
2. testing the api by postman, first run the getBootcamps, copy one of the record \_id and paste into the getBootcamp request api
3. getBootCamps is simply
4. getBootcamp has 2 possible errors, one is not found and the other is wrong params format

```js
import Bootcamp from "../models/Bootcamp.js";
// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
export const getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({ success: true, data: bootcamps });
  } catch (error) {}
  res.status(400).json({ success: false });
};

// @desc Get  bootcamp
// @route GET /api/v1/bootcamp/:id
// @access Public
export const getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    // if there is no bootcamp
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    // get numbers of records
    res
      .status(200)
      .json({ success: true, count: bootcamp.length, data: bootcamp });
  } catch (error) {
    // the data param is wrong format
    res.status(400).json({ success: false });
  }
};

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access Private
export const createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
export const updateBootcamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return res.status(400).json({ success: false });
  }
  res.status(200).json({ success: true, data: bootcamp });
};

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
export const deleteBootcamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return res.status(400).json({ success: false });
  }
  res.status(200).json({ success: true, data: {} });
};
```

# step 18 : update and delete with id

1. update and delete with id, testing the api by postman by using the same \_id
2. from the postman, copy the \_id based on return value from create bootcamp

```js
import Bootcamp from "../models/Bootcamp.js";
// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
export const getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) {}
  res.status(400).json({ success: false });
};

// @desc Get  bootcamp
// @route GET /api/v1/bootcamp/:id
// @access Public
export const getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access Private
export const createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
export const updateBootcamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return res.status(400).json({ success: false });
  }
  res.status(200).json({ success: true, data: bootcamp });
};

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
export const deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    return res.status(400).json({ success: false });
  }
};
```
