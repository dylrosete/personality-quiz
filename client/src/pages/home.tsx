import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PersonalitySlider } from "@/components/personality-slider";
import { CharacterCard } from "@/components/character-card";
import { RecommendationCard } from "@/components/recommendation-card";
import { Brain, Book, Play, Star, Youtube, Heart, GraduationCap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { PersonalityTraits, MBTIData } from "@shared/schema";

interface MBTIResponse extends MBTIData {
  mbtiType: string;
}

export default function Home() {
  const [traits, setTraits] = useState<PersonalityTraits>({
    openness: 50,
    conscientiousness: 50,
    extraversion: 50,
    agreeableness: 50,
    neuroticism: 50,
  });

  const [mbtiData, setMbtiData] = useState<MBTIResponse | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate MBTI when traits change
  useEffect(() => {
    const calculateMBTI = async () => {
      try {
        const response = await apiRequest("POST", "/api/calculate-mbti", traits);
        const data = await response.json();
        setMbtiData(data);
      } catch (error) {
        console.error("Failed to calculate MBTI:", error);
      }
    };

    calculateMBTI();
  }, [traits]);

  const updateTrait = (traitName: keyof PersonalityTraits, value: number) => {
    setTraits(prev => ({
      ...prev,
      [traitName]: value
    }));
  };

  const generateRecommendations = async () => {
    setIsLoading(true);
    setShowRecommendations(true);
    
    // Smooth scroll to recommendations section
    setTimeout(() => {
      const recommendationsSection = document.getElementById('recommendations');
      recommendationsSection?.scrollIntoView({ behavior: 'smooth' });
      setIsLoading(false);
    }, 500);
  };

  const scrollToAssessment = () => {
    document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="text-2xl text-primary" />
              <h1 className="text-2xl font-bold gradient-text">
                PersonaMatch
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#assessment" className="text-muted-foreground hover:text-foreground transition-colors">Assessment</a>
              <a href="#results" className="text-muted-foreground hover:text-foreground transition-colors">Results</a>
              <a href="#recommendations" className="text-muted-foreground hover:text-foreground transition-colors">Recommendations</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-5xl font-bold mb-6 gradient-text">
            Discover Your True Character
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Adjust your Big Five personality traits and discover your MBTI type, matching fictional characters, 
            and personalized recommendations to shape your ideal self.
          </p>
          <Button 
            onClick={scrollToAssessment} 
            className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-3 font-semibold"
            data-testid="button-start-journey"
          >
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* Assessment Section */}
      <section id="assessment" className="py-16 px-6 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center mb-12">Personality Assessment</h3>
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Trait Sliders */}
            <div className="space-y-8">
              <PersonalitySlider
                label="Openness to Experience"
                value={traits.openness}
                onChange={(value) => updateTrait('openness', value)}
                lowLabel="Conventional"
                highLabel="Creative & Open"
                testId="openness"
              />

              <PersonalitySlider
                label="Conscientiousness"
                value={traits.conscientiousness}
                onChange={(value) => updateTrait('conscientiousness', value)}
                lowLabel="Flexible"
                highLabel="Organized & Disciplined"
                testId="conscientiousness"
              />

              <PersonalitySlider
                label="Extraversion"
                value={traits.extraversion}
                onChange={(value) => updateTrait('extraversion', value)}
                lowLabel="Introverted"
                highLabel="Extraverted"
                testId="extraversion"
              />

              <PersonalitySlider
                label="Agreeableness"
                value={traits.agreeableness}
                onChange={(value) => updateTrait('agreeableness', value)}
                lowLabel="Competitive"
                highLabel="Cooperative"
                testId="agreeableness"
              />

              <PersonalitySlider
                label="Neuroticism"
                value={traits.neuroticism}
                onChange={(value) => updateTrait('neuroticism', value)}
                lowLabel="Emotionally Stable"
                highLabel="Emotionally Reactive"
                testId="neuroticism"
              />
            </div>

            {/* Live Results */}
            <div id="results" className="bg-card p-6 rounded-xl border border-border">
              <h4 className="text-2xl font-bold mb-6 text-center">Your Personality Profile</h4>
              
              {mbtiData && (
                <>
                  {/* MBTI Type Display */}
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-primary mb-2" data-testid="text-mbti-type">
                      {mbtiData.mbtiType}
                    </div>
                    <div className="text-lg text-muted-foreground" data-testid="text-mbti-title">
                      {mbtiData.title}
                    </div>
                  </div>

                  {/* Character Matches */}
                  <div className="space-y-4">
                    <h5 className="font-semibold text-center">Your Character Matches</h5>
                    
                    <CharacterCard
                      name={mbtiData.animeCharacter}
                      type="Anime"
                      imageUrl={mbtiData.animeImage}
                    />

                    <CharacterCard
                      name={mbtiData.marvelCharacter}
                      type="Marvel"
                      imageUrl={mbtiData.marvelImage}
                    />
                  </div>

                  {/* Generate Recommendations Button */}
                  <Button 
                    onClick={generateRecommendations}
                    className="w-full bg-accent hover:bg-accent/80 text-accent-foreground py-3 font-semibold mt-6"
                    disabled={isLoading}
                    data-testid="button-generate-recommendations"
                  >
                    {isLoading ? "Generating..." : "Generate My Recommendations"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      {showRecommendations && mbtiData && (
        <section id="recommendations" className="py-16 px-6 min-h-screen">
          <div className="container mx-auto max-w-6xl">
            <h3 className="text-3xl font-bold text-center mb-4">Your Personalized Recommendations</h3>
            <p className="text-center text-muted-foreground mb-12">
              Based on your <span className="text-primary font-semibold" data-testid="text-rec-mbti-type">{mbtiData.mbtiType}</span> personality type
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <RecommendationCard
                title="Books to Read"
                icon={<Book className="text-2xl text-primary" />}
                items={mbtiData.books}
                testId="books"
              />

              <RecommendationCard
                title="Anime to Watch"
                icon={<Play className="text-2xl text-accent" />}
                items={mbtiData.anime}
                testId="anime"
              />

              <RecommendationCard
                title="Activities"
                icon={<Star className="text-2xl text-green-500" />}
                items={mbtiData.activities}
                testId="activities"
              />

              <RecommendationCard
                title="Videos & Channels"
                icon={<Youtube className="text-2xl text-red-500" />}
                items={mbtiData.videos}
                testId="videos"
              />

              <RecommendationCard
                title="Lifestyle"
                icon={<Heart className="text-2xl text-pink-500" />}
                items={mbtiData.lifestyle}
                testId="lifestyle"
              />

              <RecommendationCard
                title="Learning & Growth"
                icon={<GraduationCap className="text-2xl text-yellow-500" />}
                items={mbtiData.learning}
                testId="learning"
              />
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border bg-card/30">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-muted-foreground" data-testid="text-attribution">
            Made by <span className="text-primary font-semibold">Dylan Rosete</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
