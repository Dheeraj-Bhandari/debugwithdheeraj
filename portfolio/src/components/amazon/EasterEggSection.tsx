import React from 'react';
import { useContact } from '../../amazon/contexts/ContactContext';

/**
 * EasterEggSection Component
 * 
 * Humorous "Customers Who Hired Dheeraj Also Hired" section with fictional profiles.
 * Features:
 * - Amazon recommendation styling
 * - Fictional humorous developer profiles
 * - Easter egg content for entertainment
 * - Professional yet playful tone
 * 
 * Requirements: 13.1
 */

interface FictionalProfile {
  /** Developer name */
  name: string;
  
  /** Job title */
  title: string;
  
  /** Humorous description */
  description: string;
  
  /** Star rating */
  rating: number;
  
  /** Number of projects */
  projects: number;
  
  /** Avatar emoji or icon */
  avatar: string;
}

/**
 * Fictional developer profiles (easter eggs)
 */
const FICTIONAL_PROFILES: FictionalProfile[] = [
  {
    name: "Sarah 'Stack Overflow' Chen",
    title: "Copy-Paste Engineer",
    description: "Expert at finding solutions on Stack Overflow and adapting them to your needs. Has memorized every error message known to humanity. 10+ years of Googling experience.",
    rating: 4.8,
    projects: 127,
    avatar: "👩‍💻",
  },
  {
    name: "Bob 'The Debugger' Martinez",
    title: "Console.log Specialist",
    description: "Will add console.log() statements until the bug reveals itself. Has never met a problem that couldn't be solved with enough logging. Debugger? Never heard of it.",
    rating: 4.9,
    projects: 89,
    avatar: "🐛",
  },
  {
    name: "Alex 'Async/Await' Johnson",
    title: "Promise Keeper",
    description: "Turns callback hell into async heaven. Can explain Promises to your grandmother. Still has nightmares about nested callbacks from 2015.",
    rating: 5.0,
    projects: 156,
    avatar: "⏳",
  },
  {
    name: "Emma 'CSS Wizard' Thompson",
    title: "Flexbox Whisperer",
    description: "Can center a div in under 30 seconds. Knows the difference between margin and padding (unlike some people). Has strong opinions about CSS-in-JS.",
    rating: 4.7,
    projects: 203,
    avatar: "🎨",
  },
  {
    name: "Mike 'Merge Conflict' Davis",
    title: "Git Archaeologist",
    description: "Specializes in resolving merge conflicts and recovering lost commits. Can read git logs like ancient scrolls. Has never force-pushed to main (okay, maybe once).",
    rating: 4.6,
    projects: 94,
    avatar: "🔀",
  },
  {
    name: "Lisa 'The Optimizer' Park",
    title: "Performance Perfectionist",
    description: "Will shave milliseconds off your load time. Obsessed with Lighthouse scores. Dreams in Web Vitals. Has strong feelings about bundle sizes.",
    rating: 4.9,
    projects: 112,
    avatar: "⚡",
  },
];

/**
 * Individual profile card component
 */
const ProfileCard: React.FC<{ profile: FictionalProfile }> = ({ profile }) => {
  const fullStars = Math.floor(profile.rating);
  const hasHalfStar = profile.rating % 1 >= 0.5;

  return (
    <div className="profile-card bg-white border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Avatar */}
      <div className="text-center mb-4">
        <div className="text-6xl mb-3">
          {profile.avatar}
        </div>
        <h3 className="font-bold text-amazon-dark text-lg mb-1">
          {profile.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {profile.title}
        </p>
        
        {/* Rating */}
        <div className="flex items-center justify-center gap-1 mb-2">
          {[...Array(fullStars)].map((_, i) => (
            <svg
              key={`full-${i}`}
              className="w-4 h-4 text-amazon-orange fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
          {hasHalfStar && (
            <svg
              className="w-4 h-4 text-amazon-orange"
              viewBox="0 0 20 20"
            >
              <defs>
                <linearGradient id={`half-star-${profile.name}`}>
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="#DDD" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#half-star-${profile.name})`}
                d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
              />
            </svg>
          )}
          <span className="text-sm text-gray-600 ml-1">
            {profile.rating}
          </span>
        </div>
        
        <p className="text-xs text-gray-500">
          {profile.projects} projects completed
        </p>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 leading-relaxed text-center">
        {profile.description}
      </p>

      {/* Fake "View Profile" Button */}
      <button 
        className="w-full mt-4 py-2 px-4 bg-white border-2 border-amazon-orange text-amazon-orange rounded hover:bg-amazon-orange hover:text-white transition-colors duration-200 font-medium text-sm"
        onClick={() => alert("Just kidding! These are fictional profiles for fun. But Dheeraj is very real and available for hire!")}
      >
        View Profile
      </button>
    </div>
  );
};

const EasterEggSection: React.FC = () => {
  const { openContactSidebar } = useContact();
  
  return (
    <section 
      id="easter-egg" 
      className="easter-egg-section py-12 px-4 bg-gradient-to-b from-gray-50 to-white"
      aria-labelledby="easter-egg-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <h2 
            id="easter-egg-heading"
            className="text-3xl font-bold text-amazon-dark mb-2"
          >
            Customers Who Hired Dheeraj Also Hired
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            (Disclaimer: These are fictional profiles for entertainment purposes)
          </p>
          <div className="inline-block bg-yellow-100 border border-yellow-400 rounded-lg px-4 py-2 text-sm text-yellow-800">
            <span className="font-bold">Easter Egg Alert!</span> These profiles are jokes. 
            But if you need a real developer, Dheeraj is your person! 😄
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FICTIONAL_PROFILES.map((profile) => (
            <ProfileCard key={profile.name} profile={profile} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 mb-4">
            Enjoyed the humor? Now let's talk about real work!
          </p>
          <button 
            onClick={openContactSidebar}
            className="px-8 py-3 bg-amazon-orange text-white rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:ring-offset-2"
            aria-label="Hire the real developer - open contact sidebar"
          >
            Hire the Real Developer
          </button>
        </div>
      </div>
    </section>
  );
};

export default EasterEggSection;
