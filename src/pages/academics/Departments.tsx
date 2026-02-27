import React from "react";
import Layout from "@/components/common/Layout";
import { motion } from "framer-motion";
import { Cpu, Database, Binary, Globe, Landmark, Beaker, Lightbulb, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Departments = () => {
    const departments = [
        {
            id: "cse",
            name: "Computer Science & Engineering",
            icon: Cpu,
            description: "Pioneering the future through innovation in software, AI, and systems engineering.",
            stats: { faculty: "45+", students: "1200+", labs: "12" },
            specializations: ["Artificial Intelligence", "Cybersecurity", "Cloud Computing"]
        },
        {
            id: "aiml",
            name: "AI & Machine Learning",
            icon: Binary,
            description: "Dedicated to the study of intelligent systems and data-driven decision making.",
            stats: { faculty: "30+", students: "800+", labs: "8" },
            specializations: ["Deep Learning", "Computer Vision", "NLP"]
        },
        {
            id: "ece",
            name: "Electronics & Comm. Engineering",
            icon: Database,
            description: "Connecting the world through advanced silicon design and telecommunication systems.",
            stats: { faculty: "38+", students: "950+", labs: "15" },
            specializations: ["VLSI Design", "Embedded Systems", "5G Networks"]
        },
        {
            id: "me",
            name: "Mechanical Engineering",
            icon: Landmark,
            description: "The core of robotics, thermodynamics, and high-performance manufacturing.",
            stats: { faculty: "35+", students: "900+", labs: "20" },
            specializations: ["Robotics", "Aerospace", "Automotive Design"]
        },
        {
            id: "ee",
            name: "Electrical Engineering",
            icon: Lightbulb,
            description: "Powering the future with renewable energy systems and smart grid technologies.",
            stats: { faculty: "32+", students: "750+", labs: "10" },
            specializations: ["Renewable Energy", "Smart Grids", "Power Systems"]
        },
        {
            id: "bs",
            name: "Business & Management",
            icon: Globe,
            description: "Developing world leaders through strategic thinking and entrepreneurial mindset.",
            stats: { faculty: "25+", students: "600+", labs: "4" },
            specializations: ["Finance", "Data Analytics", "HR Management"]
        }
    ];

    return (
        <Layout>
            {/* Hero Section */}
            <section className="py-24 bg-gradient-to-b from-primary/5 to-transparent">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Academic <span className="text-primary">Departments</span></h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
                            Explore our world-class departments, each a center of excellence in research and education.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Departments Grid */}
            <section className="py-12 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {departments.map((dept, i) => (
                            <motion.div
                                key={dept.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 text-primary/5 group-hover:text-primary/10 transition-colors">
                                        <dept.icon className="h-24 w-24" />
                                    </div>
                                    <CardHeader className="relative z-10">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                            <dept.icon className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-2xl font-bold">{dept.name}</CardTitle>
                                        <CardDescription className="text-base line-clamp-2 mt-2">{dept.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {dept.specializations.map((spec) => (
                                                <Badge key={spec} variant="secondary" className="bg-primary/5 text-primary border-none">{spec}</Badge>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 border-t pt-6 mb-6">
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-primary">{dept.stats.faculty}</div>
                                                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Faculty</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-primary">{dept.stats.students}</div>
                                                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Students</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-primary">{dept.stats.labs}</div>
                                                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Labs</div>
                                            </div>
                                        </div>
                                        <Button className="w-full group-hover:bg-primary transition-colors">View Details</Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interdisciplinary Research */}
            <section className="py-24 bg-secondary/30">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl font-bold mb-6">Interdisciplinary <span className="text-primary">Collaboration</span></h2>
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                Innovation happens at the intersection of disciplines. Our departments collaborate on breakthrough research in sustainable energy, medical technology, and smart infrastructure.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { icon: Beaker, title: "Advanced Research Centers", desc: "6 Multi-departmental research centers for complex problem solving." },
                                    { icon: Users, title: "Cross-Departmental Faculty", desc: "Expert faculty members collaborating across departments." },
                                    { icon: BookOpen, title: "Dual Degrees", desc: "Opportunities for students to pursue degrees across multiple departments." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-background shadow-sm border border-border/50">
                                        <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">{item.title}</h4>
                                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80" alt="Lab Research" className="rounded-2xl shadow-xl w-full h-full object-cover" />
                            <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80" alt="Coding" className="rounded-2xl shadow-xl w-full h-full object-cover mt-8" />
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Departments;
