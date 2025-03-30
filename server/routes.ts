import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { insertCandidateSchema, insertJobPostingSchema, insertMatchSchema } from "@shared/schema";
import natural from "natural";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { WebSocketServer } from "ws";

// Set up multer for resume upload (in-memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// NLP tools for text analysis
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

// Helper function to extract skills from text
function extractSkills(text: string, commonSkills: string[]): string[] {
  if (!text) return [];
  
  const tokens = tokenizer.tokenize(text.toLowerCase());
  if (!tokens) return [];
  
  const stems = tokens.map(token => stemmer.stem(token));
  
  // Match common skills
  const skills: string[] = [];
  
  // First pass to collect matched skills
  for (const skill of commonSkills) {
    const skillLower = skill.toLowerCase();
    const skillStem = stemmer.stem(skillLower);
    if (text.toLowerCase().includes(skillLower) || stems.includes(skillStem)) {
      skills.push(skill);
    }
  }
  
  // Remove duplicates by using object keys
  const uniqueSkills: {[key: string]: boolean} = {};
  skills.forEach(skill => {
    uniqueSkills[skill] = true;
  });
  
  return Object.keys(uniqueSkills);
}

// Helper function to extract education from text
function extractEducation(text: string): string[] {
  if (!text) return [];
  
  const education: string[] = [];
  const degrees = ["bachelor", "master", "phd", "doctorate", "bs", "ba", "ms", "mba"];
  const lines = text.split('\n');
  
  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    if (degrees.some(degree => lowerLine.includes(degree)) || 
        lowerLine.includes("university") || 
        lowerLine.includes("college")) {
      education.push(line.trim());
    }
  });
  
  return education;
}

// Helper function to extract experience from text
function extractExperience(text: string): string[] {
  if (!text) return [];
  
  const experience: string[] = [];
  const lines = text.split('\n');
  let inExperienceSection = false;
  
  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes("experience") || lowerLine.includes("employment")) {
      inExperienceSection = true;
    } else if (lowerLine.includes("education") || lowerLine.includes("skills")) {
      inExperienceSection = false;
    } else if (inExperienceSection && line.trim().length > 10) {
      experience.push(line.trim());
    }
  });
  
  return experience;
}

// Common tech skills
const commonTechSkills = [
  "JavaScript", "TypeScript", "React", "Angular", "Vue.js", "Node.js", "Express", 
  "MongoDB", "PostgreSQL", "MySQL", "SQL", "NoSQL", "Python", "Java", "C#", "C++", 
  "PHP", "Ruby", "Swift", "Kotlin", "Go", "Rust", "HTML", "CSS", "Sass", "LESS", 
  "Bootstrap", "Material UI", "Tailwind CSS", "Git", "GitHub", "GitLab", "Bitbucket", 
  "CI/CD", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Firebase", "Redux", 
  "GraphQL", "REST API", "Microservices", "Agile", "Scrum", "Jira", "Confluence",
  "TDD", "BDD", "Jenkins", "Travis CI", "CircleCI", "Heroku", "Netlify", "Vercel",
  "Next.js", "Gatsby", "Webpack", "Babel", "ESLint", "Prettier", "Jest", "Mocha",
  "Chai", "Cypress", "Selenium", "Puppeteer", "Figma", "Sketch", "Adobe XD", "Photoshop",
  "Illustrator", "UI/UX", "Responsive Design", "Mobile Development", "Web Development",
  "Full Stack", "Frontend", "Backend", "DevOps", "Machine Learning", "Data Science",
  "AI", "Deep Learning", "NLP", "Computer Vision", "Big Data", "Hadoop", "Spark",
  "Tableau", "Power BI", "Excel", "Word", "PowerPoint", "Outlook", "Blockchain",
  "Cryptocurrency", "Ethereum", "Solidity", "IoT", "Embedded Systems", "Raspberry Pi",
  "Arduino", "Robotics", "AR/VR", "Game Development", "Unity", "Unreal Engine"
];

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - prefix with /api
  
  // Get all job postings
  app.get("/api/jobs", async (req: Request, res: Response) => {
    try {
      const jobs = await storage.getAllJobs();
      res.json(jobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      res.status(500).json({ message: "Failed to fetch job postings" });
    }
  });
  
  // Get a specific job posting
  app.get("/api/jobs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const job = await storage.getJob(id);
      
      if (!job) {
        return res.status(404).json({ message: "Job posting not found" });
      }
      
      res.json(job);
    } catch (err) {
      console.error("Error fetching job:", err);
      res.status(500).json({ message: "Failed to fetch job posting" });
    }
  });
  
  // Create a new job posting
  app.post("/api/jobs", async (req: Request, res: Response) => {
    try {
      const jobData = insertJobPostingSchema.parse(req.body);
      const newJob = await storage.createJob(jobData);
      res.status(201).json(newJob);
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating job:", err);
      res.status(500).json({ message: "Failed to create job posting" });
    }
  });
  
  // Get all candidates
  app.get("/api/candidates", async (req: Request, res: Response) => {
    try {
      const candidates = await storage.getAllCandidates();
      res.json(candidates);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      res.status(500).json({ message: "Failed to fetch candidates" });
    }
  });
  
  // Get a specific candidate
  app.get("/api/candidates/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const candidate = await storage.getCandidate(id);
      
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      
      res.json(candidate);
    } catch (err) {
      console.error("Error fetching candidate:", err);
      res.status(500).json({ message: "Failed to fetch candidate" });
    }
  });
  
  // Create a new candidate
  app.post("/api/candidates", async (req: Request, res: Response) => {
    try {
      const candidateData = insertCandidateSchema.parse(req.body);
      const newCandidate = await storage.createCandidate(candidateData);
      res.status(201).json(newCandidate);
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating candidate:", err);
      res.status(500).json({ message: "Failed to create candidate" });
    }
  });
  
  // Upload and parse resume
  app.post("/api/resume/parse", upload.single("resume"), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No resume file uploaded" });
      }
      
      // Get resume text from buffer
      const resumeText = req.file.buffer.toString("utf-8");
      
      // Extract information
      const skills = extractSkills(resumeText, commonTechSkills);
      const education = extractEducation(resumeText);
      const experience = extractExperience(resumeText);
      
      res.json({
        resumeText,
        skills,
        education,
        experience
      });
    } catch (err) {
      console.error("Error parsing resume:", err);
      res.status(500).json({ message: "Failed to parse resume" });
    }
  });
  
  // Match a candidate with a job
  app.post("/api/match", async (req: Request, res: Response) => {
    try {
      const { candidateId, jobId } = req.body;
      
      if (!candidateId || !jobId) {
        return res.status(400).json({ message: "Both candidateId and jobId are required" });
      }
      
      // Ensure IDs are numbers
      const candidateIdNum = typeof candidateId === 'string' ? parseInt(candidateId) : candidateId;
      const jobIdNum = typeof jobId === 'string' ? parseInt(jobId) : jobId;
      
      console.log(`Attempting to match candidate ID: ${candidateIdNum} with job ID: ${jobIdNum}`);
      
      const candidate = await storage.getCandidate(candidateIdNum);
      const job = await storage.getJob(jobIdNum);
      
      if (!candidate) {
        console.error(`Candidate with ID ${candidateIdNum} not found`);
        return res.status(404).json({ message: "Candidate not found" });
      }
      
      if (!job) {
        console.error(`Job with ID ${jobIdNum} not found`);
        return res.status(404).json({ message: "Job not found" });
      }
      
      // Perform matching algorithm
      const matchScore = calculateMatchScore(candidate, job);
      const skillMatches = calculateSkillMatches(candidate, job);
      const recommendations = generateRecommendations(candidate, job, skillMatches);
      
      // Create match record
      const matchData = {
        candidateId: candidateIdNum, // Use the parsed numeric IDs
        jobId: jobIdNum,
        matchScore,
        skillMatches,
        recommendations,
        status: "reviewing"
      };
      
      const match = await storage.createMatch(matchData);
      res.status(201).json(match);
    } catch (err) {
      console.error("Error matching candidate with job:", err);
      res.status(500).json({ message: "Failed to match candidate with job" });
    }
  });
  
  // Get all matches
  app.get("/api/matches", async (req: Request, res: Response) => {
    try {
      const matches = await storage.getAllMatches();
      res.json(matches);
    } catch (err) {
      console.error("Error fetching matches:", err);
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });
  
  // Get a specific match
  app.get("/api/matches/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const match = await storage.getMatch(id);
      
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      res.json(match);
    } catch (err) {
      console.error("Error fetching match:", err);
      res.status(500).json({ message: "Failed to fetch match" });
    }
  });
  
  // Update match status
  app.patch("/api/matches/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["reviewing", "shortlisted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedMatch = await storage.updateMatchStatus(id, status);
      
      if (!updatedMatch) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      res.json(updatedMatch);
    } catch (err) {
      console.error("Error updating match status:", err);
      res.status(500).json({ message: "Failed to update match status" });
    }
  });
  
  // Get statistics
  app.get("/api/statistics", async (req: Request, res: Response) => {
    try {
      const totalResumes = await storage.getProcessedResumesCount();
      const strongMatches = await storage.getStrongMatchesCount();
      const processingErrors = 0.8; // Hardcoded for now
      const avgProcessingTime = 14.2; // Hardcoded for now
      
      res.json({
        totalResumes,
        strongMatches,
        processingErrors,
        avgProcessingTime
      });
    } catch (err) {
      console.error("Error fetching statistics:", err);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });
  
  const httpServer = createServer(app);
  
  // WebSocket for real-time updates
  const wss = new WebSocketServer({ 
    server: httpServer,
    // Add path to avoid conflict with Vite's WebSocket
    path: "/api/ws"
  });
  
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    
    ws.on("message", (message) => {
      console.log("Received message:", message);
    });
    
    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });
  
  return httpServer;
}

// Helper functions for matching

function calculateMatchScore(candidate: any, job: any): number {
  // Simple matching algorithm - calculate percentage based on matching skills
  const jobRequirements = job.requirements as string[];
  const candidateSkills = candidate.skills as string[] || [];
  
  if (!jobRequirements.length) return 0;
  
  const matchCount = candidateSkills.filter(skill => 
    jobRequirements.some(req => req.toLowerCase().includes(skill.toLowerCase()))
  ).length;
  
  return Math.min(100, Math.round((matchCount / jobRequirements.length) * 100));
}

function calculateSkillMatches(candidate: any, job: any): any[] {
  const jobRequirements = job.requirements as string[];
  const candidateSkills = candidate.skills as string[] || [];
  const experience = candidate.experience as string[] || [];
  
  return candidateSkills.map(skill => {
    const isRequired = jobRequirements.some(req => 
      req.toLowerCase().includes(skill.toLowerCase())
    );
    
    // Estimate years of experience (simplified)
    const yearsMatch = experience.join(' ').match(new RegExp(`(\\d+)\\s*(?:years?|yrs?)\\s+(?:of\\s+)?(?:experience\\s+(?:with|in)\\s+)?${skill}`, 'i'));
    const yearsOfExperience = yearsMatch ? parseInt(yearsMatch[1]) : Math.floor(Math.random() * 5) + 1;
    
    // Determine skill level based on years
    let level;
    if (yearsOfExperience >= 5) level = "Expert";
    else if (yearsOfExperience >= 3) level = "Advanced";
    else if (yearsOfExperience >= 1) level = "Intermediate";
    else level = "Beginner";
    
    // Calculate match percentage
    const matchPercentage = isRequired ? Math.min(100, yearsOfExperience * 20) : 50;
    
    return {
      skill,
      level,
      yearsOfExperience,
      matchPercentage
    };
  });
}

function generateRecommendations(candidate: any, job: any, skillMatches: any[]): string[] {
  const recommendations: string[] = [];
  const jobRequirements = job.requirements as string[];
  
  // Identify skills gaps
  const weakSkills = skillMatches.filter(match => match.matchPercentage < 60);
  if (weakSkills.length > 0) {
    recommendations.push(`Additional training may be needed for ${weakSkills.map(s => s.skill).join(', ')}`);
  }
  
  // Identify missing required skills
  const candidateSkills = skillMatches.map(match => match.skill);
  const missingSkills = jobRequirements.filter(req => 
    !candidateSkills.some(skill => req.toLowerCase().includes(skill.toLowerCase()))
  );
  
  if (missingSkills.length > 0) {
    recommendations.push(`Candidate lacks experience in: ${missingSkills.join(', ')}`);
  }
  
  // Add general recommendations
  if (skillMatches.some(match => match.level === "Expert")) {
    recommendations.push("Has expert-level skills (potential mentor role)");
  }
  
  // Experience-related recommendations
  const experience = candidate.experience as string[] || [];
  if (experience.some(exp => exp.toLowerCase().includes("lead") || exp.toLowerCase().includes("manager"))) {
    recommendations.push("Has led teams of developers (leadership potential)");
  }
  
  return recommendations;
}
