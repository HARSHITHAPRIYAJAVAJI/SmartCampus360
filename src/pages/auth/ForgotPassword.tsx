import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { GraduationCap, ArrowLeft, Mail, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import Layout from "@/components/common/Layout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your university email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
      toast({
        title: "Reset link sent!",
        description: "If an account exists for this email, you will receive a reset link shortly.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="w-full max-w-md"
        >
          <Card className="border-none shadow-2xl backdrop-blur-sm bg-background/95">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Forgot Password?
              </CardTitle>
              <CardDescription className="text-sm font-medium">
                {isSubmitted 
                  ? "Check your inbox for further instructions." 
                  : "No worries! Enter your email and we'll send you a recovery link."}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-6 gap-4 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-lg">Check your email</p>
                    <p className="text-muted-foreground text-sm">
                      We've sent a password recovery link to:<br/>
                      <span className="font-mono font-bold text-primary">{email}</span>
                    </p>
                  </div>
                  <Button variant="outline" className="mt-4 w-full" onClick={() => setIsSubmitted(false)}>
                    Resend email
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                       <Mail className="h-4 w-4" /> University Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@smartcampus.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                      className="h-12 border-muted-foreground/20 focus:border-primary"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-bold shadow-lg" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending request...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-4 border-t pt-6">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to sign in
              </Link>
            </CardFooter>
          </Card>
          
          <div className="mt-8 text-center text-xs text-muted-foreground">
            Protected by SmartCampus Secure™ Auth Systems
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
