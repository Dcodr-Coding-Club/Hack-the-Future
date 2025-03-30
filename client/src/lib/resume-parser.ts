import { apiRequest } from './queryClient';

export interface ParsedResume {
  resumeText: string;
  skills: string[];
  education: string[];
  experience: string[];
}

export async function parseResume(file: File): Promise<ParsedResume> {
  try {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await fetch('/api/resume/parse', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error parsing resume: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw error;
  }
}

export function extractKeySkills(text: string): string[] {
  // This is a simple extraction - the actual backend NLP will do better
  // Just for client-side preview
  if (!text) return [];
  
  const commonSkills = [
    "javascript", "typescript", "react", "angular", "vue", "node", "express", 
    "mongodb", "postgresql", "mysql", "sql", "nosql", "python", "java", "c#", 
    "php", "ruby", "swift", "kotlin", "go", "rust", "html", "css", "sass", 
    "bootstrap", "material ui", "tailwind", "git", "github", "docker", 
    "kubernetes", "aws", "azure", "gcp", "firebase", "redux", "graphql", 
    "rest api", "microservices", "agile", "scrum", "jira", "jenkins"
  ];
  
  const lowerText = text.toLowerCase();
  return commonSkills.filter(skill => lowerText.includes(skill));
}

export function estimateYearsOfExperience(text: string, skill: string): number {
  if (!text) return 0;
  
  const lowerText = text.toLowerCase();
  const regex = new RegExp(`(\\d+)\\s*(?:years?|yrs?)\\s+(?:of\\s+)?(?:experience\\s+(?:with|in)\\s+)?${skill}`, 'i');
  const match = lowerText.match(regex);
  
  if (match && match[1]) {
    return parseInt(match[1]);
  }
  
  // If we can't find an explicit mention, make a guess based on resume content
  // This is simplified - the backend would do more sophisticated analysis
  if (lowerText.includes(skill) && lowerText.includes('senior')) {
    return 5;
  } else if (lowerText.includes(skill) && lowerText.includes('lead')) {
    return 7;
  } else if (lowerText.includes(skill) && lowerText.includes('junior')) {
    return 1;
  }
  
  return lowerText.includes(skill) ? 3 : 0;
}
