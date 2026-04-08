import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    CreditCard, Receipt, FileText, Info, ArrowRight, CheckCircle2, 
    AlertCircle, Landmark, Wallet, ShieldCheck, History
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StudentFees() {
    return (
        <div className="space-y-8 animate-in fade-in-50 duration-700 pb-20">
            {/* Payment Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-primary p-10 rounded-[2.5rem] text-white shadow-2xl shadow-primary/20">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                    <Landmark className="h-48 w-48" />
                </div>
                <div className="relative z-10 space-y-4 max-w-2xl">
                    <Badge className="bg-white/20 text-white border-none text-[10px] font-black tracking-widest uppercase px-3 py-1">Institutional Billing</Badge>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">Student Fee Portal</h1>
                    <p className="text-lg opacity-80 font-bold leading-tight">Securely manage your academic financial obligations. Pay tuition, supplementary exams, and administrative fees with verified transaction hash.</p>
                </div>
            </div>

            <Tabs defaultValue="regular" className="w-full">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                    <TabsList className="bg-muted/40 p-1.5 rounded-2xl h-14 backdrop-blur-sm shadow-inner overflow-x-auto max-w-full">
                        <TabsTrigger value="regular" className="px-8 rounded-xl text-xs font-black transition-all gap-2">
                            <CreditCard className="h-4 w-4" /> Regular Fees
                        </TabsTrigger>
                        <TabsTrigger value="supply" className="px-8 rounded-xl text-xs font-black transition-all gap-2">
                            <Wallet className="h-4 w-4" /> Supply/Re-Eval
                        </TabsTrigger>
                        <TabsTrigger value="receipts" className="px-8 rounded-xl text-xs font-black transition-all gap-2">
                            <History className="h-4 w-4" /> Receipt History
                        </TabsTrigger>
                    </TabsList>
                    
                    <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 px-5 py-2.5 rounded-2xl">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span className="text-[10px] font-black uppercase text-emerald-700 tracking-widest whitespace-nowrap">Secure 256-bit Encrypted Portal</span>
                    </div>
                </div>

                <TabsContent value="regular" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2 border-border/40 shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-border/50 transition-all hover:shadow-primary/5">
                            <CardHeader className="p-8 border-b border-border/50">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl font-black tracking-tight">Active Invoices</CardTitle>
                                        <CardDescription className="text-sm font-bold opacity-60">Pending academic semester payments</CardDescription>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] font-black uppercase border-amber-500/20 text-amber-600">Action Required</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border/30">
                                    {[
                                        { id: "INV-2024-001", title: "Semester Tuition Fee", amount: "₹45,000", due: "April 15, 2024", status: "Unpaid", type: "Tuition" },
                                        { id: "INV-2024-002", title: "Skill Development Fee", amount: "₹5,000", due: "April 15, 2024", status: "Unpaid", type: "Lab" },
                                    ].map((inv) => (
                                        <div key={inv.id} className="p-8 flex items-center justify-between hover:bg-muted/5 transition-all">
                                            <div className="flex gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                                    <Receipt className="h-6 w-6 text-primary" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-foreground">{inv.title}</h4>
                                                    <div className="flex gap-3 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                                                        <span>{inv.id}</span>
                                                        <span>•</span>
                                                        <span>Due: {inv.due}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right space-y-2">
                                                <div className="text-xl font-black text-foreground">{inv.amount}</div>
                                                <Button size="sm" className="rounded-xl font-black px-6 text-[10px] h-8 shadow-lg shadow-primary/20">Pay Now</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="border-border/40 shadow-lg rounded-3xl overflow-hidden bg-primary text-white border-none p-8 relative">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Info className="h-16 w-16" />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-white/70">Payment Alert</h4>
                                    <p className="text-lg font-bold leading-tight italic">"Delayed payments after April 20th will incur a ₹50/day late processing fee as per Section 4.B of Institutional Policy."</p>
                                    <Button variant="outline" className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white font-black rounded-xl h-12 uppercase text-[10px] tracking-widest">View Instructions</Button>
                                </div>
                            </Card>
                            
                            <Card className="border-border/40 shadow-lg rounded-3xl p-8 bg-muted/20 border border-dashed border-border/50 flex flex-col items-center text-center space-y-4">
                                <div className="h-14 w-14 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-lg border border-border/50">
                                    <AlertCircle className="h-6 w-6 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-foreground">Scholarship Status</h4>
                                    <p className="text-xs text-muted-foreground font-bold leading-relaxed">Your JVD scholarship status is currently <span className="text-emerald-600 uppercase">Process Initiated</span>. Deduction will reflect in actual bill.</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="supply" className="space-y-6">
                    <div className="flex flex-col items-center justify-center p-20 bg-muted/20 border-2 border-dashed rounded-[3rem] opacity-50 space-y-4">
                        <History className="h-16 w-16 text-primary/40" />
                        <p className="font-black text-center text-sm italic">Supplementary exam and Re-evaluation windows are currently closed.<br/><span className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Check Notifications for next cycle commencement.</span></p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
