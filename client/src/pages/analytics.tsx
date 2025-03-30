import React from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Activity, Users, Briefcase, Medal, TrendingUp, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Statistics {
  totalResumes: number;
  strongMatches: number;
  processingErrors: number;
  avgProcessingTime: number;
}

export default function Analytics() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { toast } = useToast();

  const { data: statistics, isLoading: statisticsLoading } = useQuery<Statistics>({
    queryKey: ["/api/statistics"],
  });

  const handleExport = () => {
    toast({
      title: "Export Feature",
      description: "Export functionality will be implemented in future versions.",
    });
  };

  const handleFilter = () => {
    toast({
      title: "Filter Analytics",
      description: "Filter functionality will be implemented in future versions.",
    });
  };

  // Mock data for charts
  const matchData = [
    { name: "Strong Match", value: statistics?.strongMatches || 0, color: "#4ade80" },
    { name: "Good Match", value: ((statistics?.totalResumes || 0) * 0.3), color: "#facc15" },
    { name: "Low Match", value: ((statistics?.totalResumes || 0) * 0.2), color: "#f87171" },
  ];

  const skillGapData = [
    { name: "JavaScript", gap: 15 },
    { name: "React", gap: 12 },
    { name: "Node.js", gap: 20 },
    { name: "TypeScript", gap: 25 },
    { name: "Python", gap: 10 },
    { name: "AWS", gap: 30 },
  ];

  const timelineData = [
    { name: "Jan", candidates: 4 },
    { name: "Feb", candidates: 7 },
    { name: "Mar", candidates: 12 },
    { name: "Apr", candidates: 9 },
    { name: "May", candidates: 15 },
    { name: "Jun", candidates: 20 },
  ];

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
          <h1 className="text-lg font-semibold">Analytics</h1>
          <div className="w-6"></div> {/* Empty div for balance */}
        </div>
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="md:flex md:items-center md:justify-between mb-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Analytics Dashboard
                </h1>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
                <Button variant="outline" size="sm" onClick={handleFilter}>
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button size="sm" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                      <h3 className="text-2xl font-bold">{statistics?.totalResumes || 0}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Medal className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Strong Matches</p>
                      <h3 className="text-2xl font-bold">{statistics?.strongMatches || 0}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Briefcase className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                      <h3 className="text-2xl font-bold">5</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Activity className="h-6 w-6 text-amber-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg. Processing Time</p>
                      <h3 className="text-2xl font-bold">{statistics?.avgProcessingTime || 0}s</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Match Distribution</CardTitle>
                  <CardDescription>
                    Overview of match quality across all candidates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={matchData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {matchData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Skill Gaps</CardTitle>
                  <CardDescription>
                    Most common skill gaps across candidates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={skillGapData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="gap" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Candidate Acquisition Timeline</CardTitle>
                <CardDescription>
                  Number of candidates processed over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timelineData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="candidates" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}