import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/components/sidebar';
import { JobMatchingTool } from '@/components/job-matching-tool';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { JobPostingForm } from '@/components/job-posting-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, UserIcon, BarChart, Clock, Users, Briefcase, Zap, Search } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [isMatchingToolOpen, setIsMatchingToolOpen] = useState(false);
  const { toast } = useToast();

  const { data: jobs, isLoading: isJobsLoading } = useQuery<any[]>({
    queryKey: ['/api/jobs'],
  });

  const { data: candidates, isLoading: isCandidatesLoading } = useQuery<any[]>({
    queryKey: ['/api/candidates'],
  });

  const { data: matches, isLoading: isMatchesLoading } = useQuery<any[]>({
    queryKey: ['/api/matches'],
  });

  const { data: statistics } = useQuery<{
    totalResumes: number;
    strongMatches: number;
    processingErrors: number;
    avgProcessingTime: number;
  }>({
    queryKey: ['/api/statistics'],
  });

  const activeJobCount = jobs?.length || 0;
  const candidateCount = candidates?.length || 0;
  const matchesCount = matches?.length || 0;
  
  const handleNewJobClick = () => {
    setIsJobFormOpen(true);
  };
  
  const handleOpenMatchingTool = () => {
    setIsMatchingToolOpen(true);
  };

  const getRecentMatches = () => {
    if (!matches) return [];
    return [...matches].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }).slice(0, 5);
  };
  
  const getMatchStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'interviewing':
        return 'bg-blue-100 text-blue-800';
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const recentMatches = getRecentMatches();
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-500 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="w-6"></div> {/* Empty div for balance */}
        </div>
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="md:flex md:items-center md:justify-between mb-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Dashboard
                </h1>
              </div>
              <div className="mt-4 flex gap-2 md:mt-0 md:ml-4">
                <Button variant="outline" onClick={handleOpenMatchingTool}>
                  <Search className="mr-2 h-4 w-4" />
                  Match Candidates
                </Button>
                <Button onClick={handleNewJobClick}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Job Posting
                </Button>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold">{activeJobCount}</h3>
                  <p className="text-sm text-gray-500 mt-1">Job Postings</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-green-100 p-3 rounded-full mb-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold">{candidateCount}</h3>
                  <p className="text-sm text-gray-500 mt-1">Candidates</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold">{matchesCount}</h3>
                  <p className="text-sm text-gray-500 mt-1">Total Matches</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-amber-100 p-3 rounded-full mb-4">
                    <BarChart className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-3xl font-bold">{statistics?.strongMatches || 0}</h3>
                  <p className="text-sm text-gray-500 mt-1">Strong Matches</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activity */}
            <h2 className="text-xl font-semibold mb-4">Recent Matches</h2>
            
            {isMatchesLoading ? (
              <div className="space-y-2">
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : recentMatches.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="grid grid-cols-5 py-3 px-6 bg-gray-50 text-sm font-medium text-gray-500">
                  <div className="col-span-2">Candidate</div>
                  <div>Job</div>
                  <div>Match Score</div>
                  <div>Status</div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {recentMatches.map((match) => {
                    const candidate = candidates?.find(c => c.id === match.candidateId);
                    const job = jobs?.find(j => j.id === match.jobId);
                    
                    return (
                      <div key={match.id} className="grid grid-cols-5 py-4 px-6 text-sm">
                        <div className="col-span-2 font-medium text-gray-900">
                          {candidate?.name || 'Unknown Candidate'}
                        </div>
                        <div className="text-gray-700">
                          {job?.title || 'Unknown Job'}
                        </div>
                        <div>
                          <Badge variant={match.matchScore >= 70 ? "success" : match.matchScore >= 40 ? "warning" : "destructive"}>
                            {match.matchScore}%
                          </Badge>
                        </div>
                        <div>
                          <Badge className={getMatchStatusVariant(match.status)}>
                            {match.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <Search className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No matches yet</h3>
                  <p className="text-gray-500 mb-4">Start matching candidates with job postings.</p>
                  <Button onClick={handleOpenMatchingTool}>
                    Match Candidates
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
      
      {/* Forms and Tools */}
      <JobPostingForm
        open={isJobFormOpen}
        onOpenChange={setIsJobFormOpen}
      />
      
      <JobMatchingTool
        open={isMatchingToolOpen}
        onOpenChange={setIsMatchingToolOpen}
      />
    </div>
  );
};

export default Dashboard;
