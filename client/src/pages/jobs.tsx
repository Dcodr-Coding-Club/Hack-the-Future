import React from "react";
import { useQuery } from "@tanstack/react-query";
import { JobPosting } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/sidebar";
import { FilePlus, Filter, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { JobPostingForm } from "@/components/job-posting-form";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export default function JobListings() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isJobFormOpen, setIsJobFormOpen] = React.useState(false);
  const [filterText, setFilterText] = React.useState("");
  const { toast } = useToast();

  const { data: jobs, isLoading } = useQuery<JobPosting[]>({
    queryKey: ["/api/jobs"],
  });

  const handleExport = async () => {
    try {
      // Create a CSV with job data
      const headers = ["Title", "Department", "Description", "Requirements", "Status"];
      const csvRows = [headers.join(",")];
      
      jobs?.forEach(job => {
        const requirements = job.requirements.map(req => `"${req}"`).join("; ");
        const row = [
          `"${job.title}"`,
          `"${job.department}"`,
          `"${job.description.replace(/"/g, '""')}"`,
          `"${requirements}"`,
          `"${job.status}"`
        ];
        csvRows.push(row.join(","));
      });
      
      const csvContent = csvRows.join("\n");
      
      // Create a download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `job_listings_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "The job listings have been exported as a CSV file.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the job listings.",
        variant: "destructive",
      });
    }
  };

  const handleAddJob = () => {
    setIsJobFormOpen(true);
  };

  const handleFilter = () => {
    const filterInput = window.prompt("Enter filter text (job title, department, or description):");
    if (filterInput !== null) {
      setFilterText(filterInput.toLowerCase());
    }
  };
  
  const filteredJobs = React.useMemo(() => {
    if (!filterText) return jobs;
    return jobs?.filter(
      job => 
        job.title.toLowerCase().includes(filterText) || 
        job.department.toLowerCase().includes(filterText) || 
        job.description.toLowerCase().includes(filterText)
    );
  }, [jobs, filterText]);

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
          <h1 className="text-lg font-semibold">Job Listings</h1>
          <div className="w-6"></div> {/* Empty div for balance */}
        </div>
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="md:flex md:items-center md:justify-between mb-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Job Listings
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
                <Button size="sm" onClick={handleAddJob}>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Add Job
                </Button>
              </div>
            </div>
            
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
            ) : filteredJobs && filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJobs.map((job) => (
                  <Card key={job.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <div className="text-sm text-gray-500">
                        {job.department}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 text-sm text-gray-600 line-clamp-3">
                        {job.description}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.slice(0, 3).map((req, idx) => (
                          <Badge key={idx} variant="secondary">
                            {req}
                          </Badge>
                        ))}
                        {job.requirements.length > 3 && (
                          <Badge variant="outline">
                            +{job.requirements.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No job listings found.</p>
                <Button
                  variant="outline"
                  onClick={handleAddJob}
                  className="mt-4"
                >
                  Add Your First Job
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <JobPostingForm 
        open={isJobFormOpen} 
        onOpenChange={setIsJobFormOpen} 
      />
    </div>
  );
}