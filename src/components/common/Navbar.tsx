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
              <NavigationMenuTrigger>About</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        to="/"
                      >
                        <GraduationCap className="h-6 w-6" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Smart Campus
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Empowering students with knowledge and innovation since 1990.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
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
          <Link to="/admissions/apply">
            <Button className="rounded-full px-6 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">
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
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
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
