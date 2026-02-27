import React from "react";
import Layout from "@/components/common/Layout";
import { motion } from "framer-motion";
import { Linkedin, Mail, Twitter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Leadership = () => {
    const leaders = [
        {
            name: "Dr. Sarah Mitchell",
            role: "Vice Chancellor",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
            bio: "With over 25 years in academic administration, Dr. Mitchell has pioneered several international collaborations."
        },
        {
            name: "Prof. David Chen",
            role: "Dean of Academics",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
            bio: "A renowned researcher in AI, Prof. Chen oversees the design and implementation of our global curriculum."
        },
        {
            name: "Dr. Elena Rodriguez",
            role: "Director of Research",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
            bio: "Dr. Rodriguez leads our interdisciplinary research centers and state-of-the-art laboratory initiatives."
        }
    ];

    return (
        <Layout>
            <section className="py-24 bg-muted/50">
                <div className="container mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 italic tracking-tight underline-offset-8 decoration-primary decoration-4">Our <span className="text-primary not-italic">Leadership</span></h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Meet the visionaries who are steering Smart Campus University towards a brighter, smarter future.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {leaders.map((leader, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group"
                            >
                                <Card className="border-none shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                                    <div className="relative aspect-square overflow-hidden">
                                        <img src={leader.image} alt={leader.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-8">
                                            <div className="flex gap-4">
                                                <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur-md text-white border-white/20 hover:bg-primary"><Linkedin className="h-5 w-5" /></Button>
                                                <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur-md text-white border-white/20 hover:bg-primary"><Twitter className="h-5 w-5" /></Button>
                                                <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur-md text-white border-white/20 hover:bg-primary"><Mail className="h-5 w-5" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                    <CardContent className="p-8 text-center bg-white relative z-10">
                                        <h3 className="text-2xl font-bold mb-1">{leader.name}</h3>
                                        <div className="text-primary font-bold uppercase tracking-widest text-xs mb-4">{leader.role}</div>
                                        <p className="text-muted-foreground leading-relaxed">{leader.bio}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Leadership;
