import { Link } from "react-router-dom";
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
    return (
        <footer className="bg-slate-50 text-slate-900 pt-16 pb-8 border-t border-slate-200">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold font-heading text-slate-900">Smart Campus</span>
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Empowering the next generation of leaders through innovation, excellence, and holistic education.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-slate-700">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-slate-700">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-slate-700">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-slate-700">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 font-heading">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li><Link to="/about/vision" className="hover:text-primary transition-colors">Vision & Mission</Link></li>
                            <li><Link to="/academics/programs" className="hover:text-primary transition-colors">Academic Programs</Link></li>
                            <li><Link to="/admissions/apply" className="hover:text-primary transition-colors">Admissions</Link></li>
                            <li><Link to="/about/campus-life" className="hover:text-primary transition-colors">Campus Life</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                        </ul>
                    </div>

                    {/* Departments */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 font-heading">Departments</h3>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li><Link to="/academics/departments" className="hover:text-primary transition-colors">All Departments</Link></li>
                            <li><Link to="/academics/library" className="hover:text-primary transition-colors">Digital Library</Link></li>
                            <li><Link to="/about/leadership" className="hover:text-primary transition-colors">Leadership</Link></li>
                            <li><Link to="/placements" className="hover:text-primary transition-colors">Placements</Link></li>
                            <li><Link to="/admissions" className="hover:text-primary transition-colors">Admission Process</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Support</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 font-heading">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-slate-600">
                            <li className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                <span>123 University Avenue, Education City, State 12345</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-primary" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-primary" />
                                <span>admissions@smartcampus.edu</span>
                            </li>
                        </ul>
                        <div className="mt-6">
                            <Button className="w-full bg-primary hover:bg-primary-dark">Get in Touch</Button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>© 2025 Smart Campus University. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                        <Link to="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
