import { useEffect, useState } from "react";
import Layout from "@/components/common/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { reportService } from "@/services/api";
import { FileText, CheckCircle, XCircle, TrendingUp, Users, Download } from "lucide-react";

const ComplianceDashboard = () => {
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await reportService.getCompliance();
                setReport(response.data);
            } catch (error) {
                console.error("Failed to fetch report", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, []);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 mt-16">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold">Accreditation Dashboard</h1>
                        <p className="text-muted-foreground">Real-time Compliance & Audit Reporting</p>
                    </div>
                    <Button>
                        <Download className="mr-2 h-4 w-4" /> Download PDF Report
                    </Button>
                </div>

                {loading ? (
                    <div>Loading analysis...</div>
                ) : report ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Metrics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-primary" /> Key Metrics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-muted rounded-lg">
                                        <div className="text-sm text-muted-foreground">Faculty Strength</div>
                                        <div className="text-2xl font-bold">{report.metrics.faculty_strength}</div>
                                    </div>
                                    <div className="p-4 bg-muted rounded-lg">
                                        <div className="text-sm text-muted-foreground">Student Strength</div>
                                        <div className="text-2xl font-bold">{report.metrics.student_strength}</div>
                                    </div>
                                    <div className="p-4 bg-muted rounded-lg">
                                        <div className="text-sm text-muted-foreground">S:F Ratio</div>
                                        <div className="text-2xl font-bold">{report.metrics.student_faculty_ratio}</div>
                                    </div>
                                    <div className="p-4 bg-muted rounded-lg">
                                        <div className="text-sm text-muted-foreground">Research Index</div>
                                        <div className="text-2xl font-bold">{report.metrics.research_index}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" /> Compliance Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6">
                                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${report.metrics.compliance_status === "Ready for Audit"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}>
                                        {report.metrics.compliance_status === "Ready for Audit"
                                            ? <CheckCircle className="mr-2 h-4 w-4" />
                                            : <XCircle className="mr-2 h-4 w-4" />}
                                        {report.metrics.compliance_status}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Missing Documents</h4>
                                    {report.missing_documents.map((doc: string, i: number) => (
                                        <div key={i} className="flex items-center text-sm text-red-600 bg-red-50 p-2 rounded">
                                            <XCircle className="h-4 w-4 mr-2" /> {doc}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 space-y-4">
                                    <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">AI Insights</h4>
                                    {report.ai_insights.map((insight: string, i: number) => (
                                        <div key={i} className="flex items-center text-sm text-blue-600 bg-blue-50 p-2 rounded">
                                            <TrendingUp className="h-4 w-4 mr-2" /> {insight}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div>No report data available.</div>
                )}
            </div>
        </Layout>
    );
};

export default ComplianceDashboard;
