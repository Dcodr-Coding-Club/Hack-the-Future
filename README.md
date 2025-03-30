## Project 1: Secure Multiparty Electronic Voting System
### Overview
This system ensures voter anonymity and result verifiability using Shamir’s secret sharing and homomorphic encryption.

### Running the Project
1. **Start the Main Server**
   ```bash
   python main.py
   ```
2. **Create 4 Authority Instances**
   - Using Docker:
     ```bash
     docker-compose up --scale authority

    ```
   OR using different ports manually:
     authority instances:
     port --4001
     port --4002
     port --4003
     port --4004
     ```
3. **Set Up User and Admin Interface**
   ```bash
   cd frontend
   npm i
   npm run dev
   ```

---

# AI/ML-Based Cryptographic Analysis & Secure Multiparty Electronic Voting System

## Project 2: AI/ML-Based Cryptographic Algorithm Detection
### Overview
This project leverages AI/ML algorithms to analyze datasets and determine cryptographic algorithms in use, identifying vulnerabilities and enhancing cybersecurity measures.

### Running the Project
1. **Open the Jupyter Notebook**
   - Launch Jupyter Notebook:
     ```bash
     jupyter notebook
     ```
   - Open the provided `.ipynb` file.
   - Run all cells to preprocess data, train models, and evaluate accuracy.

---
