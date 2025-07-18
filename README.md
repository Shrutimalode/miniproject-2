<h1 align="center">🎓 ShikshaHub - Educational Platform</h1>

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-green" />
  <img src="https://img.shields.io/badge/React-v17.0.2-blue" />
  <img src="https://img.shields.io/badge/Node.js-v14+-green" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" />
</p>

> A **comprehensive learning platform** that connects **students, teachers**, and **educational content creators**.  
> Enables learning through communities, study materials, blogs, events, AI chatbot, and more.

---

## 📸 Demo

> _Add screenshots or a hosted demo link here_



---

## 🚀 Features

- 🔐 Role-based Authentication (JWT)
- 👨‍🏫 Community-based Learning
- 📚 Study Material Upload with Cloudinary
- ✍️ Blog Management with AI Summarization
- 📅 Event Creation within Communities
- 💬 Real-time Chat + AI Chatbot (Gemini)
- 📧 Automated Welcome Emails
- 📱 Responsive UI with React-Bootstrap

---

## 🧰 Tech Stack

### 🔹 Frontend

| Tool              | Purpose                          |
|-------------------|----------------------------------|
| React.js          | Frontend library                 |
| React Router DOM  | Routing                          |
| Bootstrap & React-Bootstrap | UI components         |
| Axios             | HTTP client                      |

### 🔸 Backend

| Tool              | Purpose                          |
|-------------------|----------------------------------|
| Node.js + Express | Server & routing                 |
| MongoDB + Mongoose| Database & modeling              |
| JWT + Bcryptjs    | Authentication & security        |
| Nodemailer        | Email handling                   |
| Multer            | File uploads                     |
| Google Gemini AI  | AI Chatbot & Blog Summary        |
| Cloudinary        | File hosting                     |

---

## 📁 Folder Structure

```bash
shikshahub/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── utils/
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── utils/
├── .env
├── README.md


📖 API Overview
🔐 Authentication - /api/auth
Register/Login with JWT tokens

Password encryption with Bcrypt

Sends Welcome Email on registration

🏫 Communities - /api/communities
Admins can create/manage communities

Users can join/leave and participate

📚 Study Materials - /api/materials
Upload via Multer to Cloudinary

Categorization & file search

✍️ Blogs - /api/blogs
Role-based blog approval

AI-powered Summarization (Gemini)

Blog interactions and comments

📅 Events - /api/communities/:id/events
Create/view events inside communities

Date, time, location, links supported

💬 Chat - /api/chat
Real-time messaging using Socket.io

AI Chatbot integration (Gemini)

### File Storage
- **Cloudinary storage for study materials**
- Secure file access (only authenticated users can upload)
- Organized storage structure in Cloudinary
- **Note:** Uploaded study materials are stored in Cloudinary and linked to materials in the database via their Cloudinary URLs.

## Features
1. User Authentication and Authorization
2. **Welcome Email Notifications** - Automated welcome emails for new users
3. Community-based Learning
4. Study Material Management
5. Educational Blogging
6. Real-time Chat System
7. File Upload and Management
8. AI Integration for Enhanced Learning (blog summarization, chatbot)
9. Responsive Design
10. **Event Management** - Create and manage events within communities

## Role-Based Permissions
- **Admin:** Can create communities, auto-approve their own blogs, review all blogs, manage all events and users.
- **Teacher:** Can review/approve/reject student blogs, create and join communities, create events.
- **Student:** Can join communities, create blogs (subject to approval), participate in events.
- **Community Events:** Only members of a community (admin, teacher, or student) can create/view events for that community.

## Email System

### Welcome Email Feature
- **Automated welcome emails** sent to newly registered users
- **Beautiful HTML email templates** with modern styling
- **Customizable content** including features list and call-to-action
- **Non-blocking email sending** - doesn't affect registration speed
- **Error handling** with detailed logging

### Email Setup
To enable email functionality, set the following environment variables in your `backend/.env`:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_DEBUG=true               # Optional: set to true for verbose email logs
```
- For Gmail, you must use an app password (not your regular Gmail password). Enable 2FA and generate an app password in your Google Account settings.

### Email Template Features
- Responsive HTML design
- Welcome badge display
- Feature highlights
- Call-to-action button
- Professional styling

## Blog System Features

### Blog Approval System
1. **Role-Based Approval:**
   - Admin blogs are auto-approved
   - Teacher blogs require admin approval
   - Student blogs can be approved by teachers or admins

2. **Approval Workflow:**
   - New blogs start in 'pending' status
   - Reviewers can approve or reject with feedback
   - Rejected blogs can be resubmitted after edits
   - Status changes to 'pending' when edited after approval

3. **Review Process:**
   - Teachers can review student blogs
   - Admins can review all blogs
   - Required feedback for rejections
   - Optional comments for approvals

### Blog Summarization
 **AI-Powered Summaries:**
   - Uses Google's Gemini AI model
   - Generates concise summaries
   - Available for all blog posts
   - Helps with quick content understanding



### Blog Management
1. **Content Types:**
   - Original content
   - Shared content with attribution
   - Source URL tracking
   - Author role tracking

2. **Content Organization:**
   - Tag-based categorization
   - Community-specific blogs
   - Search functionality
   - Status filtering

3. **User Permissions:**
   - Authors can edit their own blogs
   - Reviewers can approve/reject based on role
   - Community members can view approved blogs
   - Original authors can track content sharing

## Event System Features
- Create, view, and manage events within communities
- Only community members can create events
- Event details include title, description, links, location, date, and time
- Events are linked to their respective communities

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```
3. Set up environment variables (see below)
4. Start the development servers:
   ```bash
   # Frontend
   npm start

   # Backend
   npm run dev
   ```

## Environment Variables

### Backend (.env in backend directory)
Create a `.env` file in the `backend` directory with the following variables:
```
# Database Configuration
MONGO_URI=your_mongodb_uri     # Used by backend/server.js

# JWT Configuration
JWT_SECRET=your_jwt_secret

# Email Configuration (for welcome emails)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_DEBUG=true               # Optional: set to true for verbose email logs

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000

# AI Integration (Gemini API)
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=5000
NODE_ENV=development
```
- `GEMINI_API_KEY` is required for AI-powered blog summarization and chat features.
- `CLOUDINARY_*` variables are required for uploading and storing study materials in Cloudinary.

### Frontend (.env in frontend directory)
Create a `.env` file in the `frontend` directory if you want to override the default API URL:
```
REACT_APP_API_URL=http://localhost:5000/api
```
- By default, the frontend uses the deployed backend URL. Set this variable to use a local or custom backend during development.


## File Uploads with Cloudinary

Study materials uploaded through the platform are now stored securely in Cloudinary. The backend is configured to use Cloudinary for all material uploads, and the URLs to these files are saved in the database. This ensures reliable, scalable, and fast access to uploaded content.

- **Cloudinary Setup:** Ensure you have a Cloudinary account and set the required environment variables in your backend `.env` file.
- **Access:** Uploaded files are accessible via their Cloudinary URLs, which are returned in API responses and used throughout the platform.

--- 