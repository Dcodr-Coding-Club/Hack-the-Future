import { SkillMatch } from '@shared/schema';

/**
 * Calculate the match score between a candidate and a job
 */
export function calculateMatchScore(candidateSkills: string[], jobRequirements: string[]): number {
  if (!jobRequirements.length) return 0;
  
  const matchCount = candidateSkills.filter(skill => 
    jobRequirements.some(req => req.toLowerCase().includes(skill.toLowerCase()))
  ).length;
  
  return Math.min(100, Math.round((matchCount / jobRequirements.length) * 100));
}

/**
 * Get the match label (Strong Match, Good Match, Low Match) based on score
 */
export function getMatchLabel(score: number): string {
  if (score >= 80) return 'Strong Match';
  if (score >= 60) return 'Good Match';
  return 'Low Match';
}

/**
 * Calculate the skill match color based on the match percentage
 */
export function getMatchColor(matchPercentage: number): string {
  if (matchPercentage >= 80) return '#10B981'; // green-500
  if (matchPercentage >= 60) return '#F59E0B'; // amber-500
  return '#EF4444'; // red-500
}

/**
 * Get the skill level based on years of experience
 */
export function getSkillLevel(yearsOfExperience: number): string {
  if (yearsOfExperience >= 5) return 'Expert';
  if (yearsOfExperience >= 3) return 'Advanced';
  if (yearsOfExperience >= 1) return 'Intermediate';
  return 'Beginner';
}

/**
 * Format years of experience string
 */
export function formatYearsOfExperience(years: number): string {
  return years === 1 ? '1 year' : `${years} years`;
}

/**
 * Get recommendation for skill gaps
 */
export function getRecommendationsForSkillGaps(skillMatches: SkillMatch[], jobRequirements: string[]): string[] {
  const weakSkills = skillMatches.filter(match => match.matchPercentage < 60);
  
  if (weakSkills.length === 0) {
    return [];
  }
  
  return [`Additional training may be needed for ${weakSkills.map(s => s.skill).join(', ')}`];
}

/**
 * Get the status badge variant based on the match status
 */
export function getStatusVariant(status: string): string {
  switch (status) {
    case 'shortlisted':
      return 'success';
    case 'reviewing':
      return 'warning';
    case 'rejected':
      return 'destructive';
    default:
      return 'default';
  }
}
