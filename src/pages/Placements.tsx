import React from "react";
import Layout from "@/components/common/Layout";
import { motion } from "framer-motion";
import {
    Briefcase,
    TrendingUp,
    Users,
    Award,
    Globe,
    Building2,
    CheckCircle2,
    ArrowRight,
    Quote,
    Zap,
    Star,
    Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Placements = () => {
    const stats = [
        { label: "Highest CTC", value: "45.5 LPA", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Average CTC", value: "12.8 LPA", icon: Award, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Recruiters", value: "250+", icon: Building2, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Placement Rate", value: "95%", icon: CheckCircle2, color: "text-amber-500", bg: "bg-amber-500/10" },
    ];

    const recruiters = [
        "Google", "Microsoft", "Amazon", "Meta", "Adobe", "Intel", "IBM", "TCS", "Infosys", "Wipro"
    ];

    const testimonials = [
        {
            name: "Rohan Khanna",
            company: "Google",
            role: "Software Engineer",
            image: "https://i.pravatar.cc/150?u=rohan",
            quote: "The career cell at Smart Campus didn't just help me find a job; they helped me build a career. The interview prep was world-class."
        },
        {
            name: "Ananya Iyer",
            company: "Microsoft",
            role: "Product Manager",
            image: "https://i.pravatar.cc/150?u=ananya",
            quote: "Landing a role at Microsoft was a dream. The placement bootcamps and industry mentorship sessions made it possible."
        },
        {
            name: "Vikram Seth",
            company: "Amazon",
            role: "Cloud Architect",
            image: "https://i.pravatar.cc/150?u=vikram",
            quote: "The exposure we get to modern tech stacks and real-world projects is what sets our placement statistics apart."
        }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-slate-50">
                {/* Placement Hero */}
                <section className="relative py-32 bg-slate-900 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070')] bg-cover bg-center opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl mx-auto"
                        >
                            <Badge className="mb-6 bg-primary/20 text-primary-light border-primary/30 px-6 py-2 backdrop-blur-md text-sm font-black tracking-[0.2em] uppercase">
                                Global Career Launchpad
                            </Badge>
                            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]">
                                YOUR FUTURE <br /> <span className="text-primary italic">UNLOCKED.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-300 mb-12 font-light leading-relaxed">
                                We bridge the gap between academic brilliance and industrial leadership.
                                Our graduates are consistently recruited by the world's most innovative organizations.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-6">
                                <Button size="lg" className="h-16 px-12 rounded-2xl bg-primary hover:bg-primary-dark text-lg font-bold shadow-2xl shadow-primary/30">
                                    Placement Report 2024
                                </Button>
                                <Button size="lg" variant="outline" className="h-16 px-12 rounded-2xl border-white/20 text-white bg-white/5 backdrop-blur-md hover:bg-white/10 text-lg">
                                    For Recruiters
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Impact Stats */}
                <section className="py-24 relative z-10 -mt-20">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group p-10 rounded-[3rem] bg-white shadow-2xl shadow-slate-200/50 hover:shadow-primary/5 transition-all border border-slate-100 flex flex-col items-center text-center"
                                >
                                    <div className={`w-16 h-16 rounded-[1.5rem] ${stat.bg} flex items-center justify-center ${stat.color} mb-6 transition-transform group-hover:rotate-12`}>
                                        <stat.icon className="h-8 w-8" />
                                    </div>
                                    <div className="text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Recruiter Marquee (Static grid for now but styled) */}
                <section className="py-32 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-20 space-y-4">
                            <Badge variant="outline" className="border-primary/20 text-primary uppercase font-black tracking-widest text-[10px]">Global Partnerships</Badge>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight uppercase leading-none">THE INDUSTRY <br /> <span className="text-primary italic">TITANS.</span></h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                            {recruiters.map((brand, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="h-32 flex items-center justify-center p-8 rounded-[2rem] bg-slate-50 border border-slate-100 grayscale hover:grayscale-0 transition-all cursor-pointer group"
                                >
                                    <span className="text-2xl font-black text-slate-300 group-hover:text-slate-900 tracking-tighter uppercase transition-colors">{brand}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Success Stories Section */}
                <section className="py-32 bg-slate-950 text-white relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                            <div className="max-w-2xl">
                                <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none uppercase">VOICES OF <br /> <span className="text-primary italic">VICTORY.</span></h2>
                                <p className="text-xl text-slate-400 font-medium italic mt-4">"Real stories from our high-performing alumni community."</p>
                            </div>
                            <Button variant="ghost" className="h-16 rounded-2xl px-10 text-lg font-black group bg-white/5 border border-white/10 hover:bg-white/10 text-white">
                                All Testimonials <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {testimonials.map((test, i) => (
                                <Card key={i} className="group overflow-hidden border-none shadow-2xl rounded-[3rem] bg-white/5 border border-white/10 transition-all duration-500 hover:bg-white/10">
                                    <CardContent className="p-10 space-y-10">
                                        <div className="relative">
                                            <Quote className="h-16 w-16 text-primary/20 absolute -top-8 -left-8" />
                                            <p className="text-xl text-slate-300 leading-relaxed font-light italic relative z-10">
                                                "{test.quote}"
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-6 border-t border-white/5 pt-10">
                                            <div className="h-20 w-20 rounded-3xl overflow-hidden border-4 border-white/10 shrink-0">
                                                <img src={test.image} alt={test.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="text-2xl font-black text-white leading-none">{test.name}</h4>
                                                <div className="text-primary font-bold text-xs uppercase tracking-widest mt-2">{test.role} @ {test.company}</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="relative h-[500px] rounded-[5rem] overflow-hidden bg-slate-900 flex items-center justify-center p-8 text-center text-white">
                            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                            <div className="relative z-10 space-y-12 max-w-4xl">
                                <h2 className="text-5xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8]">
                                    SECURE YOUR <br /> <span className="text-primary italic">LEGACY.</span>
                                </h2>
                                <p className="text-xl md:text-2xl text-slate-300 font-light max-w-xl mx-auto italic">
                                    Our placement cell is waiting to guide you to your dream role.
                                    Are you ready to join the elite?
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center gap-6">
                                    <Button size="lg" className="h-20 px-12 rounded-[2rem] bg-primary text-white text-xl font-black hover:bg-primary-dark shadow-2xl transition-all">
                                        Enroll Now
                                    </Button>
                                    <Button size="lg" variant="outline" className="h-20 px-12 rounded-[2rem] border-white/20 text-white bg-white/20 backdrop-blur-md text-xl font-black hover:bg-white/30">
                                        Career Roadmap
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

export default Placements;
