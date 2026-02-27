import React from "react";
import Layout from "@/components/common/Layout";
import { motion } from "framer-motion";
import {
    Target,
    Heart,
    Shield,
    Globe,
    Award,
    Sparkles,
    Zap,
    CheckCircle2,
    TrendingUp,
    BrainCircuit
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const VisionMission = () => {
    return (
        <Layout>
            <div className="min-h-screen bg-white">
                {/* Masterpiece Hero */}
                <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-slate-950">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070"
                            alt="Vision"
                            className="w-full h-full object-cover opacity-30 scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    </div>

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="max-w-5xl mx-auto space-y-8"
                        >
                            <Badge className="bg-primary/20 text-primary-light border-primary/30 px-6 py-2 backdrop-blur-md text-xs font-black tracking-[0.3em] uppercase">
                                Our Philosophical Blueprint
                            </Badge>
                            <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.8] tracking-tighter uppercase whitespace-pre-line">
                                VISION & <br /> <span className="text-primary italic">PURPOSE.</span>
                            </h1>
                            <p className="text-xl md:text-3xl text-slate-300 font-light leading-relaxed max-w-3xl mx-auto italic">
                                "Defying traditional boundaries to architect the future of global academic leadership."
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* The Duality Section (Vision & Mission) */}
                <section className="py-32 relative overflow-hidden bg-white">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                            {/* Vision Card */}
                            <motion.div
                                whileInView={{ opacity: 1, scale: 1 }}
                                initial={{ opacity: 0, scale: 0.95 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative p-12 lg:p-16 rounded-[4rem] bg-slate-950 text-white overflow-hidden shadow-2xl group"
                            >
                                <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none">
                                    <Target className="h-64 w-64 rotate-12" />
                                </div>
                                <div className="relative z-10 space-y-10">
                                    <Badge className="bg-primary hover:bg-primary border-none px-4 py-1.5 font-bold uppercase tracking-widest text-[10px]">
                                        The Horizon (Vision)
                                    </Badge>
                                    <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none uppercase">
                                        TO BE THE <br /> <span className="text-primary italic">GLOBAL AXIS.</span>
                                    </h2>
                                    <p className="text-xl text-slate-400 font-medium leading-relaxed">
                                        We envision a future where Smart Campus University stands as the primary catalyst
                                        for human transformation—an axis where innovation, ethics, and world-class research
                                        unite to solve existence's most complex challenges.
                                    </p>
                                    <div className="flex items-center gap-4 text-primary font-bold">
                                        <div className="h-10 w-10 rounded-full border border-primary/30 flex items-center justify-center">
                                            <TrendingUp className="h-5 w-5" />
                                        </div>
                                        <span>Target: Top 10 International Rank by 2030</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Mission Card */}
                            <motion.div
                                whileInView={{ opacity: 1, scale: 1 }}
                                initial={{ opacity: 0, scale: 0.95 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative p-12 lg:p-16 rounded-[4rem] bg-slate-50 text-slate-950 overflow-hidden shadow-xl border border-slate-100 group"
                            >
                                <div className="absolute top-0 right-0 p-12 text-slate-200/50 pointer-events-none">
                                    <Sparkles className="h-64 w-64 -rotate-12" />
                                </div>
                                <div className="relative z-10 space-y-10">
                                    <Badge className="bg-slate-900 border-none px-4 py-1.5 font-bold uppercase tracking-widest text-[10px] text-white">
                                        The Journey (Mission)
                                    </Badge>
                                    <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none uppercase text-slate-950">
                                        TRANSFORMING <br /> <span className="text-primary italic">GENIUS.</span>
                                    </h2>
                                    <p className="text-xl text-slate-500 font-medium leading-relaxed">
                                        Our mission is the relentless pursuit of transformative pedagogy.
                                        We don't just deliver curriculum; we synthesize environments where raw talent
                                        is refined into revolutionary leadership through multidisciplinary rigor.
                                    </p>
                                    <div className="flex items-center gap-4 text-slate-950 font-bold">
                                        <div className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center">
                                            <BrainCircuit className="h-5 w-5" />
                                        </div>
                                        <span>Focus: 100% Industry-Ready Synthesis</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Values of Excellence - Grid with Visuals */}
                <section className="py-32 bg-slate-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-24 space-y-4">
                            <Badge variant="outline" className="border-primary/20 text-primary uppercase font-black tracking-widest text-[10px]">Ethical Pillars</Badge>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tight uppercase leading-none">Our Core <span className="text-primary italic">Values.</span></h2>
                            <p className="text-xl text-slate-500 font-medium">The non-negotiable standards that define our every decision.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {[
                                { icon: Heart, title: "RADICAL INTEGRITY", desc: "Upholding absolute transparency and honesty across all academic and administrative layers.", color: "text-red-500", bg: "bg-red-500/10" },
                                { icon: Shield, title: "UNCOMPROMISING EXCELLENCE", desc: "Setting the benchmark for perfection in research, student mentoring, and global output.", color: "text-blue-500", bg: "bg-blue-500/10" },
                                { icon: Globe, title: "TOTAL INCLUSIVITY", desc: "Ensuring a borderless campus where diversity in thought, culture, and gender is celebrated.", color: "text-purple-500", bg: "bg-purple-500/10" },
                                { icon: Award, title: "ABSOLUTE ACCOUNTABILITY", desc: "Taking full ownership of our impact on individual student trajectories and societal growth.", color: "text-amber-500", bg: "bg-amber-500/10" },
                                { icon: Zap, title: "PERPETUAL INNOVATION", desc: "Constantly disrupting our own methods to stay ahead of the global technological curve.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                                { icon: Sparkles, title: "SOCIETAL SERVICE", desc: "Leveraging our research intelligence to uplift marginalized communities worldwide.", color: "text-pink-500", bg: "bg-pink-500/10" }
                            ].map((value, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 group transition-all"
                                >
                                    <div className={`h-16 w-16 rounded-[1.5rem] ${value.bg} flex items-center justify-center ${value.color} mb-8 transition-transform group-hover:scale-110`}>
                                        <value.icon className="h-8 w-8" />
                                    </div>
                                    <h4 className="text-2xl font-black mb-4 uppercase tracking-tight text-slate-900 leading-none">{value.title}</h4>
                                    <p className="text-slate-500 font-medium leading-relaxed italic">"{value.desc}"</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final Quote Section */}
                <section className="py-48 bg-slate-950 text-white relative flex items-center justify-center text-center">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="max-w-4xl mx-auto space-y-12"
                        >
                            <div className="h-20 w-1px bg-primary mx-auto" />
                            <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter leading-tight">
                                "We don't just predict the <span className="text-primary not-italic">future;</span> <br />
                                we provide the blueprints to build it."
                            </h2>
                            <div className="space-y-2">
                                <div className="font-bold uppercase tracking-[0.3em] text-primary">The Board of Trustees</div>
                                <div className="text-slate-500 text-sm font-black uppercase">Smart Campus University 2025</div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default VisionMission;
