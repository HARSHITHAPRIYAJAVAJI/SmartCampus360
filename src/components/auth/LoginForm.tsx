import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Eye, EyeOff, Loader2, Mail, Lock, User, Smartphone, Shield, Key, Copy, ClipboardPaste, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Import illustration
import graduationImage from "@/assets/graduation.jpg";
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { MOCK_FACULTY } from "@/data/mockFaculty";

interface LoginFormProps {
  onLogin: (userData: { id: string; role: string; name: string }) => void;
  defaultRole?: 'student' | 'faculty' | 'admin';
  title?: string;
  description?: string;
  disableRoleSelection?: boolean;
}

export function LoginForm({
  onLogin,
  defaultRole = 'student',
  title = "Welcome Back",
  description = "Sign in to continue to Smart Campus",
  disableRoleSelection = false
}: LoginFormProps) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<'student' | 'faculty' | 'admin'>(defaultRole);

  // Format ID as user types (e.g., 22K91A6664)
  const formatId = (input: string) => {
    // Remove all non-alphanumeric characters and convert to uppercase
    const value = input.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    // Format as 2 digits, 1 letter, 2 digits, 1 letter, 4 digits (22K91A6664)
    if (value.length <= 2) return value;
    if (value.length <= 5) return `${value.slice(0, 2)}${value[2].toUpperCase()}${value.slice(3, 5)}`;
    if (value.length <= 6) return `${value.slice(0, 2)}${value[2].toUpperCase()}${value.slice(3, 5)}${value[5].toUpperCase()}`;
    return `${value.slice(0, 2)}${value[2].toUpperCase()}${value.slice(3, 5)}${value[5].toUpperCase()}${value.slice(6, 10)}`;
  };

  // Validate ID format (22K91A6664)
  const isValidId = (id: string) => {
    return /^\d{2}[A-Z]\d{2}[A-Z]\d{4}$/.test(id);
  };
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [idCopied, setIdCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyId = () => {
    if (id) {
      navigator.clipboard.writeText(id);
      setIdCopied(true);
      setTimeout(() => setIdCopied(false), 2000);
    }
  };

  const handlePasteToPassword = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setPassword(text);
    } catch {
      // Fallback: paste ID directly if clipboard access is denied
      if (id) setPassword(id);
    }
  };

  useEffect(() => {
    setRole(defaultRole);
  }, [defaultRole]);

  useEffect(() => {
    setIsMounted(true);
    // Check for saved credentials if "Remember me" was checked
    const savedId = localStorage.getItem('savedId');
    const savedRole = localStorage.getItem('savedRole') as 'student' | 'faculty' | 'admin' | null;
    if (savedId && savedRole && ['student', 'faculty', 'admin'].includes(savedRole)) {
      setId(savedId);
      if (!disableRoleSelection || savedRole === defaultRole) {
        setRole(savedRole);
      }
      setRememberMe(true);
    }
  }, [disableRoleSelection, defaultRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!id || !role) {
      toast({
        title: "Missing Information",
        description: "Please enter your ID and select your role.",
        variant: "destructive",
      });
      return;
    }

    // ID validation
    const cleanId = id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (cleanId.length === 0) {
      toast({
        title: "ID Required",
        description: "Please enter your student or staff ID.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidId(cleanId)) {
      toast({
        title: "Invalid ID Format",
        description: "ID must be in the format 22K91A6664 (2 digits, 1 letter, 2 digits, 1 letter, 4 digits).",
        variant: "destructive",
      });
      return;
    }

    // Use ID as password if password is not provided
    const loginPassword = password || id;

    setIsLoading(true);

    // Save credentials if "Remember me" is checked
    if (rememberMe) {
      localStorage.setItem('savedId', id);
      localStorage.setItem('savedRole', role);
    } else {
      localStorage.removeItem('savedId');
      localStorage.removeItem('savedRole');
    }

    // Simulate API call with better error handling
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      let userName = "User";

      if (role === 'student') {
        const student = MOCK_STUDENTS.find(s => s.rollNumber.toUpperCase() === cleanId);
        if (!student) {
          throw new Error('Student record not found. Please check your Roll Number.');
        }
        userName = student.name;
      } else if (role === 'faculty') {
        const faculty = MOCK_FACULTY.find(f => f.rollNumber.toUpperCase() === cleanId);
        if (!faculty) {
          throw new Error('Faculty record not found. Please check your Staff ID.');
        }
        userName = faculty.name;
      } else if (role === 'admin') {
        userName = "Administrator";
      }

      // Simulate credential check (ID must match password for demo)
      if (loginPassword !== id) {
        throw new Error('Invalid password. For demo purposes, please use your ID as password.');
      }

      onLogin({
        id,
        role,
        name: userName
      });

      toast({
        title: `Welcome back, ${userName}!`,
        description: `Successfully logged in to your ${role} dashboard.`,
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 bg-background relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] bg-card/30 backdrop-blur-2xl border border-white/20 dark:border-white/10 relative z-10"
      >
        {/* Left side - Dynamic Illustration */}
        <div className="hidden lg:flex flex-col justify-center p-16 bg-gradient-to-br from-primary via-primary/90 to-primary-dark text-white relative overflow-hidden">
          {/* Floating Icons Decor */}
          <motion.div 
            animate={{ y: [0, -15, 0] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-20 opacity-20 pointer-events-none"
          >
            <GraduationCap className="w-32 h-32" />
          </motion.div>
          <motion.div 
            animate={{ y: [0, 10, 0], x: [0, 10, 0] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 left-20 opacity-10 pointer-events-none"
          >
            <Shield className="w-24 h-24" />
          </motion.div>

          <div className="relative z-10 text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tight leading-[1.1]">
                SmartCampus<span className="text-white/70">360</span>
              </h2>
              <p className="text-xl text-white/80 font-medium max-w-sm">
                Empowering academic excellence through localized automation and AI.
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">One Campus Sync</h4>
                    <p className="text-white/60 text-sm">Timetable, Grades, Fees</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-2xl font-black">9.8k</div>
                    <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Active Students</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-2xl font-black">450+</div>
                    <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Faculty Members</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none mix-blend-overlay" />
        </div>

        {/* Right side - Login Form */}
        <div className="p-10 md:p-16 flex flex-col justify-center bg-card/50 backdrop-blur-xl">
          <div className="w-full max-w-sm mx-auto">
            <CardHeader className="text-center p-0 space-y-4 mb-10">
              <div className="mx-auto w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-2 rotate-3 hover:rotate-0 transition-transform duration-300">
                <GraduationCap className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-4xl font-black tracking-tighter text-foreground">
                  {title}
                </CardTitle>
                <CardDescription className="text-muted-foreground font-medium">
                  {description}
                </CardDescription>
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <CardContent className="p-0 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="id" className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Key className="h-3 w-3" />
                    {role === 'student' ? 'Student ID' : role === 'faculty' ? 'Staff ID' : 'Admin ID'}
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      id="id"
                      type="text"
                      placeholder={role === 'faculty' ? '22F91F6604' : '22K91A6664'}
                      value={id}
                      onChange={(e) => setId(formatId(e.target.value))}
                      maxLength={10}
                      className="h-12 pl-12 pr-12 font-mono tracking-widest bg-muted/30 border-muted/50 focus:border-primary/50 focus:bg-background transition-all rounded-xl"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-10 w-10 p-0 rounded-lg hover:bg-primary/5 text-muted-foreground"
                      onClick={handleCopyId}
                      tabIndex={-1}
                    >
                      {idCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Lock className="h-3 w-3" />
                      Security Code
                    </Label>
                    <Link to="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline" tabIndex={-1}>
                      Forgotten?
                    </Link>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Shield className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-12 pr-20 bg-muted/30 border-muted/50 focus:border-primary/50 focus:bg-background transition-all rounded-xl"
                      disabled={isLoading}
                    />
                    <div className="absolute right-1 top-1 h-10 flex items-center gap-0.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-full px-2 rounded-lg hover:bg-primary/5 text-muted-foreground"
                        onClick={handlePasteToPassword}
                        tabIndex={-1}
                      >
                        <ClipboardPaste className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-full px-2 rounded-lg hover:bg-primary/5 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {!disableRoleSelection && (
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <User className="h-3 w-3" />
                      Portal access
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['student', 'faculty', 'admin'] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-[10px] font-black uppercase tracking-tighter transition-all ${
                            role === r 
                              ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                              : 'bg-muted/30 border-muted/50 text-muted-foreground hover:bg-muted/50'
                          }`}
                        >
                          {r === 'student' && <GraduationCap className="h-4 w-4 mb-2" />}
                          {r === 'faculty' && <User className="h-4 w-4 mb-2" />}
                          {r === 'admin' && <Shield className="h-4 w-4 mb-2" />}
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      disabled={isLoading}
                    />
                    <Label htmlFor="remember" className="text-xs font-bold text-muted-foreground cursor-pointer">
                      Stay connected
                    </Label>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-0 flex flex-col space-y-6 pt-4">
                <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 shadow-lg shadow-primary/20 text-lg font-bold tracking-tight active:scale-95 transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : 'Sign In'}
                </Button>

                <div className="text-center text-xs font-bold text-muted-foreground/60">
                  New to SmartCampus?{" "}
                  <Link to="/signup" className="text-primary hover:underline tracking-tight">Register portal access</Link>
                </div>
              </CardFooter>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Footer Info */}
      <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
          SmartCampus360 Institutional Gateway • v1.4.0
        </p>
      </div>
    </div>

  );
}