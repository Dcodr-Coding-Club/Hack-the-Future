import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Upload, File, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { parseResume } from "@/lib/resume-parser";
import { insertCandidateSchema } from "@shared/schema";

const candidateSchema = insertCandidateSchema.pick({
  name: true,
  email: true,
  title: true,
  phone: true,
}).extend({
  resumeFile: z.any().refine(value => value instanceof File || !value, { 
    message: "Resume file is required" 
  }).optional(),
});

type CandidateFormValues = z.infer<typeof candidateSchema>;

interface ResumeUploadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResumeUploadForm({ open, onOpenChange }: ResumeUploadFormProps) {
  const { toast } = useToast();
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isParsing, setIsParsing] = React.useState(false);

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      name: "",
      email: "",
      title: "",
      phone: "",
      resumeFile: undefined,
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        form.setValue("resumeFile", selectedFile);
        handleParseResume(selectedFile);
      }
    },
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });

  async function handleParseResume(resumeFile: File) {
    try {
      setIsParsing(true);
      const parsedData = await parseResume(resumeFile);
      
      // Auto-fill form with parsed data if fields are empty
      if (!form.getValues("name")) {
        const name = parsedData.resumeText.split('\n')[0]; // Simple approach: assume first line is name
        form.setValue("name", name);
      }
      
      // Extract email from text with regex
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
      const emailMatch = parsedData.resumeText.match(emailRegex);
      if (emailMatch && !form.getValues("email")) {
        form.setValue("email", emailMatch[0]);
      }
      
      // Extract phone from text with regex
      const phoneRegex = /\b(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/;
      const phoneMatch = parsedData.resumeText.match(phoneRegex);
      if (phoneMatch && !form.getValues("phone")) {
        form.setValue("phone", phoneMatch[0]);
      }
      
      // Extract title from experience
      if (parsedData.experience.length > 0 && !form.getValues("title")) {
        const lastExperience = parsedData.experience[0];
        // Assume first part until comma or newline might be the title
        const title = lastExperience.split(/[,\n]/)[0];
        form.setValue("title", title);
      }
      
      toast({
        title: "Resume Parsed",
        description: "We've extracted information from your resume. Please verify and complete any missing fields.",
      });
    } catch (error) {
      console.error("Error parsing resume:", error);
      toast({
        title: "Parsing Error",
        description: "We couldn't fully parse your resume. Please fill in the form manually.",
        variant: "destructive",
      });
    } finally {
      setIsParsing(false);
    }
  }

  async function onSubmit(data: CandidateFormValues) {
    if (!file) {
      toast({
        title: "Missing Resume",
        description: "Please upload a resume file.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("resume", file);
      
      // Simulate upload progress
      const uploadProgressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(uploadProgressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Parse the resume on the server
      const parseResponse = await fetch("/api/resume/parse", {
        method: "POST",
        body: formData,
      });

      if (!parseResponse.ok) {
        throw new Error("Failed to parse resume");
      }
      
      const parsedData = await parseResponse.json();
      
      // Create the candidate with all data
      const candidateData = {
        name: data.name,
        email: data.email,
        title: data.title || '',
        phone: data.phone || '',
        resumeText: parsedData.resumeText,
        skills: parsedData.skills || [],
        education: parsedData.education || [],
        experience: parsedData.experience || [],
      };
      
      const candidateResponse = await fetch("/api/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(candidateData),
      });
      
      if (!candidateResponse.ok) {
        throw new Error("Failed to create candidate");
      }
      
      // Complete progress bar
      setUploadProgress(100);
      clearInterval(uploadProgressInterval);
      
      // Update queries
      queryClient.invalidateQueries({ queryKey: ["/api/candidates"] });
      
      toast({
        title: "Resume Uploaded",
        description: "Resume has been uploaded and candidate profile created successfully.",
      });
      
      onOpenChange(false);
      form.reset();
      setFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast({
        title: "Upload Error",
        description: "There was a problem uploading your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
          <DialogDescription>
            Upload a resume to create a new candidate profile.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Resume upload dropzone */}
            <div>
              <FormLabel>Resume File</FormLabel>
              <div 
                {...getRootProps()} 
                className={`
                  mt-2 p-6 border-2 border-dashed rounded-lg cursor-pointer 
                  ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'} 
                  ${file ? 'bg-green-50 border-green-300' : ''}
                `}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="flex items-center justify-center">
                    <File className="h-8 w-8 text-green-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {isDragActive ? "Drop the file here" : "Drag and drop your resume, or click to browse"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: PDF, DOC, DOCX, TXT
                    </p>
                  </div>
                )}
              </div>
              {form.formState.errors.resumeFile && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {form.formState.errors.resumeFile.message}
                </p>
              )}
              {isParsing && (
                <div className="flex items-center mt-2 text-sm text-amber-600">
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Parsing resume...
                </div>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. (123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Uploading and processing resume...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading || isParsing}>
                {isUploading ? "Uploading..." : "Upload and Create Candidate"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}