# SkillHub 🚀

A full-stack MERN skill-sharing platform where developers can showcase their skills, connect with others, and discover talent.

---

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- Bcrypt Password Hashing

**Tools:**
- Nodemon
- Cookie-Parser
- CORS
- Dotenv

---

## 📁 Project Structure

```
src/
├── controllers/
│   ├── auth/
│   │   ├── register.js
│   │   ├── login.js
│   │   ├── logout.js
│   │   └── getCurrentUser.js
│   ├── user/
│   │   ├── getUser.js
│   │   └── updateUser.js
│   └── search/
│       └── search-user.js
├── db/
│   └── index.js
├── middlewares/
│   └── auth.middleware.js
├── models/
│   ├── user.models.js
│   ├── connection.models.js
│   ├── message.models.js
│   ├── follow.models.js
│   ├── skill.models.js
│   └── endorsements.models.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   └── search.routes.js
├── utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   └── asyncHandler.js
├── app.js
└── index.js
```

---

## ⚙️ Installation & Setup

**1. Clone the repository:**
```bash
git clone https://github.com/Sohaib-Arshid/Skill-Hub
cd skill-Hub
```

**2. Install dependencies:**
```bash
npm install
```

**3. Create `.env` file:**
```env
PORT=8000
MONGODB_URI=your_mongodb_uri
CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
```

**4. Run the server:**
```bash
npm run dev
```

---

## 🔗 API Endpoints

### 🔐 Auth Routes `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login user | ❌ |
| POST | `/logout` | Logout user | ✅ |
| GET | `/me` | Get current user | ✅ |

### 👤 User Routes `/api/user`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/:id` | Get public profile | ❌ |
| PATCH | `/update` | Update profile | ✅ |

### 🔍 Search Routes `/api/search`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/?skill=React` | Search users by skill | ❌ |

---

## 📝 API Usage Examples

### Register User
```json
POST /api/auth/register
{
  "name": "Sohaib Arshid",
  "email": "sohaib@gmail.com",
  "password": "123456",
  "skills": ["React", "Node.js"]
}
```

### Login User
```json
POST /api/auth/login
{
  "email": "sohaib@gmail.com",
  "password": "123456"
}
```

### Update Profile
```json
PATCH /api/user/update
Headers: Authorization: Bearer <token>
{
  "name": "Sohaib Arshid",
  "bio": "Full Stack Developer",
  "skills": ["React", "Node.js", "MongoDB"]
}
```

### Search by Skill
```
GET /api/search?skill=React
```

---

## 🔒 Authentication

This project uses **JWT (JSON Web Tokens)** for authentication.

- After login, an `accessToken` is returned
- Pass the token in the `Authorization` header:
```
Authorization: Bearer <your_token>
```
- Tokens are also stored in **HTTP-only cookies** for security

---

## 🚧 Phase 2 (Coming Soon)

- [ ] Connection Request System
- [ ] Follow / Unfollow System
- [ ] Skill Endorsement
- [ ] Messaging System

---

## 👨‍💻 Author

**Sohaib Arshid**
- GitHub: [@ySohaib-Arshid](https://github.com/Sohaib-Arshid/Skill-Hub)

---

## 📄 License

This project is licensed under the ISC License.
