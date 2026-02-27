import React, { useState } from "react";
import Layout from "@/components/common/Layout";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    CheckCircle2,
    Upload,
    GraduationCap,
    FileText,
    CreditCard,
    ShieldCheck,
    Zap,
    Star,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Admissions = () => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: "Dossier Received",
                description: "Your application has been logged into our secure academic mainframe.",
            });
        }, 2000);
    };

    const steps = [
        { icon: FileText, title: "Synthesis", desc: "Select your desired discipline and submit personal credentials." },
        { icon: Upload, title: "Validation", desc: "Upload verifiable academic transcripts and identification." },
        { icon: CreditCard, title: "Finalization", desc: "Process the administrative integration fee to secure your slot." }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="relative h-[70vh] flex items-center bg-slate-950 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070')] bg-cover bg-center opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />

                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl"
                        >
                            <Badge className="mb-6 bg-primary text-white border-none px-6 py-2 text-sm font-black tracking-[0.2em] uppercase">
                                Admissions Open 2025
                            </Badge>
                            <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.8] tracking-tighter uppercase whitespace-pre-line mb-10">
                                ARCHITECT YOUR <br /> <span className="text-primary italic">LEGACY.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl leading-relaxed italic">
                                "The path to global leadership begins here. We provide the blueprints; you provide the brilliance."
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Main Content */}
                <section className="py-24 relative z-10 -mt-20">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-12 gap-16">
                            {/* Left: Process Roadmap */}
                            <div className="lg:col-span-4 space-y-12 order-2 lg:order-1">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-black uppercase text-slate-950 tracking-tight">The Integration <br /> <span className="text-primary italic">Protocol.</span></h2>
                                    <p className="text-slate-500 font-medium leading-relaxed italic">"Follow the steps below to initialize your academic synthesis."</p>
                                </div>

                                <div className="space-y-8 relative">
                                    <div className="absolute left-6 top-4 bottom-4 w-px bg-slate-100 hidden md:block" />
                                    {steps.map((step, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex gap-8 relative"
                                        >
                                            <div className="h-14 w-14 shrink-0 bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-xl z-10">
                                                <step.icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black text-slate-900 uppercase leading-none mb-2">{step.title}</h4>
                                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <Card className="rounded-[3rem] bg-primary text-white p-10 overflow-hidden relative shadow-2xl shadow-primary/20">
                                    <Sparkles className="absolute -top-10 -right-10 h-32 w-32 opacity-20 rotate-12" />
                                    <div className="relative z-10 space-y-6">
                                        <h3 className="text-xl font-black uppercase tracking-tight">Concierge Support</h3>
                                        <p className="text-sm text-white/80 leading-relaxed font-medium italic">"Need assistance with the protocol? Our admissions experts are on standby."</p>
                                        <Button className="w-full h-14 bg-white text-slate-950 font-black rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest text-[10px]">
                                            Connect Now
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* Right: Application Interface */}
                            <div className="lg:col-span-8 order-1 lg:order-2">
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <Card className="border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] rounded-[4rem] overflow-hidden bg-white">
                                        <CardContent className="p-12 md:p-20">
                                            <Tabs defaultValue="undergrad" className="space-y-12">
                                                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                                                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">APPLICATION <br /> <span className="text-primary italic">DOSSIER.</span></h2>
                                                    <TabsList className="bg-slate-100 h-14 p-1 rounded-2xl border-none">
                                                        <TabsTrigger value="undergrad" className="rounded-xl px-10 font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Undergraduate</TabsTrigger>
                                                        <TabsTrigger value="postgrad" className="rounded-xl px-10 font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Postgraduate</TabsTrigger>
                                                    </TabsList>
                                                </div>

                                                <TabsContent value="undergrad" className="mt-0 space-y-10 animate-in fade-in zoom-in-95 duration-500">
                                                    <form onSubmit={handleApply} className="space-y-10">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                            <div className="space-y-3">
                                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Biological Name</label>
                                                                <Input placeholder="ENTRE FULL NAME" className="h-16 rounded-2xl bg-white border-slate-200 focus-visible:ring-primary focus-visible:border-primary font-bold px-6" required />
                                                            </div>
                                                            <div className="space-y-3">
                                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Electronic Address</label>
                                                                <Input type="email" placeholder="EMAIL@EXAMPLE.COM" className="h-16 rounded-2xl bg-white border-slate-200 focus-visible:ring-primary focus-visible:border-primary font-bold px-6" required />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                            <div className="space-y-3">
                                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Target Discipline</label>
                                                                <select className="flex h-16 w-full rounded-2xl border border-slate-200 bg-white px-6 py-2 text-sm font-bold focus:ring-2 focus:ring-primary outline-none">
                                                                    <option>Select Tier</option>
                                                                    <option>B.Tech Computer Science</option>
                                                                    <option>B.Tech AI & ML</option>
                                                                    <option>B.Tech Electronics</option>
                                                                </select>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Last Synthesis Score (%)</label>
                                                                <Input type="number" placeholder="00.00" className="h-16 rounded-2xl bg-white border-slate-200 focus-visible:ring-primary focus-visible:border-primary font-bold px-6" required />
                                                            </div>
                                                        </div>

                                                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 border-dashed space-y-4">
                                                            <div className="flex items-center gap-4 text-slate-900 font-bold uppercase tracking-tight">
                                                                <ShieldCheck className="h-5 w-5 text-primary" /> Data Security Protocol
                                                            </div>
                                                            <p className="text-xs text-slate-500 italic">"By submitting this dossier, you agree to our terms of academic evaluation. All documents will be verified through international databases."</p>
                                                        </div>

                                                        <Button type="submit" disabled={isSubmitting} className="h-20 w-full rounded-2xl bg-slate-950 text-white hover:bg-slate-800 text-2xl font-black shadow-2xl transition-all hover:-translate-y-1">
                                                            {isSubmitting ? "TRANSMITTING..." : "INITIALIZE ADMISSION"}
                                                        </Button>
                                                    </form>
                                                </TabsContent>

                                                <TabsContent value="postgrad" className="mt-0 space-y-10">
                                                    <div className="h-64 flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[3rem] text-center p-12 space-y-4">
                                                        <Star className="h-12 w-12 text-primary/20 animate-pulse" />
                                                        <h4 className="text-2xl font-black uppercase text-slate-300">Advanced Dossiers Coming Soon</h4>
                                                        <p className="text-sm text-slate-400 font-medium">Postgraduate intake starts Q3 2025.</p>
                                                    </div>
                                                </TabsContent>
                                            </Tabs>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Admissions;
