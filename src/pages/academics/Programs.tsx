import React from "react";
import Layout from "@/components/common/Layout";
import { motion } from "framer-motion";
import {
    GraduationCap,
    Clock,
    BookOpen,
    Briefcase,
    Award,
    ArrowRight,
    ShieldCheck,
    TrendingUp,
    Globe,
    Zap,
    CheckCircle2,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Programs = () => {
    const programs = [
        {
            category: "Undergraduate",
            description: "Foundational excellence for the digital pioneers of tomorrow.",
            items: [
                { name: "B.Tech Computer Science", duration: "4 Years", seats: 120, trend: "Trending", color: "from-blue-500/20 to-blue-600/20" },
                { name: "B.Tech AI & ML", duration: "4 Years", seats: 60, trend: "Elite", color: "from-purple-500/20 to-purple-600/20" },
                { name: "B.Tech Electronics", duration: "4 Years", seats: 120, trend: "Stable", color: "from-emerald-500/20 to-emerald-600/20" },
                { name: "B.Tech Mechanical", duration: "4 Years", seats: 60, trend: "Core", color: "from-orange-500/20 to-orange-600/20" },
            ]
        },
        {
            category: "Postgraduate",
            description: "Advanced specialization for research-driven leadership.",
            items: [
                { name: "M.Tech Data Science", duration: "2 Years", seats: 30, trend: "High Demand", color: "from-pink-500/20 to-pink-600/20" },
                { name: "MBA Strategic Mgmt", duration: "2 Years", seats: 60, trend: "Global", color: "from-amber-500/20 to-amber-600/20" },
                { name: "M.Tech VLSI Design", duration: "2 Years", seats: 18, trend: "Research", color: "from-indigo-500/20 to-indigo-600/20" },
            ]
        }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-slate-50">
                {/* Academic Hero */}
                <section className="relative py-32 bg-slate-900 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1525921429624-47129505852d?q=80&w=2070')] bg-cover bg-center opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Badge className="mb-6 bg-primary/20 text-primary-light border-primary/30 px-6 py-2 backdrop-blur-md text-sm font-black tracking-[0.2em] uppercase">
                                Global Standards
                            </Badge>
                            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]">
                                ACADEMIC <br /> <span className="text-primary italic">BLUEPRINTS.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
                                Our multidisciplinary programs are architected to synthesize industry 4.0 demands
                                with deep-rooted academic rigor, producing the next generation of global innovators.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Programs Listing */}
                <section className="py-24 relative z-10 -mt-20">
                    <div className="container mx-auto px-4">
                        {programs.map((group, idx) => (
                            <div key={idx} className="mb-32 last:mb-0">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8"
                                >
                                    <div className="max-w-2xl space-y-4">
                                        <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.3em] text-xs">
                                            <GraduationCap className="h-6 w-6" /> {group.category} Tier
                                        </div>
                                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-none uppercase">{group.category} <span className="text-primary italic">Degrees.</span></h2>
                                        <p className="text-xl text-slate-500 font-medium italic">"{group.description}"</p>
                                    </div>
                                    <div className="h-0.5 flex-grow bg-slate-200 mt-12 hidden lg:block" />
                                </motion.div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {group.items.map((program, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 40 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="group"
                                        >
                                            <Card className={`relative h-full rounded-[2.5rem] overflow-hidden border-none shadow-xl shadow-slate-200/50 bg-gradient-to-br ${program.color} hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group`}>
                                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm group-hover:bg-white transition-colors" />

                                                <CardContent className="relative p-10 space-y-8 h-full flex flex-col justify-between">
                                                    <div className="space-y-6">
                                                        <div className="flex justify-between items-center">
                                                            <Badge className="bg-primary/20 text-primary-dark border-none px-4 py-1.5 font-black uppercase tracking-widest text-[10px]">
                                                                {program.trend}
                                                            </Badge>
                                                            <TrendingUp className="h-5 w-5 text-slate-300" />
                                                        </div>
                                                        <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">{program.name}</h3>
                                                    </div>

                                                    <div className="space-y-4 pt-10 border-t border-slate-200/50">
                                                        <div className="flex items-center text-sm font-bold text-slate-600 gap-3">
                                                            <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                                                                <Clock className="h-5 w-5" />
                                                            </div>
                                                            <span>Duration: {program.duration}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm font-bold text-slate-600 gap-3">
                                                            <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                                                                <Briefcase className="h-5 w-5" />
                                                            </div>
                                                            <span>Intake: {program.seats} Seats</span>
                                                        </div>
                                                    </div>

                                                    <Button className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold group-hover:bg-primary transition-all mt-8 group-hover:shadow-[0_15px_30px_-5px_rgba(var(--primary),0.4)]">
                                                        Degree Roadmap <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Synthesis Section */}
                <section className="py-32 bg-slate-950 text-white relative">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div className="relative">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80" alt="Collaboration" className="rounded-[3rem] shadow-2xl h-80 w-full object-cover" />
                                        <div className="bg-primary p-10 rounded-[3rem] text-center space-y-2">
                                            <div className="text-5xl font-black tracking-tighter">100%</div>
                                            <div className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Industry Sync</div>
                                        </div>
                                    </div>
                                    <div className="space-y-6 pt-24">
                                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] space-y-4">
                                            <Globe className="h-10 w-10 text-primary" />
                                            <div className="text-xl font-black">Global Faculty</div>
                                            <p className="text-slate-400 text-sm font-medium">Experts from MIT, Stanford, and Oxford.</p>
                                        </div>
                                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80" alt="Team" className="rounded-[3rem] shadow-2xl h-64 w-full object-cover" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-12">
                                <div className="space-y-6">
                                    <Badge className="bg-primary/20 text-primary-light border-primary/30 px-4 py-1.5">Beyond Curriculum</Badge>
                                    <h2 className="text-4xl md:text-6xl font-black uppercase leading-none tracking-tight">The Pedagogy <br /> <span className="text-primary italic">Synthesis.</span></h2>
                                    <p className="text-xl text-slate-400 font-medium leading-relaxed">
                                        We don't teach. We architect journeys. Every program is a synthesis
                                        of theory, applied labs, and real-world corporate sprints.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { title: "AI-Integrated Learning", desc: "Every program includes modules on AI relevant to the specific domain." },
                                        { title: "Corporate Sprints", desc: "Mandatory 3nd-year industry integration with fortune 500 companies." },
                                        { title: "Soft Skill Synthesis", desc: "Developing emotional intelligence and high-stakes leadership alongside tech." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-all">
                                            <div className="h-14 w-14 shrink-0 bg-primary/20 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <CheckCircle2 className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                                                <p className="text-slate-500 font-medium text-sm">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Admission Referral */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                            <div className="relative z-10 space-y-10">
                                <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">READY TO <br /> <span className="text-primary italic">EVOLVE?</span></h2>
                                <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light">
                                    Admissions are selectively open for the 2025 academic session. Secure your position in the next cohort.
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center gap-6">
                                    <Button className="h-20 px-12 rounded-[1.5rem] bg-primary text-white text-xl font-black hover:bg-primary-dark shadow-2xl transition-all">
                                        Begin Application
                                    </Button>
                                    <Button variant="outline" className="h-20 px-12 rounded-[1.5rem] border-white/20 text-white bg-white/5 backdrop-blur-md text-xl font-black hover:bg-white/10">
                                        Download Brochure <Sparkles className="ml-3 h-6 w-6" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Programs;
