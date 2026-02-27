import React from "react";
import Layout from "@/components/common/Layout";
import { motion } from "framer-motion";
import {
    Music,
    Trophy,
    Users,
    Heart,
    Camera,
    Coffee,
    Utensils,
    Zap,
    MapPin,
    Sparkles,
    Play,
    ArrowRight,
    TrendingUp,
    Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const CampusLife = () => {
    const activities = [
        { title: "Student Clubs", count: "50+", icon: Music, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Sports Teams", count: "20+", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
        { title: "Global Events", count: "12", icon: Globe, color: "text-purple-500", bg: "bg-purple-500/10" },
        { title: "Innovation Hubs", count: "8", icon: Zap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    ];

    const gallery = [
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
        "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=800&q=80",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-slate-50">
                {/* Hero Section */}
                <section className="relative h-[85vh] flex items-center overflow-hidden bg-slate-950">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1523240795612-9a054b096678?q=80&w=2070"
                            alt="Campus Life"
                            className="w-full h-full object-cover opacity-40 scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl"
                        >
                            <Badge className="mb-6 bg-primary/20 text-primary-light border-primary/30 px-6 py-2 backdrop-blur-md text-sm font-black tracking-[0.2em] uppercase">
                                Energy In Every Corner
                            </Badge>
                            <h1 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.8]">
                                BEYOND THE <br />
                                <span className="text-primary italic">CLASSROOM.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl font-light leading-relaxed mb-10">
                                Experience a kaleidoscope of cultures, ideas, and adrenaline.
                                At Smart Campus, growth happens just as much in the lounge as it does in the lab.
                            </p>
                            <div className="flex flex-wrap gap-6">
                                <Button size="lg" className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary-dark shadow-2xl shadow-primary/30 text-lg font-bold">
                                    Join the Hub <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl border-white/20 text-white bg-white/5 backdrop-blur-md hover:bg-white/10 text-lg group">
                                    <Play className="mr-2 h-5 w-5 fill-white" /> Pure Energy Film
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Decorative Vertical Text */}
                    <div className="absolute right-10 bottom-20 translate-y-1/2 rotate-90 origin-bottom-right hidden lg:block">
                        <span className="text-8xl font-black text-white/5 uppercase select-none">COMMUNITY</span>
                    </div>
                </section>

                {/* Activity Stats */}
                <section className="py-24 relative z-10 -mt-16">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {activities.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group flex items-center gap-6 p-8 rounded-[2.5rem] bg-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all border border-slate-100"
                                >
                                    <div className={`w-16 h-16 rounded-[1.5rem] ${item.bg} flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                        <item.icon className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <div className="text-4xl font-black text-slate-900 leading-none">{item.count}</div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.title}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Cultural Mosaic Section */}
                <section className="py-32 bg-white overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div className="relative order-2 lg:order-1">
                                <div className="grid grid-cols-2 gap-6 relative z-10">
                                    <motion.div initial={{ y: 0 }} whileInView={{ y: 20 }} transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}>
                                        <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&q=80" alt="Music Fest" className="rounded-[3rem] shadow-2xl h-[400px] w-full object-cover" />
                                    </motion.div>
                                    <motion.div initial={{ y: 20 }} whileInView={{ y: 0 }} transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }} className="pt-20">
                                        <img src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=500&q=80" alt="Sports" className="rounded-[3rem] shadow-2xl h-[400px] w-full object-cover" />
                                    </motion.div>
                                </div>
                                {/* Abstract Background Circle */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full -z-0" />
                            </div>

                            <div className="space-y-12 order-1 lg:order-2">
                                <div className="space-y-4">
                                    <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5">Social Fabric</Badge>
                                    <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter leading-none uppercase">
                                        A CULTURAL <br />
                                        <span className="text-primary italic">MOSAIC.</span>
                                    </h2>
                                    <p className="text-xl text-slate-500 font-medium leading-relaxed">
                                        Diversity isn't just a word here—it's the foundation of everything we do.
                                        Our campus brings together students from 30+ nations, creating a global micro-city.
                                    </p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-8">
                                    {[
                                        { title: "Dynamic Clubs", desc: "From Robotics to Experimental Cinema, find your tribe among our 50+ collectives." },
                                        { title: "Elite Sports", desc: "Train in Olympic-grade arenas for 20+ disciplines with professional coaching." },
                                        { title: "Global Dining", desc: "Explore international flavors across 8 distinct campus cafes and fine dining halls." },
                                        { title: "Annual Fests", count: "5 Major Events", desc: "Experience the legendary 'Technova' and 'Global Fusion' cultural extravaganzas." }
                                    ].map((item, i) => (
                                        <div key={i} className="space-y-3 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all">
                                            <h4 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                                                <TrendingUp className="h-5 w-5 text-primary" /> {item.title}
                                            </h4>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cinematic Gallery */}
                <section className="py-32 bg-slate-950 text-white overflow-hidden">
                    <div className="container mx-auto px-4 mb-20 text-center space-y-4">
                        <Badge className="bg-white/10 text-primary-light border-white/20">The Vision</Badge>
                        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter">Campus <span className="text-primary italic">Spectacle.</span></h2>
                        <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto italic">"A visual journey through the heart of Smart Campus University."</p>
                    </div>

                    <div className="px-4 md:px-0">
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4 md:-ml-8">
                                {gallery.map((img, i) => (
                                    <CarouselItem key={i} className="pl-4 md:pl-8 md:basis-1/2 lg:basis-1/3">
                                        <motion.div
                                            whileHover={{ scale: 0.98 }}
                                            className="relative aspect-[16/10] rounded-[3rem] overflow-hidden group border-4 border-white/5"
                                        >
                                            <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
                                                <div className="space-y-2">
                                                    <Badge className="bg-primary text-white border-none px-4 py-1">Campus Life</Badge>
                                                    <h3 className="text-3xl font-black uppercase tracking-tight">Pure Moment #{i + 1}</h3>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <div className="flex justify-center gap-6 mt-12">
                                <CarouselPrevious className="static translate-y-0 h-16 w-16 bg-white/5 border-white/10 hover:bg-primary transition-all rounded-2xl" />
                                <CarouselNext className="static translate-y-0 h-16 w-16 bg-white/5 border-white/10 hover:bg-primary transition-all rounded-2xl" />
                            </div>
                        </Carousel>
                    </div>
                </section>

                {/* High-Octane CTA */}
                <section className="py-24 bg-white relative">
                    <div className="container mx-auto px-4">
                        <div className="relative h-[600px] rounded-[5rem] overflow-hidden bg-primary shadow-2xl shadow-primary/40 flex items-center justify-center text-center p-8">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
                                className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] border border-white/10 rounded-full"
                            />

                            <div className="relative z-10 space-y-12 max-w-4xl">
                                <h2 className="text-5xl md:text-9xl font-black text-white tracking-tighter uppercase leading-[0.8]">
                                    YOUR NEW <br />
                                    <span className="text-slate-950 italic">STORY STARTS.</span>
                                </h2>
                                <p className="text-xl md:text-3xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed italic">
                                    Why just imagine it? Experience the pulse of Smart Campus today.
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center gap-8">
                                    <Link to="/admissions/apply">
                                        <Button size="lg" className="h-20 px-12 rounded-[2rem] bg-slate-950 text-white hover:bg-slate-800 text-2xl font-black shadow-2xl transition-all hover:-translate-y-1">
                                            Apply Online Now
                                        </Button>
                                    </Link>
                                    <Button size="lg" variant="outline" className="h-20 px-12 rounded-[2rem] border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 text-2xl font-black transition-all">
                                        Book Campus Tour
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

export default CampusLife;
