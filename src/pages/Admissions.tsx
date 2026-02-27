import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Layout from '@/components/common/Layout';
import { CheckCircle, Download, Calendar, ArrowRight, BookOpen, GraduationCap } from 'lucide-react';

const Admissions = () => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("overview");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Application Submitted",
            description: "We have received your application request. Our admissions team will contact you shortly.",
        });
    };

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative py-20 bg-primary overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="container mx-auto px-4 relative z-10 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading">Admissions 2025-26</h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8">
                        Take the first step towards a bright future. Join our community of innovators and leaders.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" variant="secondary" onClick={() => setActiveTab("apply")}>
                            Apply Online
                        </Button>
                        <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                            Download Brochure
                        </Button>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 bg-gray-50/50">
                <div className="container mx-auto px-4">
                    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                        <div className="flex justify-center overflow-x-auto pb-2">
                            <TabsList className="grid w-full max-w-3xl grid-cols-4 h-auto p-1 bg-white shadow-sm rounded-full">
                                <TabsTrigger value="overview" className="rounded-full py-2.5">Overview</TabsTrigger>
                                <TabsTrigger value="programs" className="rounded-full py-2.5">Programs</TabsTrigger>
                                <TabsTrigger value="fees" className="rounded-full py-2.5">Fee Structure</TabsTrigger>
                                <TabsTrigger value="apply" className="rounded-full py-2.5">Apply Now</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="overview" className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Why Choose Smart Campus?</CardTitle>
                                    <CardDescription>Experience world-class education with cutting-edge facilities</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="flex gap-4">
                                            <div className="h-10 w-10 text-primary bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                                <CheckCircle className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Expert Faculty</h3>
                                                <p className="text-muted-foreground text-sm">Learn from industry veterans and PhD holders from top universities.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="h-10 w-10 text-primary bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                                <CheckCircle className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">State-of-the-art Labs</h3>
                                                <p className="text-muted-foreground text-sm">Access to modern laboratories for practical hands-on learning.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="h-10 w-10 text-primary bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                                <CheckCircle className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Global Exposure</h3>
                                                <p className="text-muted-foreground text-sm">International exchange programs and global internships.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="h-10 w-10 text-primary bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                                <CheckCircle className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">100% Placement Support</h3>
                                                <p className="text-muted-foreground text-sm">Dedicated placement cell to ensure career success.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-muted/50 p-6 rounded-xl border border-border/50">
                                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-primary" /> Important Dates
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center border-b pb-2">
                                                <span className="text-sm">Application Start Date</span>
                                                <span className="font-medium">Jan 15, 2025</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b pb-2">
                                                <span className="text-sm">Last Date to Apply</span>
                                                <span className="font-medium">Apr 30, 2025</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b pb-2">
                                                <span className="text-sm">Entrance Exam</span>
                                                <span className="font-medium">May 15, 2025</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">Classes Commence</span>
                                                <span className="font-medium">Aug 01, 2025</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="programs" className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { name: "Computer Science", degree: "B.Tech", duration: "4 Years", seats: 120 },
                                    { name: "Artificial Intelligence", degree: "B.Tech", duration: "4 Years", seats: 60 },
                                    { name: "Electronics & Comm", degree: "B.Tech", duration: "4 Years", seats: 120 },
                                    { name: "Data Science", degree: "M.Tech", duration: "2 Years", seats: 30 },
                                    { name: "Business Administration", degree: "MBA", duration: "2 Years", seats: 60 },
                                    { name: "Civil Engineering", degree: "B.Tech", duration: "4 Years", seats: 60 },
                                ].map((program, i) => (
                                    <Card key={i} className="hover:border-primary transition-colors cursor-pointer group">
                                        <CardHeader>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="p-2 bg-secondary rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <GraduationCap className="h-6 w-6" />
                                                </div>
                                                <span className="text-xs font-bold px-2 py-1 bg-muted rounded">{program.degree}</span>
                                            </div>
                                            <CardTitle className="text-lg">{program.name}</CardTitle>
                                            <CardDescription>{program.duration}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <BookOpen className="h-4 w-4" />
                                                <span>{program.seats} Seats Available</span>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="pt-0">
                                            <Button variant="ghost" className="w-full justify-between hover:text-primary p-0">
                                                View Details <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="fees" className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Fee Structure (2025-26)</CardTitle>
                                    <CardDescription>Transparent fee structure for all our programs</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                                <tr>
                                                    <th className="px-6 py-3">Program</th>
                                                    <th className="px-6 py-3">Tuition Fee (Per Year)</th>
                                                    <th className="px-6 py-3">Other Fees</th>
                                                    <th className="px-6 py-3">Total (Per Year)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b">
                                                    <td className="px-6 py-4 font-medium">B.Tech (CSE/AI/ECE)</td>
                                                    <td className="px-6 py-4">₹1,20,000</td>
                                                    <td className="px-6 py-4">₹25,000</td>
                                                    <td className="px-6 py-4 font-bold text-primary">₹1,45,000</td>
                                                </tr>
                                                <tr className="border-b">
                                                    <td className="px-6 py-4 font-medium">B.Tech (Civil/Mech)</td>
                                                    <td className="px-6 py-4">₹1,00,000</td>
                                                    <td className="px-6 py-4">₹25,000</td>
                                                    <td className="px-6 py-4 font-bold text-primary">₹1,25,000</td>
                                                </tr>
                                                <tr className="border-b">
                                                    <td className="px-6 py-4 font-medium">M.Tech</td>
                                                    <td className="px-6 py-4">₹80,000</td>
                                                    <td className="px-6 py-4">₹20,000</td>
                                                    <td className="px-6 py-4 font-bold text-primary">₹1,00,000</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 font-medium">MBA</td>
                                                    <td className="px-6 py-4">₹1,50,000</td>
                                                    <td className="px-6 py-4">₹30,000</td>
                                                    <td className="px-6 py-4 font-bold text-primary">₹1,80,000</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                        <p className="text-yellow-800 text-sm">
                                            * Merit scholarships available for students with &gt;90% in qualifying exams.
                                        </p>
                                        <Button variant="outline" size="sm" className="bg-white">
                                            <Download className="mr-2 h-4 w-4" /> Download Full Fee Chart
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="apply" className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Application Form</CardTitle>
                                    <CardDescription>Fill out the details below to start your application process</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input id="firstName" placeholder="John" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input id="lastName" placeholder="Doe" required />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" type="email" placeholder="john.doe@example.com" required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input id="phone" type="tel" placeholder="+91 98765 43210" required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="program">Program Interested In</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a program" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="btech-cse">B.Tech Computer Science</SelectItem>
                                                    <SelectItem value="btech-ai">B.Tech AI & ML</SelectItem>
                                                    <SelectItem value="btech-ece">B.Tech ECE</SelectItem>
                                                    <SelectItem value="mba">MBA</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="prev-score">Previous Qualification Score (%)</Label>
                                            <Input id="prev-score" type="number" placeholder="e.g. 85" required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Additional Message (Optional)</Label>
                                            <Textarea id="message" placeholder="Tell us why you want to join..." />
                                        </div>

                                        <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">Submit Application</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        </Layout>
    );
};

export default Admissions;
