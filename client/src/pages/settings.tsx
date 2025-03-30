import React from "react";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
});

const notificationFormSchema = z.object({
  emailNotifications: z.boolean(),
  resumeAlerts: z.boolean(),
  matchAlerts: z.boolean(),
  weeklyReport: z.boolean(),
});

const matchingSettingsSchema = z.object({
  matchThreshold: z.string(),
  prioritizeSkills: z.boolean(),
  prioritizeExperience: z.boolean(),
  strictMatch: z.boolean(),
  includeEducation: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type NotificationFormValues = z.infer<typeof notificationFormSchema>;
type MatchingSettingsValues = z.infer<typeof matchingSettingsSchema>;

export default function Settings() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { toast } = useToast();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "John Doe",
      email: "john.doe@example.com",
      company: "Acme Inc.",
      jobTitle: "HR Manager",
    },
  });

  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      resumeAlerts: true,
      matchAlerts: true,
      weeklyReport: false,
    },
  });

  const matchingSettingsForm = useForm<MatchingSettingsValues>({
    resolver: zodResolver(matchingSettingsSchema),
    defaultValues: {
      matchThreshold: "75",
      prioritizeSkills: true,
      prioritizeExperience: false,
      strictMatch: false,
      includeEducation: true,
    },
  });

  function onProfileSubmit(data: ProfileFormValues) {
    toast({
      title: "Profile settings saved",
      description: "Your profile settings have been updated.",
    });
  }

  function onNotificationSubmit(data: NotificationFormValues) {
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated.",
    });
  }

  function onMatchingSettingsSubmit(data: MatchingSettingsValues) {
    toast({
      title: "Matching settings saved",
      description: "Your matching algorithm preferences have been updated.",
    });
  }

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
          <h1 className="text-lg font-semibold">Settings</h1>
          <div className="w-6"></div> {/* Empty div for balance */}
        </div>
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex-1 min-w-0 mb-6">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Settings
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account settings and preferences
              </p>
            </div>
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="matching">Matching Algorithm</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                      Update your personal information and preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="jobTitle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button type="submit">Save Changes</Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Configure how and when you receive notifications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...notificationForm}>
                      <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                        <FormField
                          control={notificationForm.control}
                          name="emailNotifications"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Email Notifications</FormLabel>
                                <FormDescription className="text-sm text-muted-foreground">
                                  Receive notifications via email
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Notification Types</h3>
                          
                          <FormField
                            control={notificationForm.control}
                            name="resumeAlerts"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <FormLabel>New Resume Alerts</FormLabel>
                                  <FormDescription className="text-xs text-muted-foreground">
                                    Get notified when new resumes are uploaded
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={notificationForm.control}
                            name="matchAlerts"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <FormLabel>Match Alerts</FormLabel>
                                  <FormDescription className="text-xs text-muted-foreground">
                                    Get notified when new strong matches are found
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={notificationForm.control}
                            name="weeklyReport"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <FormLabel>Weekly Reports</FormLabel>
                                  <FormDescription className="text-xs text-muted-foreground">
                                    Receive weekly summary reports
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button type="submit">Save Preferences</Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="matching">
                <Card>
                  <CardHeader>
                    <CardTitle>Matching Algorithm Settings</CardTitle>
                    <CardDescription>
                      Customize how candidates are matched to job requirements.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...matchingSettingsForm}>
                      <form onSubmit={matchingSettingsForm.handleSubmit(onMatchingSettingsSubmit)} className="space-y-6">
                        <FormField
                          control={matchingSettingsForm.control}
                          name="matchThreshold"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Match Threshold (%)</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a match threshold" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="50">50% (More candidates, lower quality)</SelectItem>
                                  <SelectItem value="75">75% (Balanced)</SelectItem>
                                  <SelectItem value="90">90% (Fewer candidates, higher quality)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                The minimum match percentage to consider a candidate relevant
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Match Priorities</h3>
                          
                          <FormField
                            control={matchingSettingsForm.control}
                            name="prioritizeSkills"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <FormLabel>Prioritize Skills</FormLabel>
                                  <FormDescription className="text-xs text-muted-foreground">
                                    Give more weight to skill matches
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={matchingSettingsForm.control}
                            name="prioritizeExperience"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <FormLabel>Prioritize Experience</FormLabel>
                                  <FormDescription className="text-xs text-muted-foreground">
                                    Give more weight to years of experience
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <Separator />
                          
                          <FormField
                            control={matchingSettingsForm.control}
                            name="strictMatch"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <FormLabel>Strict Matching</FormLabel>
                                  <FormDescription className="text-xs text-muted-foreground">
                                    Only exact skill matches count (no synonyms)
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={matchingSettingsForm.control}
                            name="includeEducation"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <FormLabel>Include Education</FormLabel>
                                  <FormDescription className="text-xs text-muted-foreground">
                                    Consider education when matching candidates
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button type="submit">Save Algorithm Settings</Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security options.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </div>
                      <Button className="mt-4" onClick={() => toast({ title: "Password Updated", description: "Your password has been changed successfully." })}>Update Password</Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </p>
                      <Button variant="outline" onClick={() => toast({ title: "2FA", description: "Two-factor authentication will be implemented in a future version." })}>
                        Enable Two-Factor Authentication
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-destructive">Danger Zone</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <Button variant="destructive" onClick={() => toast({ title: "Account Deletion", description: "Account deletion functionality will be implemented in future versions." })}>
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}