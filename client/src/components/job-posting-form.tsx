import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertJobPostingSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { X } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const jobPostingSchema = insertJobPostingSchema.extend({
  // Accept array of strings for requirements
  requirements: z.array(z.string())
});

type JobPostingFormValues = z.infer<typeof jobPostingSchema>;

interface JobPostingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobPostingForm({ open, onOpenChange }: JobPostingFormProps) {
  const { toast } = useToast();
  const [requirements, setRequirements] = React.useState<string[]>([]);
  const [requirement, setRequirement] = React.useState("");

  const form = useForm<JobPostingFormValues>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      title: "",
      department: "",
      description: "",
      requirements: [],
      status: "active",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  // Initialize requirements from form when dialog opens
  React.useEffect(() => {
    if (open) {
      const currentRequirements = form.getValues("requirements");
      if (Array.isArray(currentRequirements)) {
        setRequirements(currentRequirements);
      }
    }
  }, [open, form]);

  // Handle dialog close
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      form.reset();
      setRequirements([]);
      setRequirement("");
    }
    onOpenChange(open);
  };

  async function onSubmit(data: JobPostingFormValues) {
    try {
      await apiRequest("POST", "/api/jobs", data);

      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      
      toast({
        title: "Job posting created",
        description: "The job posting has been created successfully.",
      });
      
      handleDialogClose(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while creating the job posting.",
        variant: "destructive",
      });
    }
  }

  const handleAddRequirement = () => {
    if (requirement.trim() && !requirements.includes(requirement.trim())) {
      const newRequirements = [...requirements, requirement.trim()];
      setRequirements(newRequirements);
      form.setValue("requirements", newRequirements);
      setRequirement("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    const newRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(newRequirements);
    form.setValue("requirements", newRequirements);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddRequirement();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job Posting</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new job posting.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Senior Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Engineering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Job description..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="requirements"
              render={() => (
                <FormItem>
                  <FormLabel>Requirements</FormLabel>
                  <div className="flex mt-2">
                    <Input
                      placeholder="Add a requirement and press Enter"
                      value={requirement}
                      onChange={(e) => setRequirement(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={handleAddRequirement}
                      className="ml-2"
                    >
                      Add
                    </Button>
                  </div>
                  
                  {requirements.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {requirements.map((req, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {req}
                          <button
                            type="button"
                            onClick={() => handleRemoveRequirement(index)}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. active" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => handleDialogClose(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Job Posting"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}