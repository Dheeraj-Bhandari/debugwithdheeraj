import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - shared dependencies
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          
          // Amazon section - separate bundle
          'amazon-app': [
            './src/pages/AmazonPortfolio',
            './src/pages/ConfirmationPage',
          ],
          
          // Amazon components
          'amazon-components': [
            './src/components/amazon/AmazonHeader',
            './src/components/amazon/AmazonNavBar',
            './src/components/amazon/AmazonFooter',
            './src/components/amazon/ProductCard',
            './src/components/amazon/HeroSection',
            './src/components/amazon/TodaysDealsSection',
            './src/components/amazon/FrequentlyBoughtTogetherSection',
            './src/components/amazon/ProductDetailsSection',
            './src/components/amazon/TechnicalSpecificationsSection',
            './src/components/amazon/CustomerReviewsSection',
            './src/components/amazon/CustomersAlsoViewedSection',
            './src/components/amazon/QuestionsAndAnswersSection',
            './src/components/amazon/EasterEggSection',
            './src/components/amazon/SubscribeSection',
          ],
          
          // Amazon modals - lazy loaded
          'amazon-modals': [
            './src/components/amazon/Modal',
            './src/components/amazon/SkillDetailModal',
            './src/components/amazon/ProjectDetailModal',
            './src/components/amazon/CartSidebar',
            './src/components/amazon/CheckoutModal',
            './src/components/amazon/SearchOverlay',
          ],
          
          // Amazon contexts and utilities
          'amazon-lib': [
            './src/amazon/contexts/CartContext',
            './src/amazon/contexts/AnalyticsContext',
            './src/amazon/lib/AmazonPortfolioDataMapper',
            './src/amazon/lib/searchUtils',
            './src/amazon/lib/emailService',
            './src/amazon/lib/cacheUtils',
          ],
        },
      },
    },
  },
})


