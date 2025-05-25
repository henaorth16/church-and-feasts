# ⛪ Church & Feasts API

Welcome to the **Church & Feasts API**, a backend system designed to manage churches, feasts, and the spiritual calendar in a structured and secure way. It supports multi-role authentication (Admin & Church users), relationship mapping between churches and feasts, and provides clean REST endpoints to create, update, and delete spiritual events.

This API is tailored to support mobile or web clients for church community apps, event reminders, and feast tracking.

---

## 🌐 Base URL

```
https://church-and-feasts.vercel.app/api
```

---

## 🔐 Authentication

- **JWT (JSON Web Token)**: Sent via HTTP-only cookies or optionally as Bearer token in headers.
- **Session Cookies**: Automatically handled after login (for web).
- **No third-party tools used for auth (e.g., Auth0 or Firebase).**

---

## 📦 JSON-Based Responses

All requests and responses use JSON.

---

## 🧑‍💼 Roles

- **ADMIN**: Manages church accounts and system-wide access.
- **CHURCH**: Can log in, manage feasts, and update their church profile.

---

## 📌 Endpoints

### 1. 🔑 Admin Login

**`POST /auth/admin/login`**

Logs in a user with admin role and sets a secure cookie.

```json
{
  "email": "admin@example.com",
  "password": "yourPassword"
}
```

Sets a secure, HTTP-only cookie: `token` (3-day expiry)

---

### 2. 🛐 Church Login

**`POST /auth/login`**

Logs in a church-role user.

---

### 3. 🚪 Logout

**`POST /auth/logout`**

Logs out the currently authenticated user.

---

### 4. 🔄 Change Password

**`PATCH /auth/change-password`**

For authenticated church users.

```json
{
  "currentPassword": "oldPass",
  "newPassword": "newSecurePass"
}
```

---

### 5. 🏛 Create or Update Church Profile

**`POST /church`**

```json
{
  "name": "St. Mary Church",
  "address": "123 Main St",
  "email": "contact@church.com",
  "phone": "123456789",
  "latitude": 9.03,
  "longitude": 38.74,
  "profileImage": "url-to-image",
  "servantCount": 15,
  "description": "A historic church..."
}
```

---

### 6. 🎉 Create a Feast for a Church

**`POST /church/create-feast`**

Creates a feast and links it to the authenticated church.

```json
{
  "saintName": "Saint George",
  "commemorationDate": "2025-04-23",
  "description": "Martyrdom of Saint George",
  "specialNotes": "Annual celebration"
}
```

---

### 7. ✍️ Manage Feasts

| Method | Endpoint | Description                |
|--------|----------|----------------------------|
| POST   | `/church/feasts`       | Create a general feast |
| PUT    | `/church/feasts/[id]`  | Update a feast          |
| DELETE | `/church/feasts/[id]`  | Delete a feast          |

---

### 8. 🔗 Manage Church-Feast Relationships

| Method | Endpoint                   | Description                       |
|--------|----------------------------|-----------------------------------|
| PUT    | `/profile/feasts/[id]`     | Update notes or details           |
| DELETE | `/profile/feasts/[id]`     | Unlink feast from church profile  |

---

## ⚠️ Error Responses

All errors are returned as:

```json
{
  "message": "Error description"
}
```

| Status | Description          |
|--------|----------------------|
| 200    | Success              |
| 201    | Created              |
| 400    | Validation error     |
| 401    | Unauthorized         |
| 404    | Not found            |
| 500    | Internal error       |

---

## 📲 Notes for Mobile Developers

- Store and send the `token` via `Authorization: Bearer <token>` if you're not using cookies.
- Use `commemorationDate` in `YYYY-MM-DD` format.
- Feasts are linked to churches via `churchFeast` data model.

---

## 📚 Tech Stack

- **Next.js API Routes (App Router)**
- **Prisma ORM**
- **PostgreSQL**
- **JWT Authentication**
- **Bcrypt for password hashing**

---

## 🤝 Contributing

If you’d like to improve or expand the project, feel free to fork and create pull requests.

---

## ✨ Acknowledgments

Built with a heart to serve the spiritual needs of the church and community through modern technology. Glory to God!

---