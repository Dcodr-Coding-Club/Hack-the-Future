# ResuMatch - Easy Resume Screening Tool

ResuMatch helps you find the right people for your jobs by looking at resumes and matching them to what you need.

## What You'll Need (Windows Only)

1. A Windows computer
2. Internet connection

## How to Install (Windows)

### Step 1: Install Node.js

1. Go to [Node.js website](https://nodejs.org/)
2. Click the big green button that says "LTS" (stands for Long Term Support)
3. After download finishes, click the file to start installation
4. Click "Next" for all prompts (all default settings are fine)
5. Wait for installation to complete and click "Finish"

### Step 2: Set Up ResuMatch

1. Right-click the ResuMatch ZIP file you downloaded
2. Select "Extract All..."
3. Choose where you want to put the files and click "Extract"
4. Open the extracted folder

### Step 3: Install and Start the App

1. Press and hold Shift key, then right-click in an empty area of the folder
2. Select "Open command window here" or "Open PowerShell window here"
3. Type this command and press Enter:
   ```
   npm install
   ```
4. Wait until it finishes (this might take a few minutes)
5. Type this command and press Enter:
   ```
   npm run dev
   ```
6. When you see a message saying the server is running, open your web browser
7. Type `http://localhost:3000` in the address bar and press Enter

## Using ResuMatch

### Add a Job
1. Click "Jobs" in the sidebar
2. Click the "Add Job Posting" button
3. Fill in the job details
4. Type each skill needed and press Enter
5. Click "Create Job Posting"

### Add a Candidate
1. Click "Candidates" in the sidebar
2. Click "Upload Resume"
3. Fill in the name and details
4. Click "Choose File" to upload a resume
5. Click "Submit"

### Match Candidates to Jobs
1. Click "Match" from any screen
2. Select a job and a candidate
3. See how well they match
4. Save the match result

## Need Help?

If something isn't working:

1. Make sure you installed Node.js correctly
2. Try running `npm install` again
3. Restart your computer and try again
4. If a message says "port in use", close other programs and try again

The app works best with Microsoft Edge or Google Chrome browsers.