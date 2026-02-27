import React from "react";
import Layout from "@/components/common/Layout";
import { motion } from "framer-motion";
import { Music, Trophy, Users, Heart, Camera, Coffee, Utensils, Zap, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const CampusLife = () => {
    const activities = [
        { title: "Student Clubs", count: "50+", icon: Music, color: "bg-blue-500" },
        { title: "Sports Teams", count: "20+", icon: Trophy, color: "bg-orange-500" },
        { title: "Annual Fests", count: "5", icon: Zap, color: "bg-purple-500" },
        { title: "Cafeterias", count: "8", icon: Utensils, color: "bg-green-500" },
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
            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80"
                        alt="Campus Life"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-bold mb-6 italic tracking-tight">Vibrant <span className="text-primary not-italic">Community</span></h1>
                        <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed">
                            Experience a campus culture where every day is a new opportunity to learn, grow, and make lifelong memories.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="py-12 bg-background relative z-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {activities.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-6 p-6 rounded-2xl bg-muted/30 border border-border/50 hover:bg-white hover:shadow-xl transition-all duration-300"
                            >
                                <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center text-white shadow-lg`}>
                                    <item.icon className="h-7 w-7" />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold">{item.count}</div>
                                    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">{item.title}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Life at Smart Campus */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-bold">More Than Just <span className="text-primary">Academics</span></h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                At Smart Campus University, we believe in holistic development. Our campus is a melting pot of cultures, talents, and ideas. From tech competitions to music festivals, there's always something happening.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { title: "Student Clubs", desc: "Join over 50+ clubs ranging from robotics to drama." },
                                    { title: "Sports Excellence", desc: "World-class facilities for over 20+ different sports." },
                                    { title: "Food & Cafeteria", desc: "Diverse cuisines prepared with nutrition and taste in mind." },
                                    { title: "Global Events", desc: "International students bring their unique cultures to campus." }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-2">
                                        <h4 className="font-bold text-lg flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-primary" /> {item.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                            <Button size="lg" className="rounded-full px-8">Explor All Activities</Button>
                        </div>

                        <div className="relative">
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&q=80" alt="Students" className="rounded-2xl shadow-lg mt-8" />
                                <img src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=500&q=80" alt="Library" className="rounded-2xl shadow-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-24 bg-black text-white">
                <div className="container mx-auto px-4 mb-16 text-center">
                    <h2 className="text-4xl font-bold mb-4">Campus <span className="text-primary">Gallery</span></h2>
                    <p className="text-white/60">Take a virtual tour through our beautiful campus.</p>
                </div>

                <div className="container mx-auto px-4">
                    <Carousel className="w-full">
                        <CarouselContent>
                            {gallery.map((img, i) => (
                                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-2">
                                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden group">
                                            <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                                                <div>
                                                    <Badge className="mb-2 bg-primary text-white border-none">Life at Campus</Badge>
                                                    <h3 className="text-xl font-bold">Moments of Joy</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex -left-12 bg-white/10 border-white/20 text-white" />
                        <CarouselNext className="hidden md:flex -right-12 bg-white/10 border-white/20 text-white" />
                    </Carousel>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-primary text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Join Our Family?</h2>
                    <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                        Experience the vibrant campus life firsthand. Apply today and start your journey with us.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button size="lg" variant="secondary" className="rounded-full px-8 text-lg font-bold">Apply for Admission</Button>
                        <Button size="lg" variant="outline" className="rounded-full px-8 text-lg border-white/40 text-white bg-white/10 hover:bg-white/20">Schedule a Campus Visit</Button>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default CampusLife;
