# 📘 Database Architecture Documentation

## Project

**RahulKrRKN.com – Backend Platform**

This document defines the MongoDB database architecture, connection management
strategy, security model, and operational guidelines used in this project.
It is intended for **long-term maintenance, scalability, and onboarding**.

---

## 1. Technology Stack

- Backend: Node.js + TypeScript
- Database: MongoDB Atlas
- ODM: Mongoose
- Architecture: Single Cluster, Multiple Databases
- Environment: Dev / Prod via environment variables

---

## 2. High-Level Architecture

```text
MongoDB Atlas Cluster
├── auth_db
│   ├── users
│   ├── refresh_tokens
│   ├── email_verification_tokens
│   └── password_reset_tokens
│
├── site_db
│   ├── pages
│   ├── site_settings
│   └── visits
│
└── portfolio_db
    ├── projects
    ├── media
    └── metadata
```

### Core Principles

- One MongoDB Atlas cluster
- One database per logical domain
- Multiple collections per database
- No admin access from application code
- Clear separation between startup logic and runtime logic

---

## 3. Database Users & Permissions

### Database Users

| User            | Database     | Permissions |
| --------------- | ------------ | ----------- |
| auth_read_user  | auth_db      | read        |
| auth_write_user | auth_db      | read, write |
| site_user       | site_db      | read, write |
| portfolio_user  | portfolio_db | read, write |

### Security Rules

- Least-privilege access only
- No `atlasAdmin` or admin roles in production
- No delete permission for application users
- Credentials stored only in environment variables

---

## 4. Connection Management

### Connection Manager Location

All MongoDB connections are managed exclusively by:

`src/core/library/initDbConn.lib.ts`

This file is the **single source of truth** for MongoDB connections.

---

### initDbConn API

The only allowed API for accessing MongoDB connections is:

`initDbConn(key, uri?)`

#### Behavior

- **Startup phase**
  - Called with `(key + uri)`
  - Creates a MongoDB connection and connection pool
  - Stores it in memory
- **Runtime phase**
  - Called with `(key only)`
  - Reuses the existing connection pool
  - No new connections are created

#### Rules

- MongoDB URIs are used **only at startup**
- Runtime code never sees database credentials
- `mongoose.connect()` is forbidden outside startup code

---

## 5. Connection Key Strategy

### Key Registry Location

All MongoDB connection keys are defined in **one place**:

`src/core/library/dbConnectionKeys.ts`

Hardcoded string keys are **not allowed** anywhere else.

---

### Key Naming Convention

| Part   | Meaning           | Example                                       |
| ------ | ----------------- | --------------------------------------------- |
| db     | Database name     | auth                                          |
| scope  | collection or all | all                                           |
| access | permission type   | f(read) / w(write) / fui (find update insert) |

### Examples

- `auth_all_f`
- `auth_all_w`
- `auth_all_fui`
- `site_all_f`
- `site_all_w`
- `portfolio_all_f`
- `portfolio_all_w`

### Important Notes

- Keys are **logical identifiers**, not security controls
- Security is enforced by MongoDB users and roles
- Keys must be stable and lowercase

---

## 6. Folder Structure (Database-Related)

```
`src/`
├── `bootstrap/`
│ ├── `loadEnv.ts`
│ └── `initMongo.ts`
│
├── `core/`
│ ├── `config/`
│ | └── `mongoUrlBuilder.lib.ts`
│ |
│ ├── `library/`
│ | └── `initDbConn.lib.ts`
│ |
│ ├─ `schemas/`
│ | ├── `authUser.schema.ts`
│ | ├── `refreshToken.schema.ts`
```

---

## 7. Schema & Model Strategy

### Rules

- One schema per collection
- Schemas define data structure only
- Schemas are shared across models
- Models are connection-specific (read/write)
- No schema duplication

### Pattern

Schema → shared structure
Model → schema + connection

---

## 8. Auth Database (`auth_db`)

### users Collection

Purpose:

- User identity
- Authentication credentials
- Authorization roles

Key characteristics:

- Email is unique and indexed
- Passwords are stored as hashes only
- Sensitive fields are never exposed

---

### refresh_tokens Collection

Purpose:

- Session management
- Logout and logout-all functionality
- Multi-device support

Security characteristics:

- Tokens are stored as hashes
- Tokens are revocable
- Refresh token rotation is enforced
- TTL index auto-removes expired tokens

---

### email_verification_tokens

- One-time verification tokens
- Expiry enforced
- Token hashes only

---

### password_reset_tokens

- Secure password reset flow
- Single-use tokens
- Expiry enforced

---

## 9. Environment Variables

### Environment Files

```
`env/`
├── `.env`
├── `.env.auth`
├── `.env.site`
└── `.env.db`
```

### Rules

- Loaded once at application startup
- Loaded before any database initialization
- Managed per environment and provided by the deployment secret store
- Never committed to version control

---

## 10. Runtime Rules

### Allowed

- Reusing a single connection unlimited times
- Concurrent queries via connection pooling
- Multiple models using the same connection

### Forbidden

- Creating connections inside routes or services
- Using mongoose.connect() outside startup
- Logging database credentials
- Hardcoding connection keys

---

## 11. Scaling Strategy

### Vertical Scaling

- Upgrade MongoDB Atlas tier
- Adjust connection pool size

### Horizontal Scaling

- Multiple Node.js processes or containers
- Each process maintains its own connection pools

### Future Isolation

- Databases can be moved to separate clusters
- No application-level refactor required

---

## 12. Operational Guidelines

### Monitoring

- Monitor connection count in MongoDB Atlas
- Track slow queries
- Configure alerts for spikes

### Backups

- Automated Atlas backups enabled
- Point-in-time recovery for production

---

## Core Principles (Summary)

1. Schemas define data
2. Models define access
3. Connections define permissions
4. One connection, unlimited usage
5. Security before convenience

---

## Status

- Architecture: Production-ready
- Security: High
- Scalability: Future-proof
- Maintainability: Excellent
