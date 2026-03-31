import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Bell, Shield, Moon, Globe, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useOutletContext } from "react-router-dom";

const Settings = () => {
    const { toast } = useToast();
    const { user } = useOutletContext<{ user: { name: string, id: string, role: string } }>();

    const getRoleLabel = () => {
        switch(user?.role) {
            case 'admin': return "System Administrator";
            case 'faculty': return "Faculty Member";
            case 'student': return "Student";
            default: return "User";
        }
    };

    const handleSave = () => {
        toast({ title: "Settings Saved", description: "Your preferences have been updated." });
    };

    return (
        <div className="space-y-6 animate-in fade-in-50 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal details and public profile.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <Avatar className="h-24 w-24 border-2 border-primary/20">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
                                    <AvatarFallback className="text-2xl">{user?.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-lg">{user?.name}</h4>
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{getRoleLabel()}</p>
                                    <Button variant="outline" size="sm" className="mt-2">Change Avatar</Button>
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 pt-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input defaultValue={user?.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label>User ID / Roll Number</Label>
                                    <Input defaultValue={user?.id} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label>College Email</Label>
                                    <Input defaultValue={`${user?.id}@smartcampus.edu`} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label>Designated Role</Label>
                                    <Input defaultValue={getRoleLabel()} disabled />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSave}>Save Changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Choose what you want to be notified about.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between space-x-2 border-b pb-4">
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-base">Email Notifications</Label>
                                    <span className="text-sm text-muted-foreground">Receive daily summaries via email.</span>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between space-x-2 border-b pb-4">
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-base">Push Notifications</Label>
                                    <span className="text-sm text-muted-foreground">Receive real-time alerts on your device.</span>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-base">Event Reminders</Label>
                                    <span className="text-sm text-muted-foreground">Get notified 1 hour before scheduled events.</span>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSave}>Save Preferences</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>Manage your password and account security.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Current Password</Label>
                                <Input type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label>New Password</Label>
                                <Input type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label>Confirm New Password</Label>
                                <Input type="password" />
                            </div>
                            <div className="pt-4">
                                <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg bg-muted/40">
                                    <div className="flex flex-col space-y-1">
                                        <Label className="text-base font-medium">Two-Factor Authentication</Label>
                                        <span className="text-sm text-muted-foreground">Add an extra layer of security to your account.</span>
                                    </div>
                                    <Button variant="outline" size="sm">Enable</Button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSave}>Update Password</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Settings;
