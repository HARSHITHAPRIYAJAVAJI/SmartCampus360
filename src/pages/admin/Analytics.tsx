import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, GraduationCap, TrendingUp, AlertTriangle } from "lucide-react";

const DATA_ENROLLMENT = [
    { name: '2021', students: 450 },
    { name: '2022', students: 520 },
    { name: '2023', students: 580 },
    { name: '2024', students: 650 },
    { name: '2025', students: 700 },
];

const DATA_DEPT_DISTRIBUTION = [
    { name: 'CSE', value: 400 },
    { name: 'ECE', value: 300 },
    { name: 'MECH', value: 200 },
    { name: 'CIVIL', value: 150 },
];

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b'];

const Analytics = () => {
    return (
        <div className="space-y-6 animate-in fade-in-50">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Campus Analytics</h1>
                <p className="text-muted-foreground">Real-time insights into academic performance and resource utilization.</p>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2,350</div>
                        <p className="text-xs text-muted-foreground">+12% from last year</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Faculty</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">145</div>
                        <p className="text-xs text-muted-foreground">98% attendance rate</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">92.4%</div>
                        <p className="text-xs text-muted-foreground">+4.1% year-over-year</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Compliance Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">Requires immediate attention</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="academic">Academic Performance</TabsTrigger>
                    <TabsTrigger value="financial">Financial</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        {/* Enrollment Chart */}
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Student Enrollment Trends</CardTitle>
                                <CardDescription>Number of students admitted over the last 5 years.</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={DATA_ENROLLMENT}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="students" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Department Distribution */}
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Department Distribution</CardTitle>
                                <CardDescription>Student count by department.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={350}>
                                    <PieChart>
                                        <Pie
                                            data={DATA_DEPT_DISTRIBUTION}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {DATA_DEPT_DISTRIBUTION.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 flex flex-wrap justify-center gap-4">
                                    {DATA_DEPT_DISTRIBUTION.map((entry, index) => (
                                        <div key={entry.name} className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <span className="text-sm text-muted-foreground">{entry.name} ({entry.value})</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="academic">
                    <Card>
                        <CardHeader>
                            <CardTitle>Academic Performance</CardTitle>
                            <CardDescription>Average GPA trends across semesters.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground bg-muted/20 border-dashed border-2 rounded-lg m-6">
                            Academic performance charts will be integrated here.
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="financial">
                    <Card>
                        <CardHeader>
                            <CardTitle>Financial Overview</CardTitle>
                            <CardDescription>Fee collection and expenditure.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground bg-muted/20 border-dashed border-2 rounded-lg m-6">
                            Financial data charts will be integrated here.
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Analytics;
