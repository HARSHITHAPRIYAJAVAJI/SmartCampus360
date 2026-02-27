import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap, Users, Calendar, FileText, Award, Shield,
  BookOpen, MapPin, ArrowRight, Globe, Briefcase, Heart,
  Sparkles, Zap, Trophy, Video, Quote
} from "lucide-react";
import Layout from "@/components/common/Layout";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Import images
import libraryImage from "@/assets/library.jpg";
import graduationImage from "@/assets/graduation.jpg";
import laboratoryImage from "@/assets/labs.jpg";
import sportsImage from "@/assets/sports.jpg";
import dormitoryImage from "@/assets/housing.jpg";
const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src="/clg.jpeg"
            alt="Smart Campus University"
            className="w-full h-full object-cover"
            // @ts-expect-error - fetchpriority is valid in React 18.3+ but types might be lagging
            fetchpriority="high"
            loading="eager"
            width="1920"
            height="1080"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>


        <div className="relative z-10 container mx-auto px-4 text-center text-white space-y-8 animate-in fade-in zoom-in duration-1000">

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight drop-shadow-2xl">
            Smart Campus <br />
            <span className="text-primary">University</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed font-light">
            Where innovation meets tradition. precise academic excellence with our world-class education and cutting-edge technology platform.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <Link to="/admissions/apply">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-lg px-8 h-14 rounded-full shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
                Apply for Admission
              </Button>
            </Link>
            <Link to="/placements">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-transform">
                View Placements
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="container mx-auto px-4 relative z-20 -mt-16 hidden md:block">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              { number: "15k+", label: "Students", icon: Users },
              { number: "500+", label: "Faculty", icon: GraduationCap },
              { number: "95%", label: "Employment", icon: Briefcase },
              { number: "50+", label: "Programs", icon: BookOpen },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-xl flex items-center justify-between animate-in slide-in-from-bottom-5 duration-700 delay-300">
                <div>
                  <div className="text-3xl font-bold text-primary">{stat.number}</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-primary">
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacer was here, but now we use negative margin above so just a normal padding for next section is enough */}

      {/* Programs Section */}
      <section className="py-24 bg-secondary/30 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-2 text-primary font-semibold">
                <Sparkles className="h-5 w-5" />
                <span>Academic Excellence</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Featured Programs</h2>
              <p className="text-muted-foreground text-lg">
                Explore our diverse range of undergraduate and graduate programs designed to prepare you for global success.
              </p>
            </div>
            <Link to="/academics/programs">
              <Button variant="ghost" className="group">
                View All Programs <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Computer Science", duration: "4 Years", type: "Bachelor's", spots: "Available", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60" },
              { name: "Business Admin", duration: "3 Years", type: "Bachelor's", spots: "Filling Fast", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=60" },
              { name: "Data Science", duration: "2 Years", type: "Master's", spots: "Available", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60" }
            ].map((program, index) => (
              <Card key={index} className="group overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img src={program.image} alt={program.name} loading="lazy" width="500" height="300" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <Badge className="absolute top-4 right-4 z-20 bg-white/90 text-foreground hover:bg-white">{program.spots}</Badge>
                </div>
                <CardHeader className="relative -mt-12 z-20 px-6 pb-2">
                  <CardTitle className="text-white text-2xl">{program.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 px-6 pb-6">
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                    <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {program.duration}</span>
                    <span className="flex items-center"><GraduationCap className="h-4 w-4 mr-1" /> {program.type}</span>
                  </div>
                  <Button className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-white transition-colors">Learn More</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Digital Campus Platform</h2>
            <p className="text-xl text-muted-foreground">
              Experience a seamless educational journey with our integrated smart campus technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Calendar, title: "Smart Scheduling", desc: "AI-powered timetable management." },
              { icon: Shield, title: "Secure Access", desc: "Biometric and role-based security." },
              { icon: Award, title: "Skill Tracking", desc: "Monitor your progress in real-time." },
              { icon: Globe, title: "Global Connect", desc: "Connect with alumni worldwide." },
              { icon: Video, title: "Virtual Labs", desc: "Access laboratories remotely." },
              { icon: Trophy, title: "Gamified Learning", desc: "Earn badges and compete." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-muted/30 border border-border/50 hover:bg-card hover:shadow-lg transition-all duration-300 group"
              >
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-6">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Carousel */}
      <section className="py-24 bg-black text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Campus Life</h2>
              <p className="text-white/60">A glimpse into your future home</p>
            </div>
          </div>

          <Carousel className="w-full">
            <CarouselContent>
              {[
                { img: libraryImage, title: "Modern Library" },
                { img: laboratoryImage, title: "Advanced Labs" },
                { img: sportsImage, title: "Sports Complex" },
                { img: dormitoryImage, title: "Student Housing" },
                { img: "/clg.jpeg", title: "Our Campus" }
              ].map((item, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
                      <img src={item.img} alt={item.title} loading="lazy" width="800" height="600" className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <h3 className="text-xl font-bold">{item.title}</h3>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-white/10 border-white/20 hover:bg-white/20 text-white" />
            <CarouselNext className="right-4 bg-white/10 border-white/20 hover:bg-white/20 text-white" />
          </Carousel>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-xl text-muted-foreground">
              Hear from our global community of learners and achievers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "CS Senior",
                quote: "The smart campus features made my academic life so much easier. The AI-powered scheduling is a game changer.",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80"
              },
              {
                name: "Sarah Chen",
                role: "Data Science Lead",
                quote: "Accessing virtual labs from my dorm helped me finish my research project ahead of schedule. Incredible platform!",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80"
              },
              {
                name: "Marcus Thorne",
                role: "Alumni @ Google",
                quote: "The Global Connect feature helped me land my first internship. The network here is truly world-class.",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80"
              }
            ].map((testimonial, i) => (
              <Card key={i} className="bg-background border-none shadow-md hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-8">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full border-2 border-primary/10" />
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News & Events Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Latest Updates</h2>
              <p className="text-muted-foreground text-lg">
                Stay informed about the latest happenings and upcoming events at Smart Campus.
              </p>
            </div>
            <Button variant="outline" className="rounded-full">View All Updates</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Annual Tech Symposium 2025", date: "Oct 15", category: "Event", image: "https://images.unsplash.com/photo-1540575861501-7ad0582371f3?w=500&q=80" },
              { title: "New Research Lab Opening", date: "Sep 22", category: "News", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80" },
              { title: "Alumni Meetup: Silicon Valley", date: "Nov 02", category: "Meetup", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&q=80" },
              { title: "Scholarship Applications Open", date: "Aug 30", category: "Alert", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&q=80" }
            ].map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-lg transition-all">
                  <img src={item.image} alt={item.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                  <Badge className="absolute top-3 left-3 bg-white/90 text-primary hover:bg-white">{item.category}</Badge>
                </div>
                <div className="text-sm text-primary font-semibold mb-1">{item.date}</div>
                <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute -top-24 -right-24 h-96 w-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join a community of innovators and achievers. Applications are now open for the 2025 academic year.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/admissions/apply">
              <Button size="lg" className="h-12 px-8 text-lg shadow-xl shadow-primary/20">Apply Now</Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg bg-white hover:bg-gray-50">Schedule a Visit</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;