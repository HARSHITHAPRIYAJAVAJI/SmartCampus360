import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Eye, EyeOff, Loader2, Mail, Lock, User, Smartphone, Shield, Key } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Import illustration
import graduationImage from "@/assets/graduation.jpg";

interface LoginFormProps {
  onLogin: (userData: { id: string; role: string; name: string }) => void;
  defaultRole?: 'student' | 'staff' | 'admin';
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
  const [role, setRole] = useState<'student' | 'staff' | 'admin'>(defaultRole);

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
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    // Check for saved credentials if "Remember me" was checked
    const savedId = localStorage.getItem('savedId');
    const savedRole = localStorage.getItem('savedRole') as 'student' | 'staff' | 'admin' | null;
    if (savedId && savedRole && ['student', 'staff', 'admin'].includes(savedRole)) {
      setId(savedId);
      setRole(savedRole);
      setRememberMe(true);
    }
  }, []);

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

      // Simulate API error for demonstration
      if (loginPassword !== id) {
        throw new Error('Invalid credentials. Please try again.');
      }

      onLogin({
        id,
        role,
        name: role === "admin" ? "Admin User" : role === "staff" ? "Staff Member" : "Student Name"
      });

      toast({
        title: `Welcome back, ${id}!`,
        description: `Successfully logged in as ${role.charAt(0).toUpperCase() + role.slice(1)}.`,
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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 py-12 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 rounded-xl overflow-hidden shadow-2xl bg-background relative"
      >
        {/* Left side - Illustration */}
        <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-primary to-primary/90 text-white">
          <div className="max-w-md mx-auto text-center">

            <div className="relative h-64">
              <img
                src={graduationImage}
                alt="Graduation Image"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="p-8 md:p-12">
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {title}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {description}
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="id" className="flex items-center gap-1">
                    <Key className="h-4 w-4" />
                    Student/Staff ID <span className="text-muted-foreground text-xs ml-1">(e.g., 22K91A6664)</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="id"
                      type="text"
                      placeholder="22K91A6664"
                      value={id}
                      onChange={(e) => {
                        const formatted = formatId(e.target.value);
                        setId(formatted);
                      }}
                      maxLength={10}
                      className="pl-10 font-mono tracking-widest"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="flex items-center gap-1">
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                      tabIndex={-1}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {!disableRoleSelection && (
                  <div className="space-y-2">
                    <Label htmlFor="role" className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      I am a
                    </Label>
                    <Select
                      value={role}
                      onValueChange={(value: 'student' | 'staff' | 'admin') => setRole(value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student" className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Student
                        </SelectItem>
                        <SelectItem value="staff" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Faculty/Staff
                        </SelectItem>
                        <SelectItem value="admin" className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Administrator
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="remember" className="text-sm font-medium leading-none">
                      Remember me
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="px-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : 'Sign In'}
                  </Button>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-primary hover:underline"
                    tabIndex={-1}
                  >
                    Create an account
                  </Link>
                </div>

                <div className="text-xs text-muted-foreground text-center max-w-xs mx-auto">
                  By signing in, you agree to our{" "}
                  <a href="#" className="underline underline-offset-4 hover:text-primary">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline underline-offset-4 hover:text-primary">
                    Privacy Policy
                  </a>.
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}