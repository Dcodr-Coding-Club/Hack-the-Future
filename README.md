# SyncIDE (Real-Time Collaborative Code Editor)

## Team Name: Overflow.exe

### Team Members:
- Samadhan Erande
- Sakshi
- Gungun Agarwal
- Kartik Rathod
- Atharva Patil

## Project Description
SyncIDE is a real-time collaborative code editor that allows multiple users to work on code simultaneously. Users can create or join coding sessions using unique room IDs, enabling seamless collaboration and communication. The application supports various programming languages and features a user-friendly interface for coding, file management, and real-time updates. Additionally, it includes live voice chat and a chatbox for enhanced communication among collaborators.

### Features
- **Real-Time Collaboration**: Work with others in real-time on the same codebase.
- **Room Management**: Create and join rooms using unique IDs.
- **File Upload and Download**: Upload existing code files and download your work.
- **Language Support**: Supports multiple programming languages including JavaScript, Python, C, and C++.
- **Live Voice Chat**: Communicate with collaborators through voice chat during coding sessions.
- **Chatbox**: Engage in text-based conversations with team members while working on code.
- **User-Friendly Interface**: Intuitive design for easy navigation and coding.

### Technologies Used
- **Frontend**:
  - React.js
  - Socket.io
  - Monaco Editor
  - Tailwind CSS
  - Toaster (for notifications)
- **Backend**:
  - Node.js
  - Express.js


# SyncIDE

## Getting Started

Follow these steps to run the SyncIDE project locally after cloning it from GitHub.

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MongoDB](https://www.mongodb.com/) (for the backend database)
- [Git](https://git-scm.com/) (for cloning the repository)

### Cloning the Repository

1. Open your terminal or command prompt.
2. Clone the repository using the following command:

   ```bash
   git clone https://github.com/your-username/Hack-the-Future.git
   ```

3. Navigate to the project directory:

   ```bash
   cd Hack-the-Future
   ```

### Set Up Environment Variables
Create a .env file in the backend/ directory and add the following:
env
MONGO_URI=mongodb+srv://erandesamadhan2003:2LSWZKuiMpmfO14b@cluster0.lp0hxdi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
JWT_KEY=hello

### Setting Up the Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory and add your MongoDB connection string:

   ```plaintext
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. Start the backend server:

   ```bash
   npm start
   ```

### Setting Up the Frontend

1. Open a new terminal window and navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm start
   ```

### Accessing the Application

- Open your web browser and go to `http://localhost:3000` to access the SyncIDE application.

### Additional Notes

- Ensure that your MongoDB server is running before starting the backend.
- If you encounter any issues, check the console for error messages and ensure all dependencies are installed correctly.
