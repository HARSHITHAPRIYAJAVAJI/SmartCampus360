import React from "react";
import Layout from "@/components/common/Layout";
import { motion } from "framer-motion";
import { GraduationCap, Clock, BookOpen, Briefcase, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Programs = () => {
    const programs = [
        {
            category: "Undergraduate",
            items: [
                { name: "B.Tech Computer Science", duration: "4 Years", seats: 120, trend: "Trending" },
                { name: "B.Tech AI & ML", duration: "4 Years", seats: 60, trend: "New" },
                { name: "B.Tech Electronics", duration: "4 Years", seats: 120, trend: "Stable" },
                { name: "B.Tech Mechanical", duration: "4 Years", seats: 60, trend: "Stable" },
            ]
        },
        {
            category: "Postgraduate",
            items: [
                { name: "M.Tech Data Science", duration: "2 Years", seats: 30, trend: "High Demand" },
                { name: "MBA Strategic Mgmt", duration: "2 Years", seats: 60, trend: "Trending" },
                { name: "M.Tech VLSI Design", duration: "2 Years", seats: 18, trend: "Research" },
            ]
        }
    ];

    return (
        <Layout>
            <section className="py-24 bg-primary/5">
                <div className="container mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">Our Academic <span className="text-primary">Programs</span></h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Excellence-driven curriculum designed to create leaders of tomorrow.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-24">
                <div className="container mx-auto px-4">
                    {programs.map((group, idx) => (
                        <div key={idx} className="mb-20 last:mb-0">
                            <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
                                <GraduationCap className="h-8 w-8 text-primary" /> {group.category} Programs
                                <div className="h-1 flex-1 bg-muted rounded-full" />
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {group.items.map((program, i) => (
                                    <Card key={i} className="group hover:shadow-2xl transition-all duration-500 border-none bg-muted/30">
                                        <CardHeader>
                                            <div className="flex justify-between items-start mb-4">
                                                <Badge variant="secondary" className="bg-primary/10 text-primary border-none">{program.trend}</Badge>
                                            </div>
                                            <CardTitle className="text-xl leading-tight">{program.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4 mr-2" /> {program.duration}
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Briefcase className="h-4 w-4 mr-2" /> {program.seats} Seats Available
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full group-hover:bg-primary">View Details</Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </Layout>
    );
};

export default Programs;
