import React from "react";
import Layout from "@/components/common/Layout";
import { motion } from "framer-motion";
import {
    Search,
    Book,
    Headphones,
    Laptop,
    Clock,
    MapPin,
    ExternalLink,
    Globe,
    GraduationCap,
    Users,
    Database,
    ShieldCheck,
    Zap,
    Library as LibraryIcon,
    ArrowRight,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Library = () => {
    const categories = [
        { title: "Digital Archives", count: "45k+", icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Physical Books", count: "120k+", icon: Book, color: "text-amber-500", bg: "bg-amber-500/10" },
        { title: "E-Journals", count: "2.5k+", icon: Headphones, color: "text-purple-500", bg: "bg-purple-500/10" },
        { title: "Academic Papers", count: "15k+", icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-slate-50">
                {/* Hero Section */}
                <section className="relative py-32 bg-slate-900 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548048026-5a1a941d93d3?q=80&w=2070')] bg-cover bg-center opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl mx-auto"
                        >
                            <Badge className="mb-6 bg-primary/20 text-primary-light border-primary/30 px-6 py-2 backdrop-blur-md text-sm font-bold tracking-[0.2em] uppercase">
                                The Knowledge Core
                            </Badge>
                            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]">
                                DIGITAL <br />
                                <span className="text-primary italic">ASSET ARCHIVE.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-300 mb-12 font-light leading-relaxed">
                                Access a universe of information. Our hybrid library system merges physical rare collections with a hyper-speed digital database.
                            </p>

                            <div className="relative max-w-2xl mx-auto group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-light rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                                <div className="relative flex items-center">
                                    <Search className="absolute left-6 text-slate-400 h-6 w-6" />
                                    <Input
                                        placeholder="Search across 500k+ assets..."
                                        className="pl-16 pr-32 h-20 rounded-full border-none bg-white lg:text-xl font-medium shadow-2xl focus-visible:ring-primary"
                                    />
                                    <Button className="absolute right-3 h-14 rounded-full px-10 text-lg font-black bg-primary hover:bg-primary-dark transition-all">
                                        SCAN
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Quick Stats Grid */}
                <section className="py-24 relative z-10 -mt-12">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {categories.map((cat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group p-8 rounded-[2.5rem] bg-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all border border-slate-100 flex flex-col items-center text-center"
                                >
                                    <div className={`w-16 h-16 rounded-[1.5rem] ${cat.bg} flex items-center justify-center ${cat.color} mb-6 transition-transform group-hover:scale-110`}>
                                        <cat.icon className="h-8 w-8" />
                                    </div>
                                    <div className="text-4xl font-black text-slate-900 mb-1">{cat.count}</div>
                                    <div className="text-xs text-slate-400 font-black uppercase tracking-widest">{cat.title}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Collections Section */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                            <div className="max-w-2xl">
                                <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-slate-900 uppercase leading-none">
                                    Curated <br />
                                    <span className="text-primary italic">Intelligence.</span>
                                </h2>
                                <p className="text-xl text-slate-500 font-medium leading-relaxed">
                                    Rare manuscripts integrated with modern neural network research,
                                    available at the tip of your fingers.
                                </p>
                            </div>
                            <Button variant="ghost" className="h-16 rounded-2xl px-10 text-lg font-black group bg-slate-100 hover:bg-slate-200">
                                Browse Categories <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { title: "Neural Networks & AI Ethics", category: "Computing", image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80" },
                                { title: "Global Sustainability Index", category: "Economics", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80" },
                                { title: "Historical Tech Documents", category: "History", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80" }
                            ].map((item, i) => (
                                <Card key={i} className="group overflow-hidden border-none shadow-2xl rounded-[3rem] bg-white transition-all duration-500 hover:-translate-y-2">
                                    <div className="h-64 overflow-hidden relative">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                                        <Badge className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white border-white/30 px-4 py-1.5">{item.category}</Badge>
                                    </div>
                                    <CardContent className="p-8 space-y-6">
                                        <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex -space-x-3">
                                                {[1, 2, 3].map(j => (
                                                    <div key={j} className="h-10 w-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
                                                        <img src={`https://i.pravatar.cc/100?img=${j + 10}`} alt="Reader" className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                                <div className="h-10 w-10 rounded-full border-4 border-white bg-slate-900 flex items-center justify-center text-[10px] text-white font-bold">+12</div>
                                            </div>
                                            <Button variant="ghost" className="p-0 h-auto font-black text-primary hover:bg-transparent group/btn">
                                                READ NOW <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Infrastructure/Services Section */}
                <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
                            <Badge className="bg-primary/20 text-primary-light border-primary/30">Facility Infrastructure</Badge>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none uppercase">Beyond <span className="text-primary italic">Archives.</span></h2>
                            <p className="text-xl text-slate-400 font-medium">
                                A high-tech ecosystem designed for hyper-focused deep study and collaborative innovation.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {[
                                { icon: Laptop, title: "Neural Link Access", desc: "Remote high-speed access to digital resources from any global location via secure tunnel." },
                                { icon: Database, title: "Deep-Data Search", desc: "AI-powered contextual search engine that understands your research citations and suggests relevant papers." },
                                { icon: Clock, title: "Zero-Dark-Thirty", desc: "Physical library remains operational 24/7/365 with automated robotic book retrieval systems." },
                                { icon: ShieldCheck, title: "Archive Security", desc: "Triple-redundant offsite backup for all digital archives ensuring data integrity for centuries." },
                                { icon: Zap, title: "Focus Chambers", desc: "Sound-isolated individual study pods with adjustable bio-lighting and oxygen-enriched air." },
                                { icon: LibraryIcon, title: "The Atrium", desc: "A massive multi-level collaborative space with smart surfaces and holographic displays." }
                            ].map((service, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10, backgroundColor: 'rgba(255,255,255,0.08)' }}
                                    className="p-10 rounded-[3rem] bg-white/5 border border-white/10 transition-all duration-500 group"
                                >
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-primary/20 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                                        <service.icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{service.title}</h3>
                                    <p className="text-slate-400 leading-relaxed font-medium text-lg">{service.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-24 p-12 rounded-[4rem] bg-gradient-to-r from-primary to-primary-dark flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black leading-none">NEED SPECIFIC DATA?</h3>
                                <p className="text-white/80 text-xl font-medium">Request inter-library loans or specialized data sets from our global partners.</p>
                            </div>
                            <Button className="h-20 px-12 rounded-[1.5rem] bg-white text-primary text-xl font-black hover:bg-slate-50 shadow-xl transition-all">
                                OPEN HELP DESK <Sparkles className="ml-3 h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Library;
