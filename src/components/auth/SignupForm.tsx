import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Eye, EyeOff, User, Mail, Lock, UserPlus, Shield, Smartphone, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Import illustration
import signupIllustration from "@/assets/login-illustration.png";

interface SignupFormProps {
  onSignup: (userData: { id: string; role: string; name: string }) => void;
}

export function SignupForm({ onSignup }: SignupFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    idNumber: "",
    department: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to create your account.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "The passwords you entered do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSignup({
        id: formData.role === 'student' ? formData.idNumber : formData.email,
        role: formData.role,
        name: formData.name
      });
      toast({
        title: "Account Created Successfully!",
        description: `Welcome to SmartCampus360, ${formData.name}.`,
      });
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 py-12 bg-background relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] bg-card/30 backdrop-blur-2xl border border-white/20 dark:border-white/10 relative z-10"
      >
        {/* Left side - Illustration */}
        <div className="hidden lg:flex flex-col justify-center bg-primary relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={signupIllustration} 
              alt="Join SmartCampus360" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-primary/40 to-transparent" />
          </div>

          <div className="relative z-10 p-16 text-white space-y-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-6xl font-black tracking-tight leading-[1.1]">
                Join Us.
              </h2>
              <p className="text-xl text-white/90 font-medium max-w-sm">
                Unlock the full potential of your campus experience.
              </p>
              
              <div className="pt-8 space-y-4 text-white/70 font-medium">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <p>Real-time campus synchronization</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <p>Secure enterprise-grade access</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <p>Centralized academic management</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none mix-blend-overlay" />
        </div>

        {/* Right side - Signup Form */}
        <div className="p-10 md:p-12 flex flex-col justify-center bg-card/50 backdrop-blur-xl">
          <div className="w-full max-w-md mx-auto">
            <CardHeader className="text-center p-0 space-y-4 mb-8">
              <div className="mx-auto w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-2 -rotate-3 hover:rotate-0 transition-transform duration-300">
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-3xl font-black tracking-tighter text-foreground">
                  Create Account
                </CardTitle>
                <CardDescription className="text-muted-foreground font-medium">
                  Enter your details to join the SmartCampus360 platform
                </CardDescription>
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <CardContent className="p-0 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <User className="h-3 w-3" />
                      Full Name
                    </Label>
                    <Input
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="h-11 bg-muted/30 border-muted/50 focus:border-primary/50 focus:bg-background transition-all rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      Work Email
                    </Label>
                    <Input
                      type="email"
                      placeholder="jane@campus.edu"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="h-11 bg-muted/30 border-muted/50 focus:border-primary/50 focus:bg-background transition-all rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <GraduationCap className="h-3 w-3" />
                    Account Role
                  </Label>
                  <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                    <SelectTrigger className="h-11 bg-muted/30 border-muted/50 rounded-xl">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student Portal</SelectItem>
                      <SelectItem value="faculty">Faculty Portal</SelectItem>
                      <SelectItem value="admin">System Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <AnimatePresence mode="wait">
                  {formData.role === "student" && (
                    <motion.div
                      key="student-field"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Smartphone className="h-3 w-3" />
                        Roll Number / ID
                      </Label>
                      <Input
                        placeholder="22K91A6664"
                        value={formData.idNumber}
                        onChange={(e) => handleChange("idNumber", e.target.value)}
                        className="h-11 bg-muted/30 border-muted/50 focus:border-primary/50 focus:bg-background transition-all rounded-xl uppercase font-mono"
                      />
                    </motion.div>
                  )}

                  {(formData.role === "faculty" || formData.role === "admin") && (
                    <motion.div
                      key="dept-field"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Shield className="h-3 w-3" />
                        Department / Unit
                      </Label>
                      <Input
                        placeholder="Computer Science & Engineering"
                        value={formData.department}
                        onChange={(e) => handleChange("department", e.target.value)}
                        className="h-11 bg-muted/30 border-muted/50 focus:border-primary/50 focus:bg-background transition-all rounded-xl"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Lock className="h-3 w-3" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        className="h-11 pr-10 bg-muted/30 border-muted/50 focus:border-primary/50 focus:bg-background transition-all rounded-xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Lock className="h-3 w-3" />
                      Verify
                    </Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        className="h-11 pr-10 bg-muted/30 border-muted/50 focus:border-primary/50 focus:bg-background transition-all rounded-xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-0 flex flex-col space-y-6 pt-4">
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 shadow-lg shadow-primary/20 text-base font-bold tracking-tight active:scale-95 transition-all group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>

                <div className="text-center text-xs font-bold text-muted-foreground/60">
                  Already registered?{" "}
                  <Link to="/login" className="text-primary hover:underline tracking-tight">Access your account</Link>
                </div>
              </CardFooter>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}