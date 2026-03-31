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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
      {/* Top Bar - Standardized wider width */}
      <div className={cn(
        "max-w-screen-2xl mx-auto px-4 md:px-8 w-full flex justify-between items-center text-[11px] font-medium transition-all duration-300 overflow-hidden",
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
            <span className="text-xs text-muted-foreground mr-2 hidden md:block">Support: +1 (555) 123-4567</span>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 w-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3.5 shrink-0 group transition-all duration-300" aria-label="Smart Campus University Home">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/20 group-hover:scale-105 transition-all duration-300">
            <GraduationCap className="h-6 w-6 md:h-7 md:w-7 text-white" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 leading-none mb-1">
              Smart<span className="text-primary">Campus</span>
            </span>
            <div className="flex items-center gap-2">
              <div className="h-[1px] w-3 bg-primary/40" />
              <span className="text-[9px] md:text-[10px] font-medium text-slate-500 tracking-[0.4em] uppercase leading-none">
                Autonomous
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex mx-2">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className={navigationMenuTriggerStyle()}>
                Home
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>About</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem href="/about/vision" title="Vision & Mission">
                    Our core values and future goals.
                  </ListItem>
                  <ListItem href="/about/leadership" title="Leadership">
                    Meet the administration and deans.
                  </ListItem>
                  <ListItem href="/about/campus-life" title="Campus Life">
                    Explore our vibrant campus culture.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Academics</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  <ListItem href="/academics/programs" title="Programs">
                    Undergraduate and Postgraduate courses.
                  </ListItem>
                  <ListItem href="/academics/departments" title="Departments">
                    Faculty and research centers.
                  </ListItem>
                  <ListItem href="/academics/calendar" title="Academic Calendar">
                    Important dates and schedules.
                  </ListItem>
                  <ListItem href="/academics/library" title="Library">
                    Digital and physical resources.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Student Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[600px] md:grid-cols-2 lg:w-[800px] lg:grid-cols-3">
                  <ListItem href="/dashboard/profile" title="My Profile">
                    View and update your personal student profile.
                  </ListItem>
                  <ListItem href="/services/exam-time-tables" title="Exam Time Tables">
                    Check your semester exam schedules.
                  </ListItem>
                  <ListItem href="/services/fee-payments" title="Online Fee Payments">
                    Securely pay academic fees online.
                  </ListItem>
                  <ListItem href="/services/script-uploading" title="Script Uploading">
                    Upload answer scripts and assignments.
                  </ListItem>
                  <ListItem href="/services/marks-details" title="Marks Details">
                    View comprehensive grade reports.
                  </ListItem>
                  <ListItem href="/services/downloads" title="Downloads">
                    Resource materials and forms.
                  </ListItem>
                  <ListItem href="/services/suggestions" title="Suggestions">
                    Submit feedback to administration.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/admissions" className={navigationMenuTriggerStyle()}>
                Admissions
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/placements" className={navigationMenuTriggerStyle()}>
                Placements
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/contact" className={navigationMenuTriggerStyle()}>
                Contact
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="rounded-full" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full flex items-center gap-2">
                <User className="h-4 w-4" />
                Login
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white shadow-xl rounded-xl border-border/50">
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/5 hover:bg-primary/5 py-3 transition-colors">
                <Link to="/login/student" className="flex items-center w-full group/item">
                  <User className="mr-3 h-4 w-4 text-primary group-hover/item:text-primary transition-colors" />
                  <span className="font-normal text-slate-700">Student Login</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/5 hover:bg-primary/5 py-3 transition-colors">
                <Link to="/login/staff" className="flex items-center w-full group/item">
                  <Users className="mr-3 h-4 w-4 text-primary group-hover/item:text-primary transition-colors" />
                  <span className="font-normal text-slate-700">Faculty Login</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/5 hover:bg-primary/5 py-3 transition-colors">
                <Link to="/login/admin" className="flex items-center w-full group/item">
                  <Shield className="mr-3 h-4 w-4 text-primary group-hover/item:text-primary transition-colors" />
                  <span className="font-normal text-slate-700">Admin Login</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/admissions/apply">
            <Button className="rounded-full px-6 bg-gradient-to-r from-red-600 to-red-800 hover:shadow-lg hover:shadow-red-600/25 transition-all duration-300">
              Apply Now
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="hidden">
                <SheetTitle>Mobile Menu</SheetTitle>
                <SheetDescription>Navigation links for mobile devices</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col space-y-6 mt-6">
                <Link to="/" className="text-lg font-medium">Home</Link>
                <Link to="/about/vision" className="text-lg font-medium">About</Link>
                <Link to="/academics/programs" className="text-lg font-medium">Academics</Link>
                
                {/* Mobile Student Services Dropdown alternative */}
                <div className="flex flex-col space-y-3 pl-4 border-l-2 border-primary/20">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Student Services</span>
                  <Link to="/dashboard/profile" className="text-base font-medium">My Profile</Link>
                  <Link to="/services/exam-time-tables" className="text-base font-medium">Exam Time Tables</Link>
                  <Link to="/services/fee-payments" className="text-base font-medium">Online Fee Payments</Link>
                  <Link to="/services/script-uploading" className="text-base font-medium">Script Uploading</Link>
                  <Link to="/services/marks-details" className="text-base font-medium">Marks Details</Link>
                  <Link to="/services/downloads" className="text-base font-medium">Downloads</Link>
                  <Link to="/services/suggestions" className="text-base font-medium">Suggestions</Link>
                </div>

                <Link to="/admissions/apply" className="text-lg font-medium">Admissions</Link>
                <Link to="/placements" className="text-lg font-medium">Placements</Link>
                <Link to="/contact" className="text-lg font-medium">Contact</Link>
                <div className="h-px bg-border my-4" />
                <Link to="/login/student">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" /> Student Login
                  </Button>
                </Link>
                <Link to="/login/staff">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" /> Staff Login
                  </Button>
                </Link>
                <Link to="/login/admin">
                  <Button variant="outline" className="w-full justify-start">
                    <UserCog className="mr-2 h-4 w-4" /> Admin Login
                  </Button>
                </Link>
                <Link to="/admissions/apply">
                  <Button className="w-full mt-2">Apply Now</Button>
                </Link>
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
            "group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default Navbar;
