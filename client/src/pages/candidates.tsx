import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Candidate } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/sidebar";
import { FilePlus, Filter, Download, Upload, Briefcase, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResumeUploadForm } from "@/components/resume-upload-form";

export default function Candidates() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const { toast } = useToast();

  const { data: candidates, isLoading } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"],
  });

  const filteredCandidates = React.useMemo(() => {
    if (!candidates || !filterText) return candidates;
    
    return candidates.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(filterText.toLowerCase()) ||
        (candidate.title?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
        (candidate.skills || []).some(skill => 
          skill.toLowerCase().includes(filterText.toLowerCase())
        )
    );
  }, [candidates, filterText]);

  const handleExport = () => {
    // Prepare data for export
    if (!candidates || candidates.length === 0) {
      toast({
        title: "No Data",
        description: "There are no candidates to export.",
        variant: "destructive"
      });
      return;
    }
    
    // Create CSV content
    const headers = ["Name", "Title", "Email", "Phone", "Skills"];
    const csvRows = [];
    
    csvRows.push(headers.join(','));
    
    for (const candidate of candidates) {
      const values = [
        `"${candidate.name}"`,
        `"${candidate.title || ''}"`,
        `"${candidate.email}"`,
        `"${candidate.phone || ''}"`,
        `"${(candidate.skills || []).join('; ')}"`,
      ];
      csvRows.push(values.join(','));
    }
    
    const csvString = csvRows.join('\n');
    
    // Create download link
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'candidates.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Export Complete",
      description: "Candidates data has been exported to CSV.",
    });
  };

  const handleAddCandidate = () => {
    setIsUploadFormOpen(true);
  };

  const handleFilter = () => {
    const text = prompt("Enter filter text:");
    if (text !== null) {
      setFilterText(text.toLowerCase());
    }
  };

  const handleUploadResume = () => {
    setIsUploadFormOpen(true);
  };

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
          <h1 className="text-lg font-semibold">Candidates</h1>
          <div className="w-6"></div> {/* Empty div for balance */}
        </div>
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="md:flex md:items-center md:justify-between mb-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Candidates
                </h1>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
                <Button variant="outline" size="sm" onClick={handleFilter}>
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={handleUploadResume}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Resume
                </Button>
                <Button size="sm" onClick={handleAddCandidate}>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Add Candidate
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {candidates?.map((candidate) => (
                  <Card key={candidate.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{candidate.name}</CardTitle>
                      <div className="text-sm text-gray-500">
                        {candidate.title || 'No Title'}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 text-sm text-gray-600 line-clamp-3">
                        {candidate.resumeText?.slice(0, 150) || 'No resume text available'}...
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills?.slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills && candidate.skills.length > 3 && (
                          <Badge variant="outline">
                            +{candidate.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {filterText && (
              <div className="mb-4 flex items-center">
                <div className="text-sm text-gray-500">
                  Filtering by: <span className="font-medium text-primary">{filterText}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setFilterText("")}
                  className="ml-2 h-7 px-2"
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <ResumeUploadForm
        open={isUploadFormOpen}
        onOpenChange={setIsUploadFormOpen}
      />
    </div>
  );
}