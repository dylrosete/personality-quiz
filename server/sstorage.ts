import { type PersonalityProfile, type InsertPersonalityProfile, type MBTIData, type PersonalityTraits } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createPersonalityProfile(profile: InsertPersonalityProfile): Promise<PersonalityProfile>;
  getPersonalityProfile(id: string): Promise<PersonalityProfile | undefined>;
  getMBTIData(mbtiType: string): Promise<MBTIData | undefined>;
  calculateMBTI(traits: PersonalityTraits): string;
}

export class MemStorage implements IStorage {
  private profiles: Map<string, PersonalityProfile>;
  private mbtiData: Map<string, MBTIData> = new Map();

  constructor() {
    this.profiles = new Map();
    this.initializeMBTIData();
  }

  private initializeMBTIData() {
    this.mbtiData = new Map([
      ['ISTJ', {
        title: 'The Logistician',
        animeCharacter: 'Levi Ackerman (Attack on Titan)',
        marvelCharacter: 'Captain America',
        animeImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        marvelImage: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        books: ['1984 by George Orwell', 'Meditations by Marcus Aurelius', 'Atomic Habits by James Clear'],
        anime: ['Ghost in the Shell', 'Psycho-Pass', 'Monster'],
        activities: ['Military cadet programs or martial arts', 'Traditional sports (track, swimming)', 'Joining student council or ROTC'],
        videos: ['Military history documentaries', 'Productivity and time management channels', 'Traditional martial arts tutorials'],
        lifestyle: ['Maintain structured daily routines', 'Focus on long-term goal planning', 'Practice discipline and self-control'],
        learning: ['Study military strategy and history', 'Learn traditional crafts or skills', 'Master organizational systems']
      }],
      ['ISFJ', {
        title: 'The Defender',
        animeCharacter: 'Tohru Honda (Fruits Basket)',
        marvelCharacter: 'Aunt May',
        animeImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        marvelImage: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        books: ['Little Women by Louisa May Alcott', 'The Secret Garden by Frances Hodgson Burnett', 'Tuesdays with Morrie by Mitch Albom'],
        anime: ['Fruits Basket', 'Violet Evergarden', 'Your Lie in April'],
        activities: ['Volunteering or caregiving roles', 'Choir or church/community groups', 'Journaling and crafting'],
        videos: ['Cooking and recipe channels', 'Self-care and wellness content', 'Family-friendly entertainment'],
        lifestyle: ['Prioritize helping others daily', 'Create cozy, nurturing environments', 'Practice gratitude and mindfulness'],
        learning: ['Study psychology and counseling', 'Learn traditional homemaking skills', 'Develop empathy and listening skills']
      }],
      ['INFJ', {
        title: 'The Advocate',
        animeCharacter: 'Armin Arlert (Attack on Titan)',
        marvelCharacter: 'Professor X',
        animeImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        marvelImage: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        books: ['The Alchemist by Paulo Coelho', 'The Bell Jar by Sylvia Plath', 'The Book Thief by Markus Zusak'],
        anime: ['Serial Experiments Lain', 'Erased', 'Nana'],
        activities: ['Creative writing or poetry', 'Deep 1-on-1 conversations or mentoring', 'Avoiding mainstream trends'],
        videos: ['Philosophy and meaning-of-life content', 'Independent film analysis', 'Deep psychological documentaries'],
        lifestyle: ['Spend time in solitude for reflection', 'Avoid overwhelming social situations', 'Focus on meaningful relationships'],
        learning: ['Study philosophy and human nature', 'Develop intuitive and empathic abilities', 'Learn meditation and self-reflection']
      }],
      ['INTJ', {
        title: 'The Architect',
        animeCharacter: 'Light Yagami (Death Note)',
        marvelCharacter: 'Doctor Strange',
        animeImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        marvelImage: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        books: ['Dune by Frank Herbert', 'A Brief History of Time by Stephen Hawking', 'The Prince by Machiavelli'],
        anime: ['Death Note', 'Steins;Gate', 'Code Geass'],
        activities: ['Chess club or science fairs', 'Skipping social events to plan future goals', 'Programming or strategic games'],
        videos: ['Science and technology channels', 'Strategic thinking and chess tutorials', 'Future technology predictions'],
        lifestyle: ['Create long-term strategic plans', 'Minimize unnecessary social obligations', 'Focus on continuous self-improvement'],
        learning: ['Study complex systems and theories', 'Master strategic thinking and planning', 'Learn advanced technology and science']
      }],
      ['ISTP', {
        title: 'The Virtuoso',
        animeCharacter: 'Spike Spiegel (Cowboy Bebop)',
        marvelCharacter: 'Wolverine',
        animeImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        marvelImage: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        books: ['Into the Wild by Jon Krakauer', 'Zen and the Art of Motorcycle Maintenance', 'Hatchet by Gary Paulsen'],
        anime: ['Cowboy Bebop', 'Samurai Champloo', 'Black Lagoon'],
        activities: ['Tinkering, mechanics, or DIY projects', 'Extreme sports or martial arts', 'Avoiding rigid schedules'],
        videos: ['DIY and maker channels', 'Extreme sports and adventure content', 'Mechanical and technical tutorials'],
        lifestyle: ['Maintain flexibility in daily routines', 'Spend time working with hands', 'Seek thrilling experiences'],
        learning: ['Master practical and technical skills', 'Learn survival and outdoor skills', 'Develop physical coordination and reflexes']
      }],
      ['ISFP', {
        title: 'The Adventurer',
        animeCharacter: 'Tanjiro Kamado (Demon Slayer)',
        marvelCharacter: 'Spider-Gwen',
        animeImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        marvelImage: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        books: ['The Perks of Being a Wallflower', 'Wild by Cheryl Strayed', 'Norwegian Wood by Haruki Murakami'],
        anime: ['A Silent Voice', 'Mushishi', 'Natsume\'s Book of Friends'],
        activities: ['Painting, music, or solo traveling', 'Nature walks and photography', 'Avoiding confrontations and pressure'],
        videos: ['Art and creativity tutorials', 'Nature documentaries', 'Peaceful and aesthetic content'],
        lifestyle: ['Express creativity daily', 'Spend time in nature regularly', 'Honor personal values and authenticity'],
        learning: ['Develop artistic and creative skills', 'Study environmental and nature sciences', 'Learn stress management and mindfulness']
      }],
      ['INFP', {
        title: 'The Mediator',
        animeCharacter: 'Shinji Ikari (Evangelion)',
        marvelCharacter: 'Wanda Maximoff',
        animeImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        marvelImage: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        books: ['The Little Prince by Antoine de Saint-Exupéry', 'The Catcher in the Rye by J.D. Salinger', 'Howl\'s Moving Castle by Diana Wynne Jones'],
        anime: ['Spirited Away', 'Clannad', 'Made in Abyss'],
        activities: ['Creative arts (drawing, poetry, etc.)', 'Getting lost in fantasy novels', 'Avoiding structured group activities'],
        videos: ['Creative writing and poetry channels', 'Fantasy and imagination content', 'Personal development and introspection'],
        lifestyle: ['Follow your creative inspirations', 'Create personal sacred spaces', 'Honor emotional depth and sensitivity'],
        learning: ['Study literature and creative writing', 'Explore philosophy and meaning', 'Develop emotional intelligence and empathy']
      }],
      ['INTP', {
        title: 'The Logician',
        animeCharacter: 'L Lawliet (Death Note)',
        marvelCharacter: 'Tony Stark',
        animeImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        marvelImage: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        books: ['Gödel, Escher, Bach by Douglas Hofstadter', 'Sophie\'s World by Jostein Gaarder', 'Slaughterhouse-Five by Kurt Vonnegut'],
        anime: ['Paranoia Agent', 'Texhnolyze', 'The Tatami Galaxy'],
        activities: ['Debating or solo intellectual pursuits', 'Avoiding physical sports', 'Obsessive internet research or theorycrafting'],
        videos: ['Science and theory channels', 'Philosophy and logic content', 'Abstract and conceptual discussions'],
        lifestyle: ['Follow intellectual curiosity freely', 'Maintain flexibility in thinking', 'Question conventional wisdom'],
        learning: ['Master logic, mathematics, and science', 'Study theoretical and abstract concepts', 'Develop analytical and critical thinking']
      }],
      ['ESTP', {
        title: 'The Dynamo',
        animeCharacter: 'Natsu Dragneel (Fairy Tail)',
        marvelCharacter: 'Deadpool',
        animeImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        marvelImage: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        books: ['The Art of War by Sun Tzu', 'Can\'t Hurt Me by David Goggins', 'The Wolf of Wall Street by Jordan Belfort'],
        anime: ['One Punch Man', 'JoJo\'s Bizarre Adventure', 'Baki the Grappler'],
        activities: ['Extreme sports or competitive games', 'Flirting and social games', 'Skipping schoolwork for adventure'],
        videos: ['Action sports and competition channels', 'Business and entrepreneurship content', 'High-energy entertainment'],
        lifestyle: ['Seek immediate exciting experiences', 'Stay physically active and competitive', 'Live spontaneously and adaptively'],
        learning: ['Master physical and competitive skills', 'Learn practical business and social skills', 'Develop quick decision-making abilities']
      }],
      ['ESFP', {
        title: 'The Entertainer',
        animeCharacter: 'Naruto Uzumaki (Naruto)',
        marvelCharacter: 'Star-Lord',
        animeImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        marvelImage: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        books: ['Eleanor & Park by Rainbow Rowell', 'The Fault in Our Stars by John Green', 'To All the Boys I\'ve Loved Before by Jenny Han'],
        anime: ['Ouran High School Host Club', 'K-On!', 'My Dress-Up Darling'],
        activities: ['Theatre, dance, or fashion', 'Hosting parties or events', 'Avoiding anything boring or repetitive'],
        videos: ['Entertainment and pop culture channels', 'Fashion and lifestyle content', 'Comedy and feel-good videos'],
        lifestyle: ['Surround yourself with positive people', 'Express yourself through style and art', 'Stay socially connected and active'],
        learning: ['Develop performance and presentation skills', 'Study fashion, arts, and entertainment', 'Learn social and communication skills']
      }],
      ['ENFP', {
        title: 'The Campaigner',
        animeCharacter: 'Mob (Mob Psycho 100)',
        marvelCharacter: 'Spider-Man',
        animeImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        marvelImage: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        books: ['Big Magic by Elizabeth Gilbert', 'The Night Circus by Erin Morgenstern', 'On the Road by Jack Kerouac'],
        anime: ['Hunter x Hunter', 'Mob Psycho 100', 'FLCL'],
        activities: ['Improv, travel, or activism', 'Constantly switching hobbies', 'Avoiding anything that feels like a "trap"'],
        videos: ['Creative inspiration and motivation channels', 'Travel and adventure content', 'Personal growth and possibility-focused videos'],
        lifestyle: ['Follow your passions and inspirations', 'Maintain variety and novelty in life', 'Connect with like-minded creative people'],
        learning: ['Study psychology and human potential', 'Learn diverse creative and communication skills', 'Develop leadership and inspiration abilities']
      }],
      ['ENTP', {
        title: 'The Debater',
        animeCharacter: 'Senku Ishigami (Dr. Stone)',
        marvelCharacter: 'The Riddler',
        animeImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        marvelImage: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        books: ['The Hitchhiker\'s Guide to the Galaxy', 'Freakonomics', 'The 48 Laws of Power'],
        anime: ['Great Teacher Onizuka', 'Assassination Classroom', 'No Game No Life'],
        activities: ['Debate club or stand-up comedy', 'Playing devil\'s advocate for fun', 'Avoiding mundane routines'],
        videos: ['Debate and discussion channels', 'Comedy and satire content', 'Innovation and future-thinking videos'],
        lifestyle: ['Challenge conventional thinking regularly', 'Engage in intellectual debates and discussions', 'Explore multiple interests simultaneously'],
        learning: ['Master debate, rhetoric, and persuasion', 'Study innovation and entrepreneurship', 'Develop quick wit and creative problem-solving']
      }],
      ['ESTJ', {
        title: 'The Executive',
        animeCharacter: 'Erwin Smith (Attack on Titan)',
        marvelCharacter: 'Nick Fury',
        animeImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        marvelImage: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        books: ['7 Habits of Highly Effective People', 'Good to Great by Jim Collins', 'Think and Grow Rich by Napoleon Hill'],
        anime: ['Attack on Titan', 'Legend of the Galactic Heroes', 'Fullmetal Alchemist: Brotherhood'],
        activities: ['Leading clubs or sports teams', 'Participating in organized religion or politics', 'Avoiding disorder or laziness'],
        videos: ['Leadership and management channels', 'Business strategy and success stories', 'Organizational and productivity content'],
        lifestyle: ['Take charge and lead others', 'Maintain order and efficiency in all areas', 'Set and achieve ambitious goals'],
        learning: ['Study leadership and management skills', 'Master business and organizational principles', 'Develop decision-making and delegation abilities']
      }],
      ['ESFJ', {
        title: 'The Consul',
        animeCharacter: 'Ochaco Uraraka (My Hero Academia)',
        marvelCharacter: 'Pepper Potts',
        animeImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        marvelImage: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        books: ['Pride and Prejudice by Jane Austen', 'The Notebook by Nicholas Sparks', 'The Help by Kathryn Stockett'],
        anime: ['Toradora!', 'Horimiya', 'Your Name'],
        activities: ['Party planning or student council', 'Taking care of others (siblings, pets)', 'Avoiding isolation or weird subcultures'],
        videos: ['Relationship and social advice channels', 'Community building and event planning', 'Family and tradition-focused content'],
        lifestyle: ['Prioritize relationships and community', 'Create harmony in social environments', 'Support and care for others regularly'],
        learning: ['Study social psychology and communication', 'Learn event planning and organization', 'Develop nurturing and supportive skills']
      }],
      ['ENFJ', {
        title: 'The Protagonist',
        animeCharacter: 'All Might (My Hero Academia)',
        marvelCharacter: 'Captain Marvel',
        animeImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        marvelImage: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        books: ['Man\'s Search for Meaning by Viktor Frankl', 'Educated by Tara Westover', 'Becoming by Michelle Obama'],
        anime: ['Fullmetal Alchemist: Brotherhood', 'Haikyuu!!', 'Demon Slayer'],
        activities: ['Public speaking or coaching', 'Organizing school-wide events', 'Avoiding cynicism or self-doubt'],
        videos: ['Inspirational and motivational channels', 'Educational and development content', 'Leadership and positive impact videos'],
        lifestyle: ['Inspire and help others reach their potential', 'Create positive change in communities', 'Lead by example and maintain optimism'],
        learning: ['Study psychology and human development', 'Master public speaking and inspiration', 'Learn coaching and mentoring skills']
      }],
      ['ENTJ', {
        title: 'The Commander',
        animeCharacter: 'Lelouch Lamperouge (Code Geass)',
        marvelCharacter: 'Black Panther',
        animeImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        marvelImage: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        books: ['Atlas Shrugged by Ayn Rand', 'The Lean Startup by Eric Ries', 'Steve Jobs by Walter Isaacson'],
        anime: ['Code Geass', 'Vinland Saga', 'Bleach'],
        activities: ['Competitive debate or entrepreneurship clubs', 'Learning leadership through sports or business', 'Avoiding passivity or indecisiveness'],
        videos: ['Entrepreneurship and innovation channels', 'Strategic thinking and leadership content', 'Success stories and business case studies'],
        lifestyle: ['Set ambitious goals and execute systematically', 'Lead others toward shared visions', 'Continuously optimize and improve systems'],
        learning: ['Master strategic planning and execution', 'Study business, economics, and leadership', 'Develop visionary thinking and communication']
      }]
    ]);
  }

  calculateMBTI(traits: PersonalityTraits): string {
    const E_I = traits.extraversion > 50 ? 'E' : 'I';
    const S_N = traits.openness > 50 ? 'N' : 'S';
    const T_F = traits.agreeableness > 50 ? 'F' : 'T';
    const J_P = traits.conscientiousness > 50 ? 'J' : 'P';
    
    return E_I + S_N + T_F + J_P;
  }

  async createPersonalityProfile(insertProfile: InsertPersonalityProfile): Promise<PersonalityProfile> {
    const id = randomUUID();
    const profile: PersonalityProfile = { 
      ...insertProfile, 
      id,
      createdAt: new Date().toISOString()
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async getPersonalityProfile(id: string): Promise<PersonalityProfile | undefined> {
    return this.profiles.get(id);
  }

  async getMBTIData(mbtiType: string): Promise<MBTIData | undefined> {
    return this.mbtiData.get(mbtiType);
  }
}

export const storage = new MemStorage();
