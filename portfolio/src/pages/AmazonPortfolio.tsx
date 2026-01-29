import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import AmazonLayout from '../layouts/AmazonLayout';
import {
  HeroSection,
  TodaysDealsSection,
  FrequentlyBoughtTogetherSection,
  ProductDetailsSection,
  TechnicalSpecificationsSection,
  CustomerReviewsSection,
  CustomersAlsoViewedSection,
  QuestionsAndAnswersSection,
  EasterEggSection,
  SubscribeSection,
} from '../components/amazon';
import { portfolioDataMapper } from '../amazon/lib/AmazonPortfolioDataMapper';
import { personalInfo, contactInfo, developerHighlights } from '../data/portfolioData';
import type { Skill, Project, SkillBundle, Review, Experience } from '../amazon/types';

const AmazonPortfolio: React.FC = () => {
  const [featuredSkills, setFeaturedSkills] = useState<Skill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skillBundles, setSkillBundles] = useState<SkillBundle[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Load portfolio data
    portfolioDataMapper.loadPortfolioData();
    
    // Get data
    const skills = portfolioDataMapper.getSkills();
    const extendedSkills = portfolioDataMapper.getExtendedSkillCatalog(); // Top 12 skills for display
    const projects = portfolioDataMapper.getProjects();
    const bundles = portfolioDataMapper.getSkillBundles();
    const experienceData = portfolioDataMapper.getExperiences();
    
    // Collect all reviews from skills and projects
    const reviews = [
      ...skills.flatMap(s => s.reviews),
      ...projects.flatMap(p => p.reviews),
    ];
    
    setFeaturedSkills(portfolioDataMapper.getFeaturedSkills(4));
    setAllSkills(extendedSkills); // Use extended catalog (12 skills) instead of all skills
    setFeaturedProjects(portfolioDataMapper.getFeaturedProjects(3));
    setExperiences(experienceData);
    setSkillBundles(bundles);
    setAllReviews(reviews);
  }, []);

  const handleAddToCart = (id: string) => {
    // Dispatch custom event to add item to cart
    window.dispatchEvent(new CustomEvent('addToCart', { detail: { id, type: 'skill' } }));
  };

  const handleAddBundleToCart = (bundleId: string) => {
    // Dispatch custom event to add bundle to cart
    window.dispatchEvent(new CustomEvent('addBundleToCart', { detail: { bundleId } }));
  };

  const handleProductClick = (id: string) => {
    // Dispatch custom event to open product modal
    window.dispatchEvent(new CustomEvent('openProductModal', { detail: { id } }));
  };

  const handleContactClick = () => {
    // This will be handled by the ContactProvider in the layout
    // Trigger a custom event that the layout can listen to
    window.dispatchEvent(new CustomEvent('openContactSidebar'));
  };

  const handleSubscribe = async (email: string) => {
    console.log('Newsletter subscription:', email);
    // Newsletter functionality to be implemented in later tasks
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <AmazonLayout>
      {/* Toast Notifications */}
      <Toaster />
      
      {/* Hero Section */}
      <HeroSection
        name={personalInfo.name}
        title={personalInfo.title}
        tagline={personalInfo.tagline}
        profileImage={personalInfo.profileImage}
        onContactClick={handleContactClick}
        resumeUrl={contactInfo.resume}
      />

      {/* Today's Deals - Featured Skills */}
      <TodaysDealsSection
        featuredSkills={featuredSkills}
        onSkillClick={handleProductClick}
        onAddToCart={handleAddToCart}
      />

      {/* Frequently Bought Together - Skill Bundles */}
      <FrequentlyBoughtTogetherSection
        bundles={skillBundles}
        onAddBundleToCart={handleAddBundleToCart}
      />

      {/* Product Details - About Developer */}
      <ProductDetailsSection
        highlights={developerHighlights}
        description="Passionate software engineer with a proven track record of delivering high-quality, scalable solutions. Experienced in leading teams, architecting complex systems, and mentoring junior developers."
      />

      {/* Technical Specifications */}
      <TechnicalSpecificationsSection
        skills={allSkills}
      />

      {/* Customer Reviews */}
      <CustomerReviewsSection
        reviews={allReviews}
      />

      {/* Customers Also Viewed - Projects and Experiences */}
      <CustomersAlsoViewedSection
        projects={featuredProjects}
        experiences={experiences}
        onProjectClick={handleProductClick}
        onAddToCart={handleAddToCart}
      />

      {/* Questions & Answers */}
      <QuestionsAndAnswersSection />

      {/* Easter Egg Section */}
      <EasterEggSection />

      {/* Subscribe Section */}
      <SubscribeSection
        onSubscribe={handleSubscribe}
      />
    </AmazonLayout>
  );
};

export default AmazonPortfolio;
