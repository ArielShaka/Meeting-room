# 🏢 Meeting Room Booking App

This is a full-stack meeting room booking app built with:

- **Frontend:** Next.js + Tailwind CSS (`meeting-room-frontend`)
- **Backend:** NestJS + TypeORM + PostgreSQL (`meeting-room-backend`)

Users can select rooms, pick date ranges, and book available time slots with ease.

## 🗂️ Project Structure

Meeting-room/ ├── backend/ │ └── meeting-room-backend/ # NestJS backend └── frontend/ └── meeting-room-frontend/ # Next.js frontend


---

## ⚙️ Getting Started

Make sure you have **Node.js**, **npm**, and **PostgreSQL** installed.

### 1. Start the Backend

In your terminal run:

 ```bash
cd backend/meeting-room-backend

npm install

npm run start:dev 
```

This starts the backend on [http://localhost:3000](http://localhost:3000).

---

### 2. Create and Populate Your Local Database

✅ **Make sure to create and populate your local database before continuing.**

⚠️ **Currently, you need to insert dummy data manually** (e.g. available rooms and times). This can be done using Postman or directly in your DB.

In your sql query console, run these commands:

-- To Insert rooms:

```bash
INSERT INTO room (name, capacity) VALUES 

('Ariel', 5), 

('Therese', 4), 

('Oliver', 10);
```

-- To Insert availability slots:

```bash
INSERT INTO availability (room_id, start_time, end_time, is_booked) VALUES

(1, '09:00:00', '10:00:00', false), 

(2, '10:00:00', '11:00:00', false), 

(3, '11:00:00', '12:00:00', false);
```

### Frontend Setup

1. **Start the Frontend**
   
   In a new terminal window, run the following commands to set up and start the frontend (Next.js + Tailwind CSS):

   ```bash
   cd frontend/meeting-room-frontend
   npm install
   npm run dev
