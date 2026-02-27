import React from "react";
import Layout from "@/components/common/Layout";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Globe, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Message Sent!",
            description: "We've received your inquiry and will get back to you within 24 hours.",
        });
    };

    const contactInfo = [
        { icon: Phone, title: "Phone", details: "+1 (555) 000-0000", sub: "Mon-Fri 9am to 6pm" },
        { icon: Mail, title: "Email", details: "admissions@smartcampus.edu", sub: "For all general inquiries" },
        { icon: MapPin, title: "Address", details: "123 University Ave", sub: "Smart City, SC 12345" },
        { icon: Clock, title: "Working Hours", details: "9:00 AM - 5:00 PM", sub: "Saturday & Sunday Closed" },
    ];

    return (
        <Layout>
            {/* Hero Section */}
            <section className="py-24 bg-primary/5">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Get in <span className="text-primary">Touch</span></h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Have questions? We're here to help. Reach out to us through any of the channels below.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Contact Info Column */}
                        <div className="lg:col-span-1 space-y-8">
                            <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {contactInfo.map((info, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-4 p-6 rounded-2xl bg-muted/30 border border-border/50 hover:bg-white hover:shadow-lg transition-all"
                                    >
                                        <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <info.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{info.title}</h4>
                                            <p className="text-foreground font-medium">{info.details}</p>
                                            <p className="text-sm text-muted-foreground">{info.sub}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="pt-8 border-t">
                                <h4 className="font-bold mb-4">Follow Us</h4>
                                <div className="flex gap-4">
                                    {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                        <Button key={i} variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-colors">
                                            <Icon className="h-5 w-5" />
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="lg:col-span-2">
                            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
                                <CardContent className="p-8 md:p-12">
                                    <h2 className="text-3xl font-bold mb-8">Send us a Message</h2>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                                                <Input placeholder="John Doe" className="h-12 bg-muted/50 border-none rounded-xl focus-visible:ring-primary" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                                                <Input type="email" placeholder="john@example.com" className="h-12 bg-muted/50 border-none rounded-xl focus-visible:ring-primary" required />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Phone Number</label>
                                                <Input placeholder="+1 (555) 000-0000" className="h-12 bg-muted/50 border-none rounded-xl focus-visible:ring-primary" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Subject</label>
                                                <Input placeholder="Admissions Inquiry" className="h-12 bg-muted/50 border-none rounded-xl focus-visible:ring-primary" required />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Message</label>
                                            <Textarea placeholder="How can we help you today?" className="min-h-[150px] bg-muted/50 border-none rounded-xl focus-visible:ring-primary resize-none" required />
                                        </div>

                                        <Button type="submit" size="lg" className="w-full md:w-auto h-14 px-12 rounded-xl text-lg font-bold shadow-xl shadow-primary/25 hover:scale-[1.02] transition-transform">
                                            Send Message <Send className="ml-2 h-5 w-5" />
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="h-[400px] bg-muted relative grayscale hover:grayscale-0 transition-all duration-700">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center group cursor-pointer">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform mx-auto mb-4">
                            <MapPin className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold">Find us in the heart of Smart City</h3>
                        <p className="text-muted-foreground">123 University Avenue, Tech District</p>
                        <Button variant="link" className="mt-2 text-primary">Open in Google Maps</Button>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Contact;
