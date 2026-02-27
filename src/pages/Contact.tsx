import React from "react";
import Layout from "@/components/common/Layout";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, Globe, Facebook, Twitter, Instagram, Linkedin, MessageSquare, Headphones, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const Contact = () => {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Transmission Successful",
            description: "Our concierge team has received your message and will respond shortly.",
        });
    };

    const contactMethods = [
        {
            icon: Phone,
            title: "Voice Support",
            details: "+1 (888) SMART-360",
            description: "Direct line to our admissions office.",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            icon: Mail,
            title: "Electronic Mail",
            details: "hello@smartcampus.edu",
            description: "For general inquiries and academic support.",
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            icon: MessageSquare,
            title: "Chat Assistance",
            details: "Instant Messaging",
            description: "Available 24/7 on our student portal.",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-slate-50">
                {/* Hero Section */}
                <section className="relative py-32 bg-slate-900 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074')] bg-cover bg-center opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Badge className="mb-6 bg-primary/20 text-primary-light border-primary/30 px-6 py-2 backdrop-blur-md text-sm font-bold tracking-[0.2em] uppercase">
                                Connect With Us
                            </Badge>
                            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter">
                                LET'S START A <br />
                                <span className="text-primary italic">CONVERSATION.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
                                Whether you're a prospective student, an innovative researcher, or a curious parent, we're here to provide the clarity you need.
                            </p>
                        </motion.div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -bottom-24 left-0 w-full h-48 bg-slate-50 skew-y-3 origin-bottom-left" />
                </section>

                <section className="py-24 relative z-10 -mt-12">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                            {/* Contact Info Sidebar */}
                            <div className="lg:col-span-5 space-y-12">
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Our Presence</h2>
                                    <p className="text-lg text-slate-500 leading-relaxed font-medium">
                                        Physically situated in the heart of the Tech District,
                                        digitally available everywhere.
                                    </p>
                                </div>

                                <div className="grid gap-6">
                                    {contactMethods.map((method, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="group flex gap-6 p-8 rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all border border-slate-100"
                                        >
                                            <div className={`h-16 w-16 shrink-0 rounded-[1.5rem] ${method.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                                <method.icon className={`h-8 w-8 ${method.color}`} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{method.title}</h4>
                                                <p className="text-2xl font-black text-slate-900 mb-1">{method.details}</p>
                                                <p className="text-sm text-slate-500 font-medium">{method.description}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <Card className="rounded-[2.5rem] bg-primary overflow-hidden border-none shadow-2xl text-white">
                                    <CardContent className="p-10 text-center space-y-8">
                                        <Headphones className="h-16 w-16 mx-auto opacity-40" />
                                        <div className="space-y-2">
                                            <h3 className="text-3xl font-black">Admissions Concierge</h3>
                                            <p className="opacity-80">Our specialized team is ready to guide you through your enrollment journey.</p>
                                        </div>
                                        <Button className="w-full h-16 rounded-[1.5rem] bg-white text-primary hover:bg-slate-50 text-xl font-black shadow-xl">
                                            Schedule a Call
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Contact Form */}
                            <div className="lg:col-span-7">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden bg-white">
                                        <CardContent className="p-10 md:p-16">
                                            <div className="space-y-4 mb-12">
                                                <h2 className="text-4xl font-black tracking-tight text-slate-900">INTAKE FORM</h2>
                                                <p className="text-slate-500 font-medium text-lg">Detailed inquiries yield the most precise responses.</p>
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-10">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Identity</label>
                                                        <Input
                                                            placeholder="Full Name"
                                                            className="h-16 bg-slate-50 border-transparent rounded-2xl focus-visible:ring-primary focus-visible:bg-white text-lg font-medium px-6 transition-all"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Communication</label>
                                                        <Input
                                                            type="email"
                                                            placeholder="Email Address"
                                                            className="h-16 bg-slate-50 border-transparent rounded-2xl focus-visible:ring-primary focus-visible:bg-white text-lg font-medium px-6 transition-all"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Telephony</label>
                                                        <Input
                                                            placeholder="Phone Number"
                                                            className="h-16 bg-slate-50 border-transparent rounded-2xl focus-visible:ring-primary focus-visible:bg-white text-lg font-medium px-6 transition-all"
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Objective</label>
                                                        <Input
                                                            placeholder="Subject of Interest"
                                                            className="h-16 bg-slate-50 border-transparent rounded-2xl focus-visible:ring-primary focus-visible:bg-white text-lg font-medium px-6 transition-all"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Elaboration</label>
                                                    <Textarea
                                                        placeholder="Your detailed message..."
                                                        className="min-h-[200px] bg-slate-50 border-transparent rounded-3xl focus-visible:ring-primary focus-visible:bg-white text-lg font-medium p-6 transition-all resize-none shadow-inner"
                                                        required
                                                    />
                                                </div>

                                                <Button type="submit" size="lg" className="h-20 w-full rounded-[1.5rem] bg-primary hover:bg-primary-dark text-xl font-black shadow-[0_20px_40px_-10px_rgba(var(--primary),0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all group overflow-hidden relative">
                                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                                        Dispatch Message <Send className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                    </span>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-light/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                                </Button>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Aesthetic Map Section */}
                <section className="py-24 bg-white overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="relative h-[600px] rounded-[4rem] overflow-hidden shadow-2xl border-8 border-slate-50">
                            {/* Map Placeholder Content */}
                            <div className="absolute inset-0 bg-slate-200 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074" className="w-full h-full object-cover opacity-50 grayscale contrast-125" alt="Map" />
                                <div className="absolute inset-0 bg-slate-900/10 mix-blend-multiply" />
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className="w-40 h-40 bg-primary/20 rounded-full flex items-center justify-center"
                                />
                                <div className="absolute w-20 h-20 bg-primary rounded-full shadow-2xl flex items-center justify-center text-white border-4 border-white pointer-events-auto cursor-pointer animate-bounce">
                                    <MapPin className="h-10 w-10" />
                                </div>
                            </div>

                            <Card className="absolute top-10 left-10 p-8 rounded-[2rem] bg-white/90 backdrop-blur-xl border-white/20 shadow-2xl max-w-sm hidden md:block">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                            <Globe className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 leading-none">Global Campus</h4>
                                            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Tech District HQ</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 font-medium">123 University Avenue, Building 7, Smart City Academic Quarter, SC 12345</p>
                                    <Button variant="ghost" className="w-full justify-between h-12 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold group">
                                        Open Directions <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Contact;
