import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    CreditCard, Receipt, FileText, CheckCircle2, 
    AlertCircle, Landmark, Wallet, ShieldCheck, 
    ArrowRight, Info, Award, Calendar
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { toast } from "sonner";

export default function RegularFeePayment() {
    const { user } = useOutletContext<{ user: { name: string, id: string, role: string } }>();
    const [isPaid, setIsPaid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const studentData = useMemo(() => {
        return MOCK_STUDENTS.find((s: any) => s.rollNumber.toUpperCase() === user.id.toUpperCase());
    }, [user.id]);

    const academicYear = studentData?.year === 4 ? 'IV' : studentData?.year === 3 ? 'III' : studentData?.year === 2 ? 'II' : 'I';
    const semester = studentData ? (studentData.semester % 2 === 0 ? 'II' : 'I') : 'I';

    const { baseFee, fineAmount, totalAmount, delayDays } = useMemo(() => {
        if (!studentData) return { baseFee: 0, fineAmount: 0, totalAmount: 0, delayDays: 0 };
        
        const base = studentData.year === 4 ? 3975 : 1975;
        
        // Simulation: Due date was April 1st, 2026
        const dueDate = new Date('2026-04-01');
        const today = new Date('2026-04-09');
        const diffTime = Math.abs(today.getTime() - dueDate.getTime());
        const delay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let fine = 0;
        if (delay > 0) {
            fine = delay <= 7 ? 100 : 1000;
        }
        
        return {
            baseFee: base,
            fineAmount: fine,
            totalAmount: base + fine,
            delayDays: delay
        };
    }, [studentData]);

    const amountInWords = useMemo(() => {
        const words = [
            "thousand", "hundred", "seventy-five", "ninety-five", "two thousand", "four thousand"
        ];
        // Simple mock word generator for common fee amounts
        if (totalAmount === 4975) return "Rupees four thousand nine hundred seventy-five only";
        if (totalAmount === 3975) return "Rupees three thousand nine hundred seventy-five only";
        if (totalAmount === 2975) return "Rupees two thousand nine hundred seventy-five only";
        if (totalAmount === 2075) return "Rupees two thousand seventy-five only";
        return `Rupees ${totalAmount} only`;
    }, [totalAmount]);

    const handlePayment = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsPaid(true);
            setIsSubmitting(false);
            toast.success("Fee Details Submitted Successfully!", {
                description: `Receipt No. 123828 generated for ₹${totalAmount.toLocaleString()}.`
            });
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-in fade-in-50 duration-700 pb-20">
            {/* Page Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 to-primary p-10 rounded-[2.5rem] text-white shadow-2xl shadow-primary/20">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                    <Landmark className="h-48 w-48" />
                </div>
                <div className="relative z-10 space-y-4 max-w-2xl">
                    <Badge className="bg-white/20 text-white border-none text-[10px] font-black tracking-widest uppercase px-3 py-1">Institutional Billing</Badge>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">B.Tech End Examinations Fee</h1>
                    <p className="text-lg opacity-80 font-bold leading-tight">
                        Official portal for {academicYear} B.Tech {semester} Semester Regular Examination fee submission.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Payment Form */}
                <Card className="lg:col-span-2 border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white dark:bg-zinc-950">
                    <CardHeader className="p-8 border-b bg-muted/30">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-2xl font-black">Fee Submission Details</CardTitle>
                                <CardDescription className="font-bold opacity-60">Complete your semester examination financial clearance.</CardDescription>
                            </div>
                            <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                <span className="text-[10px] font-black uppercase text-emerald-700 tracking-widest">Secure Portal</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        {isPaid && (
                            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-start gap-4 animate-in zoom-in-95 duration-500">
                                <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-200">
                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-black text-emerald-900 leading-none mb-1 text-sm uppercase tracking-wider">Payment Verified</h4>
                                    <p className="text-emerald-700 font-bold text-sm">
                                        Regular Fee is paid with Receipt No. <span className="underline">123828</span> on date 06-04-2026 through Online.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Receipt Date</label>
                                    <div className="flex items-center gap-3 p-4 bg-muted/40 rounded-xl border border-border/50 font-bold">
                                        <Calendar className="h-4 w-4 text-primary" />
                                        09-04-2026
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Exam Month</label>
                                    <div className="flex items-center gap-3 p-4 bg-muted/40 rounded-xl border border-border/50 font-bold">
                                        <Info className="h-4 w-4 text-amber-500" />
                                        May 2026
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-dashed">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-muted-foreground">Regular Examination Fee ({studentData?.year} Year)</span>
                                        <span className="font-black">₹{baseFee.toLocaleString()}.00</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-muted-foreground">Fine / Late Charges</span>
                                            {delayDays > 0 && <span className="text-[10px] text-rose-500 font-black uppercase tracking-wider">{delayDays} days delay detected</span>}
                                        </div>
                                        <span className={`font-black ${fineAmount > 0 ? 'text-rose-500' : 'text-muted-foreground'}`}>₹{fineAmount.toLocaleString()}.00</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t">
                                        <span className="font-black text-lg uppercase tracking-tighter">Total Payable</span>
                                        <span className="text-3xl font-black text-primary">₹{totalAmount.toLocaleString()}.00</span>
                                    </div>
                                    <p className="text-[10px] font-bold italic text-muted-foreground text-right uppercase">
                                        {amountInWords}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                    <h5 className="text-[10px] font-black uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
                                        <Award className="h-3 w-3" /> Other Fees & Adjustments
                                    </h5>
                                    <div className="bg-white dark:bg-zinc-900 rounded-xl border overflow-hidden">
                                        <table className="w-full text-xs">
                                            <thead className="bg-muted/50 border-b">
                                                <tr>
                                                    <th className="p-2.5 font-black text-left">Description</th>
                                                    <th className="p-2.5 font-black text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="p-4 text-muted-foreground italic font-medium">No additional charges applied</td>
                                                    <td className="p-4 text-right font-black">₹0.00</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                                    <div className="flex gap-3">
                                        <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                                        <p className="text-xs font-bold text-amber-800 leading-relaxed italic">
                                            Please ensure your transaction ID is valid before submission. Misreporting may lead to exam disqualification.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {!isPaid && (
                            <div className="pt-6 flex justify-end">
                                <Button 
                                    onClick={handlePayment} 
                                    disabled={isSubmitting}
                                    className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/30 group"
                                >
                                    {isSubmitting ? "Processing..." : "Submit Fee Detail"}
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="border-none shadow-xl rounded-[2rem] bg-zinc-900 text-white p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Info className="h-16 w-16" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Submission Guide</h4>
                            <p className="text-lg font-bold leading-tight">Payments must be cleared 48 hours before the examination hall ticket generation.</p>
                            <Button variant="outline" className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white font-black rounded-xl h-12 uppercase text-[10px] tracking-widest">
                                Policy Document
                            </Button>
                        </div>
                    </Card>

                    <Card className="border border-dashed border-border/50 shadow-lg rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-4 bg-muted/10">
                        <div className="h-14 w-14 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-lg border border-border/50">
                            <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-black text-foreground">Need Assistance?</h4>
                            <p className="text-xs text-muted-foreground font-bold leading-relaxed italic">Technical issues during payment? Contact the Examination Cell at extension 402.</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
