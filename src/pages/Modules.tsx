import React from 'react';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
    Calendar, Users, FileText, ArrowRight, Sparkles, 
    ArrowLeft, Zap, Shield, LayoutGrid, Database,
    Cpu, Globe, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/common/Layout";

const modules = [
    {
        id: "timetable",
        name: "Timetable Generator",
        description: "AI-driven automated scheduling engine that eliminates conflicts and optimizes faculty workload.",
        icon: Calendar,
        color: "text-blue-500",
        bgColor: "bg-blue-50",
        url: "/features/timetable-generator",
        badge: "Most Popular",
        features: ["Auto-conflict resolution", "Workload balancing", "Room optimization"]
    },
    {
        id: "records",
        name: "Student Records",
        description: "Secure, real-time academic record management with automated grade calculation and analytics.",
        icon: FileText,
        color: "text-emerald-500",
        bgColor: "bg-emerald-50",
        url: "/features/student-records",
        badge: "Secure",
        features: ["Transcript automation", "Attendance tracking", "Performance analytics"]
    },
    {
        id: "faculty",
        name: "Faculty Management",
        description: "Comprehensive portal for faculty workload, leave management, and academic performance tracking.",
        icon: Users,
        color: "text-amber-500",
        bgColor: "bg-amber-50",
        url: "/features/faculty-management",
        badge: "Integrated",
        features: ["Leave automation", "Research tracking", "Peer evaluation"]
    },
    {
        id: "locator",
        name: "Campus Locator",
        description: "Real-time navigation system to find classrooms, faculty, and campus facilities using live timetable data.",
        icon: Globe,
        color: "text-indigo-500",
        bgColor: "bg-indigo-50",
        url: "/features/campus-locator",
        badge: "Live Data",
        features: ["Real-time tracking", "3D Mapping", "Faculty status"]
    },
    {
        id: "academics",
        name: "Academic Planning",
        description: "Strategic tool for curriculum design, department management, and course allocation.",
        icon: LayoutGrid,
        color: "text-purple-500",
        bgColor: "bg-purple-50",
        url: "/features/academic-planning",
        badge: "Strategic",
        features: ["Curriculum mapping", "Credit management", "Syllabus tracking"]
    },
    {
        id: "admin",
        name: "Admin Control Center",
        description: "Unified dashboard for system-wide settings, user roles, and institutional compliance.",
        icon: Settings,
        color: "text-slate-500",
        bgColor: "bg-slate-50",
        url: "/features/admin-control",
        badge: "Core",
        features: ["Role-based access", "System audit logs", "Compliance tracking"]
    }
];

export default function Modules() {
    return (
        <Layout>
            <div className="pt-24 pb-20 bg-background min-h-screen">
                <div className="container mx-auto px-4">
                    {/* Hero Header */}
                    <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge className="bg-primary/10 text-primary border-none px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                                Intelligent Ecosystem
                            </Badge>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-tight">
                                Core AI <span className="text-primary italic">Modules</span>
                            </h1>
                            <p className="text-xl text-slate-600 mt-6 leading-relaxed">
                                Empowering your institution with specialized AI-driven tools. Select a module to explore its features and capabilities.
                            </p>
                        </motion.div>
                    </div>

                    {/* Modules Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {modules.map((module, index) => (
                            <motion.div
                                key={module.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="group h-full border-none shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white hover:-translate-y-2">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`h-14 w-14 rounded-2xl ${module.bgColor} ${module.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                                <module.icon className="h-7 w-7" />
                                            </div>
                                            <Badge variant="outline" className="text-[10px] uppercase font-black tracking-tighter border-primary/20 text-primary">
                                                {module.badge}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                                            {module.name}
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 text-sm leading-relaxed pt-2">
                                            {module.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            {module.features.map((feature, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Zap className="h-3 w-3 text-primary" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                        <Link to={module.url}>
                                            <Button className="w-full h-12 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                                                Explore Features <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="bg-slate-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden"
                    >
                        <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-indigo-500/20 rounded-full blur-3xl" />
                        
                        <h2 className="text-3xl font-bold mb-4 relative z-10">Need a custom AI solution?</h2>
                        <p className="text-slate-400 mb-8 max-w-xl mx-auto relative z-10">
                            Our platform is extensible. We can build custom AI modules tailored to your institution's specific requirements.
                        </p>
                        <div className="flex justify-center gap-4 relative z-10">
                            <Link to="/contact">
                                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8">
                                    Contact Support
                                </Button>
                            </Link>
                            <Link to="/">
                                <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 rounded-full px-8">
                                    Back to Home
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
