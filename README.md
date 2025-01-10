# Shopper

This repository contains the code for the Shopper website, which includes both the frontend and backend components.

## Technologies Used

- **Frontend**: The frontend is built using React, a popular JavaScript library for building user interfaces.
  - **React Router**: Used for handling routing in the application.
  - **CSS Modules**: Used for styling components with scoped CSS.
- **Admin Panel**: The admin panel is also built using React, providing a consistent development experience across the project.
  - **Vite**: A build tool that provides a faster and leaner development experience for modern web projects.
- **Backend**: The backend is built using Node.js and Express, providing a robust and scalable server-side solution.
  - **Express**: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
  - **MongoDB**: A NoSQL database used for storing application data.
  - **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.

## Directory Structure

### Frontend (React)

- `frontend/src/Components`: Contains reusable React components.
- `frontend/src/Pages`: Contains the main pages of the application.
- `frontend/src/Context`: Contains context providers for state management.
- `frontend/public`: Contains public assets like `index.html`.

### Admin Panel (React with Vite)

- `admin/src/Components`: Contains reusable React components for the admin panel.
- `admin/src/Pages`: Contains the main pages of the admin panel.
- `admin/public`: Contains public assets like `index.html`.

### Backend (Node.js with Express)

- `backend/routes`: Contains route definitions for the API.
- `backend/models`: Contains Mongoose models for MongoDB.
- `backend/controllers`: Contains controller functions for handling requests.
- `backend/upload`: Contains uploaded images and other files.

## Cloning the Repository

To clone the repository, run the following command:

```sh
# Step 1: Clone the repository
git clone https://github.com/lcv-back/shopper.git
```

```sh
## Step 2: Active frontend components
cd frontend
npm install
npm start
```

```sh
## Step 3: Active admin components
cd admin
npm install
npm run dev
```

```sh
## Step 4: Active backend components
cd backend
npm install
npm start or node index.js
```

```sh
## Login
Username: user.vilecong@gmail.com
Password: 12345678
```

### Some references if you want to read more information

- `reactjs`: https://legacy.reactjs.org/docs/getting-started.html
- `react-router-dom`: https://reactrouter.com/en/v6.3.0/getting-started/overview
- `vite`: https://vite.dev/guide/
- `nodejs`: https://nodejs.org/docs/latest/api/
- `expressjs`: https://expressjs.com/en/starter/installing.html
- `mongodb`: https://www.mongodb.com/docs/
- `mongoose`: https://mongoosejs.com/docs/guide.html

### Some key features i want develop next time

- Payment
- Discount
- Send notification to email address
