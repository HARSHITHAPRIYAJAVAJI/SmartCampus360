import { Link } from "react-router-dom";
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
            {/* Abstract Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
                    {/* Brand & Newsletter */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                                    <GraduationCap className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <span className="text-3xl font-black tracking-tighter uppercase">Smart <span className="text-primary italic">Campus</span></span>
                                </div>
                            </div>
                            <p className="text-slate-400 text-lg leading-relaxed font-medium">
                                Architecting the future of global leadership through radical innovation and academic rigor.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">Join the Insight</h4>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter your email"
                                    className="h-14 bg-white/5 border-white/10 rounded-xl focus-visible:ring-primary text-white"
                                />
                                <Button size="icon" className="h-14 w-14 rounded-xl bg-primary hover:bg-primary-dark shrink-0">
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-2 space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Academy</h3>
                        <ul className="space-y-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                            <li><Link to="/about/vision" className="hover:text-white transition-colors">Vision & Mission</Link></li>
                            <li><Link to="/academics/programs" className="hover:text-white transition-colors">Academic Degrees</Link></li>
                            <li><Link to="/academics/departments" className="hover:text-white transition-colors">Departments</Link></li>
                            <li><Link to="/academics/library" className="hover:text-white transition-colors">Digital Archive</Link></li>
                            <li><Link to="/about/leadership" className="hover:text-white transition-colors">Leadership</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Student Life</h3>
                        <ul className="space-y-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                            <li><Link to="/admissions/apply" className="hover:text-white transition-colors">Apply Online</Link></li>
                            <li><Link to="/about/campus-life" className="hover:text-white transition-colors">Campus Culture</Link></li>
                            <li><Link to="/placements" className="hover:text-white transition-colors">Placement Lab</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Support Desk</Link></li>
                            <li><Link to="/events" className="hover:text-white transition-colors">Events</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-4 space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">HQ Presence</h3>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <span className="text-slate-400 font-medium pt-1">123 University Avenue, Tech District, <br /> Smart City Academic Quarter, SC 12345</span>
                            </li>
                            <li className="flex gap-4">
                                <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <span className="text-slate-400 font-medium pt-3">+1 (555) 000-0000</span>
                            </li>
                        </ul>

                        <div className="flex gap-3">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="h-12 w-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-primary transition-all group">
                                    <Icon className="h-5 w-5 text-slate-400 group-hover:text-white" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <Zap className="h-4 w-4 text-primary" />
                        <span>© 2025 Smart Campus Global University. Built for the Future.</span>
                    </div>
                    <div className="flex space-x-8">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Paradigm</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Engagement</Link>
                        <Link to="/sitemap" className="hover:text-white transition-colors">Structure</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
