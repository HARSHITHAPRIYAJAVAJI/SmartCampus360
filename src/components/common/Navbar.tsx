import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Menu, X, Phone, ChevronDown,
  Facebook, Twitter, Youtube, Instagram, Linkedin,
  User, Users, UserCog, Search, Globe, BookOpen,
  Briefcase, Calendar, Shield, Award
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white/80 backdrop-blur-md shadow-md py-2" : "bg-white py-4"
    )}>
      {/* Top Bar - Hidden on scroll to save space, or keep it small */}
      <div className={cn(
        "container mx-auto px-4 flex justify-between items-center text-sm transition-all duration-300 overflow-hidden",
        isScrolled ? "h-0 opacity-0" : "h-10 opacity-100 border-b mb-2"
      )}>
        <div className="flex items-center space-x-6">

          <div className="hidden md:flex space-x-4 text-muted-foreground">
            <Link to="/nirf" className="hover:text-primary transition-colors">NIRF</Link>
            <Link to="/iqac" className="hover:text-primary transition-colors">IQAC</Link>
            <Link to="/alumni" className="hover:text-primary transition-colors">Alumni</Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-3">
            <a href="#" className="text-muted-foreground hover:text-primary" aria-label="YouTube"><Youtube className="h-4 w-4" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login/student" className="text-xs font-medium hover:text-primary">Student Login</Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/login/staff" className="text-xs font-medium hover:text-primary">Staff Login</Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/login/admin" className="text-xs font-medium hover:text-primary">Admin Login</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group" aria-label="Smart Campus University Home">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold font-heading leading-tight tracking-tight">Smart Campus</span>
            <span className="text-[10px] font-semibold text-primary tracking-widest uppercase">Autonomous</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex mx-6">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className={navigationMenuTriggerStyle()}>
                Home
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent hover:bg-slate-100 data-[state=open]:bg-slate-100 data-[active]:bg-slate-100 font-bold uppercase tracking-widest text-[11px]">About</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[600px] lg:grid-cols-[.85fr_1fr] bg-white rounded-[2rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-[1.5rem] bg-slate-950 p-8 no-underline outline-none focus:shadow-md group relative overflow-hidden"
                        to="/"
                      >
                        <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
                          <GraduationCap className="h-32 w-32 rotate-12" />
                        </div>
                        <div className="relative z-10">
                          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                            <GraduationCap className="h-7 w-7 text-white" />
                          </div>
                          <div className="mb-2 text-2xl font-black text-white uppercase tracking-tighter">
                            Smart <span className="text-primary italic">Campus.</span>
                          </div>
                          <p className="text-sm leading-relaxed text-slate-400 font-medium italic">
                            "Architecting global excellence through radical innovation since 1990."
                          </p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <div className="space-y-1 py-1">
                    <Badge className="ml-3 mb-2 bg-primary/10 text-primary border-none text-[8px] font-black tracking-[0.2em] uppercase">The Institution</Badge>
                    <ListItem href="/about/vision" title="Vision & Mission">
                      Our philosophical blueprint and future goals.
                    </ListItem>
                    <ListItem href="/about/leadership" title="Leadership">
                      Meet the architects of our academic vision.
                    </ListItem>
                    <ListItem href="/about/campus-life" title="Campus Life">
                      Explore our vibrant, global micro-city.
                    </ListItem>
                  </div>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent hover:bg-slate-100 data-[state=open]:bg-slate-100 data-[active]:bg-slate-100 font-bold uppercase tracking-widest text-[11px]">Academics</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-6 md:w-[500px] md:grid-cols-2 lg:w-[800px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
                  <div className="md:col-span-2 flex items-center gap-4 mb-2">
                    <Badge className="bg-slate-950 text-white border-none text-[8px] font-black tracking-[0.2em] uppercase px-3 py-1">Curriculum Framework</Badge>
                    <div className="h-px flex-grow bg-slate-100" />
                  </div>
                  <ListItem href="/academics/programs" title="Programs">
                    Undergraduate and PG degree roadmaps.
                  </ListItem>
                  <ListItem href="/academics/departments" title="Departments">
                    Specialized research and faculty centers.
                  </ListItem>
                  <ListItem href="/academics/calendar" title="Academic Calendar">
                    Important milestones and session schedules.
                  </ListItem>
                  <ListItem href="/academics/library" title="Digital Archive">
                    Global knowledge hub and physical resources.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/admissions" className={cn(navigationMenuTriggerStyle(), "bg-transparent font-bold uppercase tracking-widest text-[11px]")}>
                Admissions
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/placements" className={cn(navigationMenuTriggerStyle(), "bg-transparent font-bold uppercase tracking-widest text-[11px]")}>
                Placements
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/contact" className={cn(navigationMenuTriggerStyle(), "bg-transparent font-bold uppercase tracking-widest text-[11px]")}>
                Contact
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="rounded-2xl h-11 w-11 hover:bg-slate-100" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <Link to="/admissions/apply">
            <Button className="rounded-2xl h-11 px-8 bg-slate-950 text-white hover:bg-primary hover:shadow-[0_10px_20px_-5px_rgba(var(--primary),0.4)] transition-all duration-300 font-bold uppercase tracking-widest text-[10px]">
              Apply Online
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[350px] rounded-l-[3rem] border-none shadow-2xl">
              <SheetHeader className="hidden">
                <SheetTitle>Mobile Menu</SheetTitle>
                <SheetDescription>Navigation links for mobile devices</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col space-y-6 mt-12 bg-white h-full relative z-10">
                <div className="flex items-center space-x-3 mb-8 px-4">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-black uppercase tracking-tighter">Smart <span className="text-primary italic">Campus.</span></span>
                </div>

                <div className="space-y-4 px-4 font-bold uppercase tracking-widest text-[11px] text-slate-500">
                  <Link to="/" className="block hover:text-primary transition-colors py-2 border-b border-slate-50">Home</Link>
                  <Link to="/about/vision" className="block hover:text-primary transition-colors py-2 border-b border-slate-50">Vision & Mission</Link>
                  <Link to="/academics/programs" className="block hover:text-primary transition-colors py-2 border-b border-slate-50">Degree Programs</Link>
                  <Link to="/admissions/apply" className="block hover:text-primary transition-colors py-2 border-b border-slate-50">Apply Now</Link>
                  <Link to="/placements" className="block hover:text-primary transition-colors py-2 border-b border-slate-50">Placements</Link>
                  <Link to="/contact" className="block hover:text-primary transition-colors py-2 border-b border-slate-50">Contact Us</Link>
                </div>

                <div className="fixed bottom-12 left-8 right-8 space-y-4">
                  <Link to="/login/student">
                    <Button variant="outline" className="w-full h-14 rounded-2xl justify-start px-6 font-bold uppercase tracking-widest text-[10px]">
                      <User className="mr-3 h-4 w-4 text-primary" /> Student Core
                    </Button>
                  </Link>
                  <Link to="/login/admin">
                    <Button className="w-full h-14 rounded-2xl bg-slate-950 text-white font-bold uppercase tracking-widest text-[10px]">
                      Admin Access
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={props.href || "#"}
          ref={ref as any}
          className={cn(
            "block select-none space-y-1.5 rounded-2xl p-4 leading-none no-underline outline-none transition-all hover:bg-primary hover:text-white group",
            className
          )}
          {...props}
        >
          <div className="text-sm font-black uppercase tracking-tight leading-none text-slate-900 group-hover:text-white transition-colors">{title}</div>
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-400 group-hover:text-white/80 transition-colors font-medium italic">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default Navbar;
