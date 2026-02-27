import React from "react";
import Layout from "@/components/common/Layout";
import { motion } from "framer-motion";
import { Search, Book, Headphones, Laptop, Clock, MapPin, ExternalLink, Globe, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Library = () => {
    const categories = [
        { title: "Digital Archives", count: "45,000+", icon: Globe },
        { title: "Physical Books", count: "120,000+", icon: Book },
        { title: "E-Journals", count: "2,500+", icon: Headphones },
        { title: "Research Papers", count: "15,000+", icon: GraduationCap },
    ];

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative py-20 bg-primary/10 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 border-none px-4 py-1">Knowledge Hub</Badge>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Digital & Physical <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">Library</span></h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Access millions of resources, research papers, and digital archives from anywhere in the world.
                        </p>

                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                                placeholder="Search for books, journals, or research papers..."
                                className="pl-12 h-14 rounded-full shadow-xl border-none bg-white lg:text-lg"
                            />
                            <Button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6 h-10">Search</Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 -mt-10 relative z-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-6 rounded-2xl shadow-lg border border-primary/5 flex flex-col items-center text-center"
                            >
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                                    <cat.icon className="h-6 w-6" />
                                </div>
                                <div className="text-2xl font-bold text-foreground">{cat.count}</div>
                                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{cat.title}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Resources */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 text-center md:text-left">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Featured Digital Collections</h2>
                            <p className="text-muted-foreground">Rare manuscripts and modern research accessible to all students.</p>
                        </div>
                        <Button variant="outline" className="rounded-full">View All Collections</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "AI & Future Tech", category: "Technology", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&q=80" },
                            { title: "Renewable Energy Research", category: "Environment", image: "https://images.unsplash.com/photo-1509391366360-fe5bb6585e2b?w=500&q=80" },
                            { title: "Classical Literature Archives", category: "History", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&q=80" }
                        ].map((item, i) => (
                            <Card key={i} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <Badge className="absolute top-4 right-4 bg-white/90 text-primary hover:bg-white">{item.category}</Badge>
                                </div>
                                <CardHeader>
                                    <CardTitle className="group-hover:text-primary transition-colors">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="ghost" className="p-0 h-auto font-semibold text-primary group-hover:underline">
                                        Access Resource <ExternalLink className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4 text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Library Services</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Our library is more than just books. It's a space for collaboration and deep focused study.
                    </p>
                </div>

                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: Laptop, title: "Virtual Library Access", desc: "24/7 access to digital resources from off-campus via secure login." },
                        { icon: Users, title: "Collaborative Study Rooms", desc: "Equipped with smart boards and high-speed internet for group projects." },
                        { icon: Clock, title: "Extended Hours", desc: "During examination periods, the physical library stays open 24/7." },
                        { icon: MapPin, title: "Quiet Zones", desc: "Dedicated floors for silent individual study and research." },
                        { icon: Headphones, title: "Audio-Visual Center", desc: "Large collection of educational videos, documentaries, and interactive media." },
                        { icon: Search, title: "Research Assistance", desc: "Librarians available to help you find sources for your thesis or projects." }
                    ].map((service, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="p-8 bg-white rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-all"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                <service.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </Layout>
    );
};

export default Library;
