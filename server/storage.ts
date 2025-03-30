import { 
  users, type User, type InsertUser,
  jobPostings, type JobPosting, type InsertJobPosting,
  candidates, type Candidate, type InsertCandidate,
  matches, type Match, type InsertMatch,
  type SkillMatch
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Jobs
  getJob(id: number): Promise<JobPosting | undefined>;
  getAllJobs(): Promise<JobPosting[]>;
  createJob(job: InsertJobPosting): Promise<JobPosting>;
  
  // Candidates
  getCandidate(id: number): Promise<Candidate | undefined>;
  getAllCandidates(): Promise<Candidate[]>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  
  // Matches
  getMatch(id: number): Promise<Match | undefined>;
  getAllMatches(): Promise<Match[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatchStatus(id: number, status: string): Promise<Match | undefined>;
  
  // Statistics
  getProcessedResumesCount(): Promise<number>;
  getStrongMatchesCount(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private jobs: Map<number, JobPosting>;
  private candidatesMap: Map<number, Candidate>;
  private matchesMap: Map<number, Match>;
  
  currentUserId: number;
  currentJobId: number;
  currentCandidateId: number;
  currentMatchId: number;

  constructor() {
    this.users = new Map();
    this.jobs = new Map();
    this.candidatesMap = new Map();
    this.matchesMap = new Map();
    
    this.currentUserId = 1;
    this.currentJobId = 1;
    this.currentCandidateId = 1;
    this.currentMatchId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample jobs
    const sampleJobs: InsertJobPosting[] = [
      {
        title: "Senior Full Stack Developer",
        department: "Engineering",
        description: "We are looking for an experienced Full Stack Developer to join our engineering team. The ideal candidate will have extensive experience with React, Node.js, and database design.",
        requirements: [
          "5+ years experience with React",
          "Node.js & Express backend development",
          "Database design (PostgreSQL, MongoDB)",
          "CI/CD pipelines experience",
          "Bachelor's degree in CS or related field"
        ],
        status: "active"
      },
      {
        title: "UI/UX Designer",
        department: "Design",
        description: "We are seeking a talented UI/UX Designer to create beautiful and functional user interfaces for our web and mobile applications.",
        requirements: [
          "3+ years of UI/UX design experience",
          "Proficiency with Figma, Sketch, or Adobe XD",
          "Experience with design systems",
          "Knowledge of HTML, CSS, and JavaScript",
          "Portfolio of previous work"
        ],
        status: "active"
      },
      {
        title: "Product Manager",
        department: "Product",
        description: "We are looking for a Product Manager to lead our product development efforts and ensure we are building the right solutions for our customers.",
        requirements: [
          "5+ years of product management experience",
          "Experience with agile methodologies",
          "Strong analytical skills",
          "Excellent communication skills",
          "Technical background preferred"
        ],
        status: "active"
      },
      {
        title: "Data Scientist",
        department: "Data",
        description: "We are seeking a Data Scientist to help us extract insights from our data and build machine learning models to improve our products.",
        requirements: [
          "3+ years of data science experience",
          "Proficiency with Python, R, or Julia",
          "Experience with machine learning frameworks",
          "Strong statistical knowledge",
          "Master's degree in Statistics, Computer Science, or related field"
        ],
        status: "active"
      },
      {
        title: "DevOps Engineer",
        department: "Engineering",
        description: "We are looking for a DevOps Engineer to help us build and maintain our cloud infrastructure and CI/CD pipelines.",
        requirements: [
          "3+ years of DevOps experience",
          "Experience with AWS, Azure, or GCP",
          "Knowledge of Kubernetes and Docker",
          "Experience with CI/CD tools",
          "Scripting skills (Python, Bash, etc.)"
        ],
        status: "active"
      }
    ];
    
    sampleJobs.forEach(job => this.createJob(job));
    
    // Sample candidates
    const sampleCandidates: InsertCandidate[] = [
  {
    name: "Saransh Verma",
    email: "saransh.v@example.com",
    title: "Senior Frontend Developer",
    phone: "987-654-3210",
    resumeText: "Experienced frontend developer with 6 years of experience in React, TypeScript, and UI/UX design.",
    skills: ["React", "TypeScript", "UI/UX", "HTML", "CSS", "JavaScript"],
    education: ["Bachelor's in Computer Science, IIT Bombay"],
    experience: ["Senior Frontend Developer at Infosys, 3 years", "Frontend Developer at TCS, 3 years"]
  },
  {
    name: "Arpit Sharma",
    email: "arpit.s@example.com",
    title: "Full Stack Developer",
    phone: "876-543-2109",
    resumeText: "Full stack developer with 7 years of experience in React, Node.js, and database design.",
    skills: ["React", "Node.js", "Express", "PostgreSQL", "MongoDB", "JavaScript", "TypeScript", "Git"],
    education: ["Master's in Software Engineering, IIT Delhi"],
    experience: ["Full Stack Developer at Wipro, 4 years", "Backend Developer at HCL, 3 years"]
  },
  {
    name: "Gokul Nair",
    email: "gokul.n@example.com",
    title: "Software Engineer",
    phone: "765-432-1098",
    resumeText: "Software engineer with 5 years of experience in Java, Spring, and MySQL.",
    skills: ["Java", "Spring", "MySQL", "Hibernate", "Git", "Jenkins"],
    education: ["Bachelor's in Computer Engineering, IISc Bangalore"],
    experience: ["Software Engineer at Tata Consultancy Services, 3 years", "Junior Developer at Mindtree, 2 years"]
  }
];

sampleCandidates.forEach(candidate => this.createCandidate(candidate));

const sampleMatches: InsertMatch[] = [
  {
    candidateId: 1,
    jobId: 1,
    matchScore: 68,
    skillMatches: [
      { skill: "React", level: "Expert", yearsOfExperience: 6, matchPercentage: 95 },
      { skill: "TypeScript", level: "Advanced", yearsOfExperience: 4, matchPercentage: 80 },
      { skill: "UI/UX", level: "Intermediate", yearsOfExperience: 3, matchPercentage: 60 }
    ],
    recommendations: [
      "Additional training may be needed for CI/CD pipelines",
      "Strong frontend skills but limited backend experience",
      "Consider for frontend-focused role within the team"
    ],
    status: "reviewing"
  },
  {
    candidateId: 2,
    jobId: 1,
    matchScore: 85,
    skillMatches: [
      { skill: "React", level: "Expert", yearsOfExperience: 7, matchPercentage: 95 },
      { skill: "Node.js", level: "Advanced", yearsOfExperience: 5, matchPercentage: 85 },
      { skill: "PostgreSQL", level: "Intermediate", yearsOfExperience: 3, matchPercentage: 60 },
      { skill: "CI/CD", level: "Beginner", yearsOfExperience: 1, matchPercentage: 30 }
    ],
    recommendations: [
      "Additional training may be needed for CI/CD pipelines",
      "Has led teams of 3-5 developers (leadership potential)",
      "Ask about experience with large-scale database optimization"
    ],
    status: "shortlisted"
  },
  {
    candidateId: 3,
    jobId: 1,
    matchScore: 38,
    skillMatches: [
      { skill: "Java", level: "Expert", yearsOfExperience: 5, matchPercentage: 40 },
      { skill: "Spring", level: "Advanced", yearsOfExperience: 4, matchPercentage: 30 },
      { skill: "MySQL", level: "Advanced", yearsOfExperience: 4, matchPercentage: 50 }
    ],
    recommendations: [
      "Lacks core requirements for the role (React, Node.js)",
      "Consider for Java backend positions instead",
      "Would require significant training for this position"
    ],
      status: "rejected"
    }
  ];

  sampleMatches.forEach(match => this.createMatch(match));
}

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Job methods
  async getJob(id: number): Promise<JobPosting | undefined> {
    return this.jobs.get(id);
  }
  
  async getAllJobs(): Promise<JobPosting[]> {
    return Array.from(this.jobs.values());
  }
  
  async createJob(job: InsertJobPosting): Promise<JobPosting> {
    const id = this.currentJobId++;
    const createdAt = new Date();
    
    // Create a proper string array from requirements
    const requirements: string[] = [];
    if (job.requirements && Array.isArray(job.requirements)) {
      job.requirements.forEach(req => {
        if (typeof req === 'string') {
          requirements.push(req);
        }
      });
    }
    
    // Ensure proper typing for JobPosting
    const newJob: JobPosting = {
      id,
      title: job.title,
      department: job.department,
      description: job.description,
      requirements,
      status: job.status || "active",
      createdAt
    };
    
    this.jobs.set(id, newJob);
    return newJob;
  }
  
  // Candidate methods
  async getCandidate(id: number): Promise<Candidate | undefined> {
    return this.candidatesMap.get(id);
  }
  
  async getAllCandidates(): Promise<Candidate[]> {
    return Array.from(this.candidatesMap.values());
  }
  
  async createCandidate(candidate: InsertCandidate): Promise<Candidate> {
    const id = this.currentCandidateId++;
    const createdAt = new Date();
    
    // Create properly typed string arrays
    const experience: string[] = [];
    if (candidate.experience && Array.isArray(candidate.experience)) {
      candidate.experience.forEach(exp => {
        if (typeof exp === 'string') {
          experience.push(exp);
        }
      });
    }
    
    const education: string[] = [];
    if (candidate.education && Array.isArray(candidate.education)) {
      candidate.education.forEach(edu => {
        if (typeof edu === 'string') {
          education.push(edu);
        }
      });
    }
    
    const skills: string[] = [];
    if (candidate.skills && Array.isArray(candidate.skills)) {
      candidate.skills.forEach(skill => {
        if (typeof skill === 'string') {
          skills.push(skill);
        }
      });
    }
    
    // Ensure proper typing for Candidate
    const newCandidate: Candidate = {
      id,
      name: candidate.name,
      title: candidate.title || null,
      experience: experience.length > 0 ? experience : null,
      education: education.length > 0 ? education : null,
      skills: skills.length > 0 ? skills : null,
      createdAt,
      email: candidate.email,
      phone: candidate.phone || null,
      resumeText: candidate.resumeText || null
    };
    
    this.candidatesMap.set(id, newCandidate);
    return newCandidate;
  }
  
  // Match methods
  async getMatch(id: number): Promise<Match | undefined> {
    return this.matchesMap.get(id);
  }
  
  async getAllMatches(): Promise<Match[]> {
    return Array.from(this.matchesMap.values());
  }
  
  async createMatch(match: InsertMatch): Promise<Match> {
    const id = this.currentMatchId++;
    const createdAt = new Date();
    
    // Create a properly typed skillMatches array
    const skillMatches: SkillMatch[] = [];
    
    if (match.skillMatches && Array.isArray(match.skillMatches)) {
      match.skillMatches.forEach(sm => {
        if (sm && typeof sm === 'object') {
          const skill = 'skill' in sm && typeof sm.skill === 'string' ? sm.skill : '';
          const level = 'level' in sm && typeof sm.level === 'string' ? sm.level : '';
          const yearsOfExperience = 'yearsOfExperience' in sm && typeof sm.yearsOfExperience === 'number' ? 
            sm.yearsOfExperience : 0;
          const matchPercentage = 'matchPercentage' in sm && typeof sm.matchPercentage === 'number' ? 
            sm.matchPercentage : 0;
            
          if (skill && level) {
            skillMatches.push({
              skill,
              level,
              yearsOfExperience,
              matchPercentage
            });
          }
        }
      });
    }
    
    // Create a properly typed recommendations array
    const recommendations: string[] = [];
    if (match.recommendations && Array.isArray(match.recommendations)) {
      match.recommendations.forEach(rec => {
        if (typeof rec === 'string') {
          recommendations.push(rec);
        }
      });
    }
    
    // Ensure proper typing for Match
    const newMatch: Match = {
      id,
      candidateId: match.candidateId,
      jobId: match.jobId,
      matchScore: match.matchScore,
      skillMatches: skillMatches,
      recommendations: recommendations.length > 0 ? recommendations : null,
      status: match.status || "reviewing",
      createdAt
    };
    
    this.matchesMap.set(id, newMatch);
    return newMatch;
  }
  
  async updateMatchStatus(id: number, status: string): Promise<Match | undefined> {
    const match = this.matchesMap.get(id);
    if (!match) return undefined;
    
    const updatedMatch: Match = { ...match, status };
    this.matchesMap.set(id, updatedMatch);
    return updatedMatch;
  }
  
  // Statistics methods
  async getProcessedResumesCount(): Promise<number> {
    return this.candidatesMap.size;
  }
  
  async getStrongMatchesCount(): Promise<number> {
    return Array.from(this.matchesMap.values()).filter(match => match.matchScore >= 80).length;
  }
}

export const storage = new MemStorage();
