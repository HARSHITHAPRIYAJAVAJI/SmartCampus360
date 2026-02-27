import React from "react";
import Layout from "@/components/common/Layout";
import { motion } from "framer-motion";
import { Target, Heart, Shield, Globe, Award, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const VisionMission = () => {
    return (
        <Layout>
            <section className="py-24 bg-primary text-white overflow-hidden relative">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070')] bg-cover"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto text-center">
                        <Badge variant="outline" className="border-white/20 text-white mb-6 bg-white/10 px-4 py-1">Our Core Philosophy</Badge>
                        <h1 className="text-5xl md:text-8xl font-bold mb-8">Vision & <span className="text-accent underline decoration-primary-dark">Mission</span></h1>
                        <p className="text-2xl text-white/80 leading-relaxed font-light">
                            Shaping a world where technology and human potential converge to create sustainable excellence.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        <motion.div whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -50 }} viewport={{ once: true }} className="space-y-8">
                            <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                                <Target className="h-5 w-5" /> Our Vision
                            </div>
                            <h2 className="text-4xl font-bold leading-tight">To be a globally recognized center of innovation and leadership.</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Our vision is to empower individuals to achieve their highest potential through world-class education, cutting-edge research, and a commitment to serving society. We strive to create an environment that fosters creativity, critical thinking, and ethical leadership.
                            </p>
                        </motion.div>

                        <motion.div whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: 50 }} viewport={{ once: true }} className="space-y-8">
                            <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                                <Sparkles className="h-5 w-5" /> Our Mission
                            </div>
                            <h2 className="text-4xl font-bold leading-tight">Fostering excellence through transformative education.</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                We are dedicated to providing a transformative educational experience that prepares students for global challenges. Our mission is to integrate multidisciplinary knowledge with practical wisdom, ensuring our graduates are not just job-ready, but future-ready.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4 text-center mb-16">
                    <h2 className="text-4xl font-bold">Our Core <span className="text-primary">Values</span></h2>
                </div>
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Heart, title: "Integrity", desc: "Upholding the highest ethical standards in all our endeavors." },
                        { icon: Shield, title: "Excellence", desc: "Pursuing perfection in education, research, and administration." },
                        { icon: Globe, title: "Inclusivity", desc: "Celebrating diversity and providing equal opportunities for all." },
                        { icon: Award, title: "Accountability", desc: "Taking responsibility for our impact on students and the society." },
                        { icon: Target, title: "Innovation", desc: "Constant evolution and embracing new technological frontiers." },
                        { icon: Sparkles, title: "Service", desc: "Contributing positively to the local and global community." }
                    ].map((value, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-xl transition-all">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                <value.icon className="h-6 w-6" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">{value.title}</h4>
                            <p className="text-muted-foreground">{value.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </Layout>
    );
};

export default VisionMission;
