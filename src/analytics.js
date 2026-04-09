// Simple Page View Tracking with Firestore
import { db } from './firebase.js';
import { doc, setDoc, increment, getDoc } from 'firebase/firestore';

/**
 * Track a page view in Firestore.
 * Stores total views and monthly views.
 */
export async function trackPageView() {
    try {
        const page = window.location.pathname || '/';
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const dayKey = `${monthKey}-${String(now.getDate()).padStart(2, '0')}`;

        // Increment total page views
        const totalRef = doc(db, 'analytics', 'totals');
        await setDoc(totalRef, {
            totalViews: increment(1),
            [`pages.${page.replace(/\//g, '_') || 'home'}`]: increment(1),
            lastVisit: now.toISOString()
        }, { merge: true });

        // Increment monthly views
        const monthRef = doc(db, 'analytics', `month_${monthKey}`);
        await setDoc(monthRef, {
            totalViews: increment(1),
            [`pages.${page.replace(/\//g, '_') || 'home'}`]: increment(1),
            [`days.${dayKey}`]: increment(1),
            month: monthKey
        }, { merge: true });

    } catch (error) {
        // Silently fail - don't break the site for analytics
        console.warn('Analytics tracking failed:', error.message);
    }
}
