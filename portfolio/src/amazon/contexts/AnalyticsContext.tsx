/**
 * AnalyticsContext - Analytics tracking for Amazon-themed portfolio
 * 
 * Provides analytics functionality including:
 * - Page view tracking
 * - Modal open/close tracking
 * - Add to cart event tracking
 * - Form submission tracking
 * - Integration with Google Analytics 4 or Plausible
 * 
 * Requirements: 11.1, 11.2, 11.3, 11.4
 */

import { createContext, useContext, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

/**
 * Analytics event types
 */
export type AnalyticsEventType =
  | 'page_view'
  | 'modal_open'
  | 'modal_close'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'checkout_start'
  | 'form_submit'
  | 'search'
  | 'skill_view'
  | 'project_view';

/**
 * Analytics event data structure
 */
export interface AnalyticsEvent {
  /** Type of event */
  type: AnalyticsEventType;
  
  /** Timestamp when event occurred */
  timestamp: Date;
  
  /** Additional event properties */
  properties?: Record<string, unknown>;
}

/**
 * Analytics provider type (Google Analytics 4 or Plausible)
 */
export type AnalyticsProvider = 'ga4' | 'plausible' | 'none';

/**
 * Analytics context value interface
 */
interface AnalyticsContextValue {
  /** Track a page view */
  trackPageView: (path: string, title?: string) => void;
  
  /** Track a modal open event */
  trackModalOpen: (modalName: string, itemId?: string) => void;
  
  /** Track a modal close event */
  trackModalClose: (modalName: string) => void;
  
  /** Track an add to cart event */
  trackAddToCart: (itemId: string, itemType: 'skill' | 'project', itemTitle: string) => void;
  
  /** Track a remove from cart event */
  trackRemoveFromCart: (itemId: string) => void;
  
  /** Track checkout start */
  trackCheckoutStart: (itemCount: number) => void;
  
  /** Track form submission */
  trackFormSubmit: (formName: string, success: boolean, itemIds?: string[]) => void;
  
  /** Track search query */
  trackSearch: (query: string, resultCount: number) => void;
  
  /** Track skill detail view */
  trackSkillView: (skillId: string, skillName: string) => void;
  
  /** Track project detail view */
  trackProjectView: (projectId: string, projectName: string) => void;
  
  /** Get current analytics provider */
  provider: AnalyticsProvider;
}

/**
 * Analytics context
 */
const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(undefined);

/**
 * Detect which analytics provider is available
 */
function detectAnalyticsProvider(): AnalyticsProvider {
  // Check for Google Analytics 4 (gtag)
  if (typeof window !== 'undefined' && 'gtag' in window) {
    return 'ga4';
  }
  
  // Check for Plausible
  if (typeof window !== 'undefined' && 'plausible' in window) {
    return 'plausible';
  }
  
  return 'none';
}

/**
 * Send event to Google Analytics 4
 */
function sendToGA4(eventName: string, eventParams?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as any).gtag;
    gtag('event', eventName, eventParams);
  }
}

/**
 * Send event to Plausible
 */
function sendToPlausible(eventName: string, eventProps?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && 'plausible' in window) {
    const plausible = (window as any).plausible;
    plausible(eventName, { props: eventProps });
  }
}

/**
 * Log event to console in development
 */
function logEventToConsole(event: AnalyticsEvent): void {
  if (import.meta.env.DEV) {
    console.log('[Analytics]', event.type, event.properties);
  }
}

/**
 * AnalyticsProvider props
 */
interface AnalyticsProviderProps {
  children: ReactNode;
}

/**
 * AnalyticsProvider - Provides analytics context to children
 * 
 * Automatically detects available analytics provider (GA4 or Plausible)
 * and sends events to the appropriate service.
 */
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const provider = detectAnalyticsProvider();
  
  /**
   * Generic event tracking function
   */
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    // Log to console in development
    logEventToConsole(event);
    
    // Send to analytics provider
    const eventName = event.type;
    const eventData = {
      ...event.properties,
      timestamp: event.timestamp.toISOString(),
    };
    
    switch (provider) {
      case 'ga4':
        sendToGA4(eventName, eventData);
        break;
      case 'plausible':
        sendToPlausible(eventName, eventData);
        break;
      case 'none':
        // No analytics provider available, only console logging
        break;
    }
  }, [provider]);
  
  /**
   * Track page view
   * Requirements: 11.1
   */
  const trackPageView = useCallback((path: string, title?: string) => {
    trackEvent({
      type: 'page_view',
      timestamp: new Date(),
      properties: {
        page_path: path,
        page_title: title || document.title,
      },
    });
  }, [trackEvent]);
  
  /**
   * Track modal open
   * Requirements: 11.1
   */
  const trackModalOpen = useCallback((modalName: string, itemId?: string) => {
    trackEvent({
      type: 'modal_open',
      timestamp: new Date(),
      properties: {
        modal_name: modalName,
        item_id: itemId,
      },
    });
  }, [trackEvent]);
  
  /**
   * Track modal close
   * Requirements: 11.1
   */
  const trackModalClose = useCallback((modalName: string) => {
    trackEvent({
      type: 'modal_close',
      timestamp: new Date(),
      properties: {
        modal_name: modalName,
      },
    });
  }, [trackEvent]);
  
  /**
   * Track add to cart
   * Requirements: 11.2
   */
  const trackAddToCart = useCallback((
    itemId: string,
    itemType: 'skill' | 'project',
    itemTitle: string
  ) => {
    trackEvent({
      type: 'add_to_cart',
      timestamp: new Date(),
      properties: {
        item_id: itemId,
        item_type: itemType,
        item_title: itemTitle,
      },
    });
  }, [trackEvent]);
  
  /**
   * Track remove from cart
   * Requirements: 11.2
   */
  const trackRemoveFromCart = useCallback((itemId: string) => {
    trackEvent({
      type: 'remove_from_cart',
      timestamp: new Date(),
      properties: {
        item_id: itemId,
      },
    });
  }, [trackEvent]);
  
  /**
   * Track checkout start
   * Requirements: 11.3
   */
  const trackCheckoutStart = useCallback((itemCount: number) => {
    trackEvent({
      type: 'checkout_start',
      timestamp: new Date(),
      properties: {
        item_count: itemCount,
      },
    });
  }, [trackEvent]);
  
  /**
   * Track form submission
   * Requirements: 11.3
   */
  const trackFormSubmit = useCallback((
    formName: string,
    success: boolean,
    itemIds?: string[]
  ) => {
    trackEvent({
      type: 'form_submit',
      timestamp: new Date(),
      properties: {
        form_name: formName,
        success,
        item_ids: itemIds,
        item_count: itemIds?.length || 0,
      },
    });
  }, [trackEvent]);
  
  /**
   * Track search query
   * Requirements: 11.4
   */
  const trackSearch = useCallback((query: string, resultCount: number) => {
    trackEvent({
      type: 'search',
      timestamp: new Date(),
      properties: {
        search_query: query,
        result_count: resultCount,
      },
    });
  }, [trackEvent]);
  
  /**
   * Track skill detail view
   * Requirements: 11.1
   */
  const trackSkillView = useCallback((skillId: string, skillName: string) => {
    trackEvent({
      type: 'skill_view',
      timestamp: new Date(),
      properties: {
        skill_id: skillId,
        skill_name: skillName,
      },
    });
  }, [trackEvent]);
  
  /**
   * Track project detail view
   * Requirements: 11.1
   */
  const trackProjectView = useCallback((projectId: string, projectName: string) => {
    trackEvent({
      type: 'project_view',
      timestamp: new Date(),
      properties: {
        project_id: projectId,
        project_name: projectName,
      },
    });
  }, [trackEvent]);
  
  const value: AnalyticsContextValue = {
    trackPageView,
    trackModalOpen,
    trackModalClose,
    trackAddToCart,
    trackRemoveFromCart,
    trackCheckoutStart,
    trackFormSubmit,
    trackSearch,
    trackSkillView,
    trackProjectView,
    provider,
  };
  
  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

/**
 * useAnalytics hook - Access analytics context
 * 
 * @throws Error if used outside of AnalyticsProvider
 */
export function useAnalytics(): AnalyticsContextValue {
  const context = useContext(AnalyticsContext);
  
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  
  return context;
}

/**
 * Hook to automatically track page views on route changes
 * 
 * Usage:
 * ```tsx
 * function MyComponent() {
 *   usePageViewTracking('/amazon/skills');
 *   return <div>...</div>;
 * }
 * ```
 */
export function usePageViewTracking(path: string, title?: string): void {
  const { trackPageView } = useAnalytics();
  
  useEffect(() => {
    trackPageView(path, title);
  }, [path, title, trackPageView]);
}
