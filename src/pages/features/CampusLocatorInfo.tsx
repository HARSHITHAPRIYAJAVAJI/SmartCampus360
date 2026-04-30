import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    MapPin, Navigation, Search, Globe, Zap,
    ArrowLeft, CheckCircle2, Compass, Radar, Landmark
} from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/common/Layout";

export default function CampusLocatorInfo() {
    return (
        <Layout>
            <div className="pt-24 pb-20 bg-background overflow-hidden">
                <div className="container mx-auto px-4">
                    <Link to="/modules" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-bold text-sm mb-12 group">
                        <ArrowLeft className="w-4 h-4" /> Back to Modules
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest uppercase px-3 py-1 mb-4">Core AI Module</Badge>
                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6 text-foreground">
                                    Intelligent <br />
                                    <span className="text-primary italic">Campus Locator</span>
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                                    Never get lost again. Our real-time positioning system uses AI to map faculty schedules to physical locations across the entire campus.
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { icon: Radar, title: "Faculty Tracking", desc: "Know exactly where any faculty member is based on their live timetable." },
                                    { icon: Navigation, title: "Room Navigation", desc: "Get turn-by-turn directions to any classroom or laboratory." },
                                    { icon: Compass, title: "Facility Discovery", desc: "Locate libraries, sports complexes, and administrative offices easily." },
                                    { icon: Globe, title: "Live Status", desc: "See real-time occupancy and availability of campus resources." }
                                ].map((feature, i) => (
                                    <Card key={i} className="border-none shadow-md bg-muted/30">
                                        <CardContent className="p-4 flex gap-4 items-start">
                                            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                                                <feature.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-foreground">{feature.title}</h4>
                                                <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <Link to="/find-people">
                                    <Button size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90">Open Locator</Button>
                                </Link>
                                <Button size="lg" variant="outline" className="rounded-full px-8 border-primary/20 text-primary hover:bg-primary/5">View Campus Map</Button>
                            </div>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="absolute -top-12 -right-12 h-64 w-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
                            <div className="absolute -bottom-12 -left-12 h-64 w-64 bg-orange-500/10 rounded-full blur-3xl opacity-50" />
                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white dark:border-zinc-900 group">
                                <img 
                                    src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=1200&auto=format&fit=crop&q=80" 
                                    alt="Campus Navigation" 
                                    className="w-full h-auto"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="absolute -bottom-8 -right-8 bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-2xl border border-border/50 animate-bounce-slow">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-foreground leading-none">100%</div>
                                        <div className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mt-1">Accuracy</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="space-y-16">
                        <div className="text-center max-w-2xl mx-auto">
                            <h2 className="text-3xl font-black tracking-tight mb-4 italic">Seamless Navigation</h2>
                            <p className="text-muted-foreground">Integrating GPS data with institutional schedules to provide the most advanced campus navigation experience available today.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { 
                                    title: "Interactive Directory", 
                                    desc: "Search for any student or staff member and get their current academic location instantly.",
                                    icon: Search
                                },
                                { 
                                    title: "Smart Landmarks", 
                                    desc: "Major campus landmarks are digitized to help users orient themselves in unfamiliar areas.",
                                    icon: Landmark
                                },
                                { 
                                    title: "Dynamic Rerouting", 
                                    desc: "Automatically adjusts directions based on event-driven changes in the institutional schedule.",
                                    icon: Zap
                                }
                            ].map((item, i) => (
                                <div key={i} className="bg-white dark:bg-zinc-900/50 p-8 rounded-[2rem] border border-border/50 hover:border-primary/50 transition-colors group">
                                    <item.icon className="h-10 w-10 text-primary mb-6 transition-transform group-hover:scale-110" />
                                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
