import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, TrendingUp, Users, Building, Award, Briefcase, Star, Search } from 'lucide-react';
import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/button';

const Placements = () => {
    const placementStats = [
        {
            icon: TrendingUp,
            title: "Placement Rate",
            value: "95%",
            description: "Students placed in top companies",
            className: "text-emerald-500"
        },
        {
            icon: Users,
            title: "Total Placements",
            value: "1,250+",
            description: "Students placed this year",
            className: "text-blue-500"
        },
        {
            icon: Building,
            title: "Companies Visited",
            value: "200+",
            description: "Recruiters this season",
            className: "text-purple-500"
        },
        {
            icon: Award,
            title: "Highest Package",
            value: "₹45 LPA",
            description: "Top salary package offered",
            className: "text-orange-500"
        }
    ];

    const topRecruiters = [
        { name: "Google", logo: "/images/google.png", placements: 45 },
        { name: "Microsoft", logo: "/images/microsoft.png", placements: 38 },
        { name: "Amazon", logo: "/images/amazon.png", placements: 32 },
        { name: "Infosys", logo: "/images/infosys.png", placements: 28 },
        { name: "TCS", logo: "/images/tcs.png", placements: 25 },
        { name: "Wipro", logo: "/images/wipro.png", placements: 22 },
        { name: "Deloitte", logo: "/images/deloitte.png", placements: 18 },
        { name: "Accenture", logo: "/images/accenture.png", placements: 15 }
    ];

    const successStories = [
        {
            name: "Priya Sharma",
            role: "Software Engineer",
            company: "Google",
            package: "₹42 LPA",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60"
        },
        {
            name: "Rahul Kumar",
            role: "Data Scientist",
            company: "Microsoft",
            package: "₹38 LPA",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60"
        },
        {
            name: "Anjali Reddy",
            role: "Product Manager",
            company: "Amazon",
            package: "₹35 LPA",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=60"
        }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="relative py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left scale-110" />
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 hover:rotate-6 transition-transform">
                            <Briefcase className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 font-heading">
                            Placements & Careers
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Your gateway to world-class career opportunities. success starts here.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20">View Opportunities</Button>
                            <Button size="lg" variant="outline" className="rounded-full px-8">Download Brochure</Button>
                        </div>
                    </div>
                </section>

                {/* Statistics Section */}
                <section className="py-16 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {placementStats.map((stat, index) => (
                                <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                                    <CardHeader>
                                        <div className={`mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4 ${stat.className}`}>
                                            <stat.icon className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-3xl font-bold text-center">{stat.value}</CardTitle>
                                        <CardDescription className="text-center">{stat.title}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-center text-muted-foreground">{stat.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Top Recruiters Section */}
                <section className="py-20 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4 font-heading">Our Recruiting Partners</h2>
                            <p className="text-muted-foreground">Trusted by global industry leaders</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {topRecruiters.map((recruiter, index) => (
                                <div key={index} className="glass p-6 rounded-xl flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 group cursor-pointer bg-white/50 hover:bg-white/80">
                                    <div className="h-16 w-32 flex items-center justify-center mb-4 grayscale group-hover:grayscale-0 transition-all duration-300">
                                        <img src={recruiter.logo} alt={recruiter.name} className="max-h-full max-w-full object-contain" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">{recruiter.name}</h3>
                                    <span className="text-xs text-muted-foreground font-medium bg-secondary px-2 py-1 rounded-full">{recruiter.placements} Offers</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Success Stories Section */}
                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                            <div>
                                <h2 className="text-3xl font-bold mb-2 font-heading">Success Stories</h2>
                                <p className="text-muted-foreground">Hear from our placed students</p>
                            </div>
                            <Button variant="ghost">View All Stories</Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {successStories.map((story, index) => (
                                <Card key={index} className="overflow-hidden group hover:shadow-lg transition-shadow">
                                    <div className="h-48 overflow-hidden">
                                        <img src={story.image} alt={story.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <CardContent className="pt-6 relative">
                                        <div className="absolute -top-10 right-6 h-14 w-14 bg-background rounded-full p-1 flex items-center justify-center shadow-lg">
                                            <div className="h-full w-full bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                                <Star className="h-6 w-6 fill-current" />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold">{story.name}</h3>
                                            <p className="text-primary font-medium">{story.role} @ {story.company}</p>
                                        </div>
                                        <div className="p-3 bg-muted rounded-lg border border-border/50">
                                            <p className="text-sm text-center font-semibold">Package: {story.package}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 relative overflow-hidden bg-primary text-primary-foreground">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 font-heading">Ready for Your Dream Career?</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                            Join our comprehensive placement training program starting next semester.
                        </p>
                        <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full shadow-lg">
                            Register Now
                        </Button>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Placements;
