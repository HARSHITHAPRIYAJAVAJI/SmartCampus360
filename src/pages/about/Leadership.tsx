import React from "react";
import Layout from "@/components/common/Layout";
import { motion } from "framer-motion";
import { Linkedin, Mail, Twitter, Award, ExternalLink, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Leadership = () => {
    const leaders = [
        {
            name: "Dr. Sarah Mitchell",
            role: "Vice Chancellor",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
            bio: "With over 25 years in academic administration, Dr. Mitchell has pioneered several international collaborations and transformed the university's research output.",
            credentials: "Ph.D. Oxford, M.Admin Harvard",
            stats: { publications: "120+", tenure: "8 Years" }
        },
        {
            name: "Prof. David Chen",
            role: "Dean of Academics",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop",
            bio: "A renowned researcher in AI and Neural Networks, Prof. Chen oversees the design and implementation of our global-standard digital curriculum.",
            credentials: "Ph.D. MIT, Fellow of IEEE",
            stats: { patents: "14", courses: "50+" }
        },
        {
            name: "Dr. Elena Rodriguez",
            role: "Director of Research",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop",
            bio: "Dr. Rodriguez leads our interdisciplinary research centers and state-of-the-art laboratory initiatives, securing over $50M in research grants.",
            credentials: "Ph.D. Stanford, MS Materials Science",
            stats: { grants: "$50M+", centers: "6" }
        }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-slate-50">
                {/* Executive Hero */}
                <section className="relative py-32 bg-slate-900 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069')] bg-cover bg-center opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Badge className="mb-6 bg-primary/20 text-primary-light border-primary/30 px-6 py-2 backdrop-blur-md text-sm font-black tracking-[0.2em] uppercase">
                                The Architects of Vision
                            </Badge>
                            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]">
                                LEADERSHIP & <br /> <span className="text-primary italic">GOVERNANCE.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
                                Our board comprise pioneers in technology, science, and education—individuals
                                united by a single goal: redefining the academic landscape of the 21st century.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Leadership Profile Cards */}
                <section className="py-24 relative z-10 -mt-16">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {leaders.map((leader, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    className="group"
                                >
                                    <div className="relative rounded-[3rem] bg-white shadow-2xl shadow-slate-200/50 overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-slate-100 h-full flex flex-col">
                                        {/* Image Section */}
                                        <div className="relative aspect-[4/5] overflow-hidden">
                                            <img src={leader.image} alt={leader.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter group-hover:contrast-125" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                                            {/* Credentials Badge */}
                                            <div className="absolute top-6 left-6">
                                                <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 px-4 py-2 text-[10px] font-bold tracking-widest uppercase">
                                                    {leader.credentials}
                                                </Badge>
                                            </div>

                                            {/* Content Overlayed on Image Bottom */}
                                            <div className="absolute bottom-10 left-10 right-10 text-white space-y-2">
                                                <h3 className="text-4xl font-black tracking-tight leading-none uppercase">{leader.name.split(' ')[0]} <br /> <span className="text-primary italic">{leader.name.split(' ').slice(1).join(' ')}</span></h3>
                                                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">{leader.role}</p>
                                            </div>
                                        </div>

                                        {/* Bio Section */}
                                        <div className="p-10 space-y-8 flex-grow flex flex-col justify-between">
                                            <div className="relative">
                                                <Quote className="absolute -top-4 -left-4 h-12 w-12 text-slate-50 -z-0" />
                                                <p className="text-slate-500 font-medium leading-relaxed italic relative z-10 italic">
                                                    "{leader.bio}"
                                                </p>
                                            </div>

                                            {/* Stats/Achievements */}
                                            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-8">
                                                {Object.entries(leader.stats).map(([label, val], idx) => (
                                                    <div key={idx} className="text-center">
                                                        <div className="text-2xl font-black text-slate-900 leading-none">{val}</div>
                                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Social Links */}
                                            <div className="flex gap-4 pt-6">
                                                <Button size="icon" variant="outline" className="rounded-2xl h-12 w-12 border-slate-200 hover:bg-primary hover:text-white hover:border-transparent transition-all"><Linkedin className="h-5 w-5" /></Button>
                                                <Button size="icon" variant="outline" className="rounded-2xl h-12 w-12 border-slate-200 hover:bg-primary hover:text-white hover:border-transparent transition-all"><Twitter className="h-5 w-5" /></Button>
                                                <Button size="icon" variant="outline" className="rounded-2xl h-12 w-12 border-slate-200 hover:bg-primary hover:text-white hover:border-transparent transition-all"><Mail className="h-5 w-5" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Legacy & Governance Statement */}
                <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[15vw] font-black text-primary/5 pointer-events-none select-none -z-0 leading-none uppercase">
                        Council
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <Badge className="bg-primary/20 text-primary-light border-primary/30 px-4 py-1.5">Governance Standards</Badge>
                                    <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none uppercase">
                                        Principles of <br /> <span className="text-primary italic">Excellence.</span>
                                    </h2>
                                    <p className="text-xl text-slate-400 font-medium leading-relaxed">
                                        Our governance model is built on transparency, global accreditation,
                                        and a relentless pursuit of academic rigor overseen by international observers.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Award className="h-8 w-8 text-primary" />
                                        <h4 className="text-xl font-bold">Global Board</h4>
                                        <p className="text-slate-500 text-sm font-medium">Monthly reviews by an advisory council of Nobel laureates and industry CEOs.</p>
                                    </div>
                                    <div className="space-y-3">
                                        <ExternalLink className="h-8 w-8 text-primary" />
                                        <h4 className="text-xl font-bold">Open Policy</h4>
                                        <p className="text-slate-500 text-sm font-medium">All administrative decisions are data-driven and accessible to our student body.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white/5">
                                <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070" alt="Board Meeting" className="w-full h-full object-cover opacity-60" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex flex-col justify-end p-12">
                                    <div className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-2">Since 1998</div>
                                    <h3 className="text-3xl font-black">A Legacy of Decision-Making</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Leadership;
