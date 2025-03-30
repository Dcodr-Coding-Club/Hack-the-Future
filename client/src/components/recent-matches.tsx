import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';
import { ProgressCircle } from '@/components/ui/progress-circle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Download } from 'lucide-react';

const RecentMatches: React.FC = () => {
  const { data: matches, isLoading } = useQuery({
    queryKey: ['/api/matches'],
  });

  const { data: jobs } = useQuery({
    queryKey: ['/api/jobs'],
  });

  const { data: candidates } = useQuery({
    queryKey: ['/api/candidates'],
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Function to get job title and department
  const getJobInfo = (jobId: number) => {
    const job = jobs?.find(j => j.id === jobId);
    return {
      title: job?.title || 'Unknown Position',
      department: job?.department || 'Unknown'
    };
  };

  // Function to get candidate info
  const getCandidateInfo = (candidateId: number) => {
    const candidate = candidates?.find(c => c.id === candidateId);
    return {
      name: candidate?.name || 'Unknown Candidate',
      email: candidate?.email || 'unknown@example.com',
      skills: candidate?.skills || []
    };
  };

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Shortlisted</Badge>;
      case 'reviewing':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Reviewing</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Matches</h3>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your most recent candidate matches
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-1 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-1 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Candidate
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Position
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Match Score
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Key Skills
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Matched
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading recent matches...
                </td>
              </tr>
            ) : !matches || matches.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No match data available.
                </td>
              </tr>
            ) : (
              matches.map((match: any) => {
                const candidateInfo = getCandidateInfo(match.candidateId);
                const jobInfo = getJobInfo(match.jobId);
                
                // For display, just take 3 top skills
                const topSkills = (match.skillMatches || [])
                  .sort((a: any, b: any) => b.matchPercentage - a.matchPercentage)
                  .slice(0, 3)
                  .map((sm: any) => sm.skill);
                
                // Get match label based on score
                const getMatchLabel = (score: number) => {
                  if (score >= 80) return 'Strong Match';
                  if (score >= 60) return 'Good Match';
                  return 'Low Match';
                };
                
                return (
                  <tr key={match.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                          <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {candidateInfo.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {candidateInfo.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{jobInfo.title}</div>
                      <div className="text-sm text-gray-500">{jobInfo.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ProgressCircle 
                          value={match.matchScore} 
                          size={40} 
                          strokeWidth={2} 
                          className="flex-shrink-0 mr-2"
                        />
                        <span className="text-sm text-gray-900 font-medium">
                          {getMatchLabel(match.matchScore)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {topSkills.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            {skill}
                          </Badge>
                        ))}
                        {topSkills.length === 0 && (
                          <span className="text-sm text-gray-500">No skills data</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(match.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(match.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="link" className="h-auto p-0">View</Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentMatches;
