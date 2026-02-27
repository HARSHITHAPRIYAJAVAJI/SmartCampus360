import React from "react";
import Layout from "@/components/common/Layout";
import { motion } from "framer-motion";
import {
    Cpu,
    Database,
    Binary,
    Globe,
    Landmark,
    Beaker,
    Lightbulb,
    Users,
    BookOpen,
    ArrowRight,
    ShieldCheck,
    Microscope,
    Atom
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Departments = () => {
    const departments = [
        {
            id: "cse",
            name: "Computer Science & Engineering",
            icon: Cpu,
            description: "Pioneering the future through innovation in software, AI, and systems engineering.",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
            stats: { faculty: "45+", students: "1200+", labs: "12" },
            specializations: ["Artificial Intelligence", "Cybersecurity", "Cloud Computing"]
        },
        {
            id: "aiml",
            name: "AI & Machine Learning",
            icon: Binary,
            description: "Dedicated to the study of intelligent systems and data-driven decision making.",
            image: "https://images.unsplash.com/photo-1555255707-c07966485bc4?w=800&q=80",
            stats: { faculty: "30+", students: "800+", labs: "8" },
            specializations: ["Deep Learning", "Computer Vision", "NLP"]
        },
        {
            id: "ece",
            name: "Electronics & Comm. Engineering",
            icon: Database,
            description: "Connecting the world through advanced silicon design and telecommunication systems.",
            image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&q=80",
            stats: { faculty: "38+", students: "950+", labs: "15" },
            specializations: ["VLSI Design", "Embedded Systems", "5G Networks"]
        },
        {
            id: "me",
            name: "Mechanical Engineering",
            icon: Landmark,
            description: "The core of robotics, thermodynamics, and high-performance manufacturing.",
            image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=800&q=80",
            stats: { faculty: "35+", students: "900+", labs: "20" },
            specializations: ["Robotics", "Aerospace", "Automotive Design"]
        },
        {
            id: "ee",
            name: "Electrical Engineering",
            icon: Lightbulb,
            description: "Powering the future with renewable energy systems and smart grid technologies.",
            image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
            stats: { faculty: "32+", students: "750+", labs: "10" },
            specializations: ["Renewable Energy", "Smart Grids", "Power Systems"]
        },
        {
            id: "bs",
            name: "Business & Management",
            icon: Globe,
            description: "Developing world leaders through strategic thinking and entrepreneurial mindset.",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
            stats: { faculty: "25+", students: "600+", labs: "4" },
            specializations: ["Finance", "Data Analytics", "HR Management"]
        }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-slate-50">
                {/* Hero Section */}
                <section className="relative py-32 bg-slate-900 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086')] bg-cover bg-center opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-950 to-slate-950" />

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Badge className="mb-6 bg-primary/20 text-primary-light border-primary/30 px-6 py-2 backdrop-blur-md text-sm font-bold tracking-[0.2em] uppercase">
                                Schools of Excellence
                            </Badge>
                            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]">
                                Academic <br />
                                <span className="text-primary italic">Departments.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
                                Our diverse departments represent the pillars of innovation,
                                each dedicated to pushing the boundaries of what's possible in their respective fields.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Main Departments Content */}
                <section className="py-24 bg-slate-950">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {departments.map((dept, i) => (
                                <motion.div
                                    key={dept.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group"
                                >
                                    <div className="relative h-full rounded-[3rem] bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
                                        <div className="h-48 overflow-hidden relative">
                                            <img src={dept.image} alt={dept.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                                            <div className="absolute top-6 left-6 h-14 w-14 rounded-2xl bg-primary/20 backdrop-blur-md flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                <dept.icon className="h-8 w-8" />
                                            </div>
                                        </div>

                                        <div className="p-8 space-y-6">
                                            <div className="space-y-4">
                                                <h3 className="text-2xl font-black text-white leading-tight">{dept.name}</h3>
                                                <p className="text-slate-400 font-medium line-clamp-3 italic">"{dept.description}"</p>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {dept.specializations.map((spec) => (
                                                    <span key={spec} className="text-[10px] font-black uppercase tracking-[0.1em] text-primary-light bg-primary/10 px-3 py-1.5 rounded-full">
                                                        {spec}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
                                                <div className="text-center">
                                                    <div className="text-2xl font-black text-white">{dept.stats.faculty}</div>
                                                    <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Experts</div>
                                                </div>
                                                <div className="text-center border-x border-white/5">
                                                    <div className="text-2xl font-black text-white">{dept.stats.students}</div>
                                                    <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Scholars</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-black text-white">{dept.stats.labs}</div>
                                                    <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Labs</div>
                                                </div>
                                            </div>

                                            <Button className="w-full h-14 rounded-2xl bg-white/5 group-hover:bg-primary text-white font-bold transition-all border border-white/10 group-hover:border-transparent">
                                                Detailed Curriculum
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Research Focus Section */}
                <section className="py-32 bg-white relative overflow-hidden">
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[15vw] font-black text-slate-50 pointer-events-none select-none -z-0 leading-none opacity-50 uppercase">
                        Lab Focus
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div className="space-y-12">
                                <div className="space-y-4">
                                    <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5">Future Ready</Badge>
                                    <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tight leading-[0.9]">
                                        Interdisciplinary <br />
                                        <span className="text-primary italic">Paradigm Shift.</span>
                                    </h2>
                                    <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                                        We break silos. Our researchers collaborate across domains to solve complex global challenges in sustainable energy, AI ethics, and urban design.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { icon: Microscope, title: "Advanced Research Clusters", desc: "Specialized units merging CS, Electronics, and Bio-Science." },
                                        { icon: Atom, title: "Nano-Tech Integration", desc: "Exploring the atomic scale for revolutionary material sciences." },
                                        { icon: ShieldCheck, title: "Ethical Systems Lab", desc: "Ensuring human-centric development in all applied technologies." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
                                            <div className="h-14 w-14 shrink-0 rounded-2xl bg-white shadow-md flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <item.icon className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h4>
                                                <p className="text-slate-500 font-medium">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="grid grid-cols-2 gap-6 relative z-10">
                                    <motion.div initial={{ y: 50 }} whileInView={{ y: 0 }} transition={{ duration: 1 }} className="space-y-6 pt-20">
                                        <img src="https://images.unsplash.com/photo-1579315044485-a11f2690ce1a?w=400&q=80" alt="Research" className="rounded-[3rem] shadow-2xl h-80 w-full object-cover" />
                                        <div className="h-64 rounded-[3rem] bg-primary p-8 text-white flex flex-col justify-end">
                                            <div className="text-5xl font-black mb-2">250+</div>
                                            <div className="text-sm font-bold uppercase tracking-widest opacity-80">Research Papers Yearly</div>
                                        </div>
                                    </motion.div>
                                    <motion.div initial={{ y: -50 }} whileInView={{ y: 0 }} transition={{ duration: 1 }} className="space-y-6">
                                        <div className="h-48 rounded-[3rem] bg-slate-900 p-8 text-white flex flex-col justify-center">
                                            <Atom className="h-10 w-10 text-primary mb-4" />
                                            <div className="text-xl font-black">Innovation Hub</div>
                                        </div>
                                        <img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80" alt="Futuristic Tech" className="rounded-[3rem] shadow-2xl h-[400px] w-full object-cover" />
                                    </motion.div>
                                </div>

                                {/* Orbit Decoration */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-slate-100 rounded-full -z-0 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Departments;
