import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { JobPosting, Candidate, Match, SkillMatch } from "@shared/schema";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck, CircleDashed, Search, Zap } from "lucide-react";

interface JobMatchingToolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialJobId?: number;
  initialCandidateId?: number;
}

export function JobMatchingTool({ 
  open, 
  onOpenChange, 
  initialJobId, 
  initialCandidateId 
}: JobMatchingToolProps) {
  const { toast } = useToast();
  const [selectedJobId, setSelectedJobId] = useState<number | null>(initialJobId || null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(initialCandidateId || null);
  const [processingMatch, setProcessingMatch] = useState(false);
  const [matchResult, setMatchResult] = useState<Match | null>(null);
  
  // Fetch jobs
  const { data: jobs } = useQuery<JobPosting[]>({
    queryKey: ["/api/jobs"],
    enabled: open,
  });
  
  // Fetch candidates
  const { data: candidates } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"],
    enabled: open,
  });
  
  // Get selected job and candidate
  const selectedJob = jobs?.find(job => job.id === selectedJobId);
  const selectedCandidate = candidates?.find(candidate => candidate.id === selectedCandidateId);
  
  // Create match mutation
  const createMatchMutation = useMutation({
    mutationFn: async () => {
      if (!selectedJobId || !selectedCandidateId) {
        throw new Error("Please select both a job and a candidate");
      }
      
      const response = await fetch("/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: selectedJobId,
          candidateId: selectedCandidateId,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create match");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setMatchResult(data);
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      
      toast({
        title: "Match Created",
        description: `Match score: ${data.matchScore}%`,
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create match",
        variant: "destructive",
      });
    },
  });
  
  const handleProcessMatch = async () => {
    if (!selectedJobId || !selectedCandidateId) {
      toast({
        title: "Selection Required",
        description: "Please select both a job and a candidate",
        variant: "destructive",
      });
      return;
    }
    
    setProcessingMatch(true);
    
    try {
      await createMatchMutation.mutateAsync();
    } finally {
      setProcessingMatch(false);
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-amber-600";
    return "text-red-600";
  };
  
  const getSkillColor = (match: number) => {
    if (match >= 70) return "bg-green-100 text-green-800";
    if (match >= 40) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };
  
  // Reset form when dialog is closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setMatchResult(null);
    }
    onOpenChange(open);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Job Matching Tool</DialogTitle>
          <DialogDescription>
            Compare a candidate against a job posting to see how well they match.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Job Selection */}
            <div>
              <label htmlFor="job" className="text-sm font-medium mb-2 block">
                Select Job
              </label>
              <Select
                value={selectedJobId?.toString() || ""}
                onValueChange={(value) => setSelectedJobId(parseInt(value, 10))}
              >
                <SelectTrigger id="job">
                  <SelectValue placeholder="Select a job posting" />
                </SelectTrigger>
                <SelectContent>
                  {jobs?.map((job) => (
                    <SelectItem key={job.id} value={job.id.toString()}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Candidate Selection */}
            <div>
              <label htmlFor="candidate" className="text-sm font-medium mb-2 block">
                Select Candidate
              </label>
              <Select
                value={selectedCandidateId?.toString() || ""}
                onValueChange={(value) => setSelectedCandidateId(parseInt(value, 10))}
              >
                <SelectTrigger id="candidate">
                  <SelectValue placeholder="Select a candidate" />
                </SelectTrigger>
                <SelectContent>
                  {candidates?.map((candidate) => (
                    <SelectItem key={candidate.id} value={candidate.id.toString()}>
                      {candidate.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Job and Candidate Details */}
          {(selectedJob || selectedCandidate) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {/* Job Details */}
              {selectedJob && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Selected Job</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium">{selectedJob.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{selectedJob.department}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedJob.requirements.slice(0, 3).map((req, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                      {selectedJob.requirements.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{selectedJob.requirements.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Candidate Details */}
              {selectedCandidate && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Selected Candidate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium">{selectedCandidate.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{selectedCandidate.title || 'No title'}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedCandidate.skills?.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {selectedCandidate.skills && selectedCandidate.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{selectedCandidate.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
          {/* Match Button */}
          <Button 
            onClick={handleProcessMatch} 
            disabled={!selectedJobId || !selectedCandidateId || processingMatch}
            className="mt-2"
          >
            {processingMatch ? (
              <>Processing...</>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Process Match
              </>
            )}
          </Button>
          
          {/* Match Results */}
          {matchResult && (
            <div className="space-y-4 mt-4">
              <Separator />
              
              <div className="flex flex-col items-center text-center p-4">
                <div className="text-3xl font-bold mb-2 flex items-center">
                  <span className={getScoreColor(matchResult.matchScore)}>
                    {matchResult.matchScore}%
                  </span>
                  <Zap className="ml-2 h-6 w-6 text-yellow-500" />
                </div>
                <p className="text-sm text-gray-500">Overall Match Score</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Skill Matches</h3>
                <div className="space-y-2">
                  {matchResult.skillMatches.map((skill: SkillMatch, idx: number) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center">
                        {skill.matchPercentage > 0 ? (
                          <CircleCheck className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <CircleDashed className="h-4 w-4 text-gray-400 mr-2" />
                        )}
                        <span className="text-sm">{skill.skill}</span>
                      </div>
                      <Badge className={getSkillColor(skill.matchPercentage)}>
                        {skill.matchPercentage}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              {matchResult.recommendations && matchResult.recommendations.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Recommendations</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {matchResult.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}