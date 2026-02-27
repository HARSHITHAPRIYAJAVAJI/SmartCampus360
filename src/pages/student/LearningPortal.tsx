import { useEffect, useState } from "react";
import Layout from "@/components/common/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trainingService } from "@/services/api";
import { BookOpen, Video, WifiOff, Star, PlayCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const LearningPortal = () => {
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [allSkills, setAllSkills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recRes, allRes] = await Promise.all([
                    trainingService.getRecommendations(),
                    trainingService.getAllSkills()
                ]);
                setRecommendations(recRes.data);
                setAllSkills(allRes.data);
            } catch (error) {
                console.error("Failed to fetch skills", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 mt-16">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">My Learning Portal</h1>
                    <p className="text-muted-foreground">AI-Driven Personalized Skill Development</p>
                    <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-green-600 bg-green-50 w-fit px-3 py-1 rounded-full">
                        <WifiOff className="h-3 w-3" /> Offline Mode Available
                    </div>
                </div>

                {/* AI Recommendations */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" /> AI Recommended for You
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {loading ? (
                            <p>Loading recommendations...</p>
                        ) : recommendations.length > 0 ? (
                            recommendations.map((skill) => (
                                <SkillCard key={skill.id} skill={skill} recommended={true} />
                            ))
                        ) : (
                            <p className="text-muted-foreground col-span-3">No specific recommendations at this time.</p>
                        )}
                    </div>
                </section>

                {/* All Courses */}
                <section>
                    <h2 className="text-2xl font-bold mb-6">Browse All Skills</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {allSkills.map((skill) => (
                            <SkillCard key={skill.id} skill={skill} />
                        ))}
                    </div>
                </section>
            </div>
        </Layout>
    );
};

const SkillCard = ({ skill, recommended }: { skill: any, recommended?: boolean }) => {
    return (
        <Card className={`overflow-hidden transition-all hover:shadow-lg ${recommended ? 'border-primary/50 bg-primary/5' : ''}`}>
            <div className="h-32 bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                </div>
                {recommended && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600">
                        Top Pick
                    </Badge>
                )}
            </div>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{skill.category}</Badge>
                    <Badge variant="secondary" className="text-xs">{skill.difficulty_level}</Badge>
                </div>
                <CardTitle className="text-lg">{skill.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {skill.description || "Master this skill with our comprehensive modules."}
                </p>
                <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>0%</span>
                    </div>
                    <Progress value={0} className="h-1" />
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">
                    <PlayCircle className="mr-2 h-4 w-4" /> Start Learning
                </Button>
            </CardFooter>
        </Card>
    );
};

export default LearningPortal;
