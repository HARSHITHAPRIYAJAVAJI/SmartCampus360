import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, RefreshCcw, Search, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            <div className="container max-w-4xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Side: 404 Visualization */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left"
                    >
                        <div className="relative inline-block">
                            <span className="text-[12rem] md:text-[18rem] font-black text-white/5 leading-none select-none">404</span>
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 flex items-center justify-center pt-8"
                            >
                                <GraduationCap className="h-32 w-32 md:h-48 md:w-48 text-primary opacity-50 drop-shadow-[0_0_30px_rgba(var(--primary),0.5)]" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right Side: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4 text-center lg:text-left">
                            <Badge className="bg-primary/20 text-primary-light border-primary/30 px-4 py-1.5 uppercase tracking-widest text-[10px] font-black">
                                Coordinates Lost
                            </Badge>
                            <h1 className="text-5xl md:text-7xl font-black text-white leading-none uppercase tracking-tighter">
                                WAY OFF <br /> <span className="text-primary italic">CAMPUS.</span>
                            </h1>
                            <p className="text-xl text-slate-400 font-medium leading-relaxed italic">
                                "The page you are looking for has been moved, removed, or perhaps never existed in this dimension."
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/">
                                <Button size="lg" className="h-16 px-8 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold group w-full sm:w-auto">
                                    <Home className="mr-2 h-5 w-5 group-hover:-translate-y-1 transition-transform" /> Back to Base
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => window.location.reload()}
                                className="h-16 px-8 rounded-2xl border-white/20 text-white bg-white/5 backdrop-blur-md hover:bg-white/10 font-bold w-full sm:w-auto"
                            >
                                <RefreshCcw className="mr-2 h-5 w-5" /> Retry Request
                            </Button>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex flex-col items-center lg:items-start gap-4">
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Need Guidance?</span>
                            <div className="flex gap-4">
                                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors text-sm font-bold border-b border-transparent hover:border-primary">Contact Registrar</Link>
                                <span className="text-slate-700">|</span>
                                <Link to="/about/vision" className="text-slate-400 hover:text-white transition-colors text-sm font-bold border-b border-transparent hover:border-primary">Campus Vision</Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="absolute bottom-10 left-10 hidden md:block">
                <div className="flex items-center gap-3 opacity-20">
                    <GraduationCap className="h-6 w-6 text-white" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Smart Campus University — Error Code: 0x404</span>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
