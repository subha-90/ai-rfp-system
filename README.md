AI-Powered RFP Management System

A full-stack web application that automates the procurement RFP lifecycle using AI.
Users can create RFPs, manage vendors, upload RFP documents, receive vendor proposals, and evaluate them using AI-driven scoring.

This project demonstrates practical use of AI in enterprise procurement workflows.

✅ What This App Does
1️⃣ Create RFPs

Create RFPs using a simple form

Add title, description, and category

Upload supporting RFP documents (PDF / DOCX)

2️⃣ Vendor Management

Add and manage vendors

Store vendor contact details

Use vendors when sending RFPs

3️⃣ Document Upload & Processing

Upload RFP documents

Backend extracts and stores document content

Documents are linked to an RFP

4️⃣ Proposal Handling (Backend Ready)

Infrastructure to receive vendor proposals

Proposals are parsed into structured data

Designed for email or API-based ingestion

5️⃣ AI-Based Evaluation

Vendor proposals can be evaluated using AI

Scores vendors based on:

Price

Delivery time

Warranty

Payment terms

Provides recommendation and score per vendor

🧠 Tech Stack
Frontend

React (Vite)

Tailwind CSS

React Router

Backend

Node.js

Express.js

Prisma ORM

PostgreSQL

AI

OpenAI API (can be replaced with local LLMs like Ollama)

File Handling

Multer (file uploads)

PDF / DOCX parsing

📁 Project Structure
ai-rfp-system/
├── backend/
│   ├── src/
│   │   ├── controllers
│   │   ├── routes
│   │   ├── services
│   │   ├── config
│   │   └── middleware
│   └── prisma/
│
├── frontend/
│   ├── src/
│   │   ├── pages
│   │   ├── components
│   │   └── api.js
│
└── README.md

▶️ How to Run the Project
1️⃣ Backend Setup
cd backend
npm install


Create .env file:

DATABASE_URL=postgresql://user:password@localhost:5432/rfp_db
OPENAI_API_KEY=your_api_key


Run database migrations:

npx prisma migrate dev


Start backend:

npm run start


Backend runs on:

http://localhost:4000

2️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs on:

http://localhost:5173

🧪 How to Use the App

Open the frontend in browser

Create a new RFP

Upload an RFP document (optional)

Add vendors

View RFP details

Evaluate vendor proposals (AI scoring)

⚠️ Notes

The app is designed for single-user / admin workflows

Email-based proposal ingestion and scheduled polling are backend-ready but optional

AI providers can be swapped (OpenAI → Ollama / local LLM)

🎯 Why This Project

This project focuses on:

Real-world enterprise workflows

Clean backend architecture

Practical AI integration

Production-ready frontend