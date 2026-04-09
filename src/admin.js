/**
 * ZAIDI YA MISULI — Admin Dashboard Logic
 * Handles auth, content CRUD, and analytics display.
 */
import './admin.css';
import './style.css';
import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// ─── DOM REFERENCES ─────────────────────────────────────────
const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const adminEmail = document.getElementById('admin-email');

// ─── AUTH ────────────────────────────────────────────────────
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginScreen.classList.add('hidden');
        dashboard.classList.remove('hidden');
        adminEmail.textContent = user.email;
        loadAllContent();
        loadAnalytics();
        initLucide();
    } else {
        loginScreen.classList.remove('hidden');
        dashboard.classList.add('hidden');
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    loginError.classList.add('hidden');

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        loginError.textContent = getAuthErrorMessage(error.code);
        loginError.classList.remove('hidden');
    }
});

logoutBtn.addEventListener('click', () => signOut(auth));

function getAuthErrorMessage(code) {
    const messages = {
        'auth/invalid-email': 'Invalid email address.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
    };
    return messages[code] || 'Login failed. Please try again.';
}

// ─── TABS ────────────────────────────────────────────────────
document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.editor-panel').forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const panelName = tab.dataset.page;
        document.querySelector(`[data-panel="${panelName}"]`).classList.add('active');
    });
});

// ─── CONTENT LOADING ─────────────────────────────────────────
async function loadAllContent() {
    await Promise.all([
        loadContent('home'),
        loadContent('about'),
        loadContent('pillars'),
        loadContent('resources'),
        loadContent('contact'),
    ]);
}

async function loadContent(page) {
    try {
        const docRef = doc(db, 'content', page);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return;
        const data = docSnap.data();

        switch (page) {
            case 'home':
                setVal('home-hero-title', data.heroTitle);
                setVal('home-hero-subtitle', data.heroSubtitle);
                setVal('home-hero-description', data.heroDescription);
                setVal('home-cta-text', data.ctaText);
                setVal('home-vision', data.vision);
                setVal('home-cta-title', data.ctaTitle);
                setVal('home-cta-description', data.ctaDescription);
                break;

            case 'about':
                setVal('about-history-1', data.history1);
                setVal('about-history-2', data.history2);
                setVal('about-history-3', data.history3);
                setVal('about-team1-name', data.team1Name);
                setVal('about-team1-title', data.team1Title);
                setVal('about-team1-bio', data.team1Bio);
                setVal('about-team1-linkedin', data.team1LinkedIn);
                setVal('about-team2-name', data.team2Name);
                setVal('about-team2-title', data.team2Title);
                setVal('about-team2-bio', data.team2Bio);
                setVal('about-team2-linkedin', data.team2LinkedIn);
                setVal('about-summary', data.summary);
                break;

            case 'pillars':
                setVal('pillars-quote', data.quote);
                setVal('pillar1-title', data.pillar1Title);
                setVal('pillar1-description', data.pillar1Description);
                setVal('pillar2-title', data.pillar2Title);
                setVal('pillar2-description', data.pillar2Description);
                setVal('pillar3-title', data.pillar3Title);
                setVal('pillar3-description', data.pillar3Description);
                break;

            case 'resources':
                if (data.items && Array.isArray(data.items)) {
                    renderResourceItems(data.items);
                }
                break;

            case 'contact':
                setVal('contact-welcome', data.welcome);
                setVal('contact-location', data.location);
                setVal('contact-email', data.email);
                setVal('contact-phone', data.phone);
                break;
        }
    } catch (error) {
        console.error(`Error loading ${page}:`, error);
    }
}

// ─── CONTENT SAVING ──────────────────────────────────────────
document.querySelectorAll('.save-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const page = btn.dataset.save;
        btn.classList.add('saving');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<div class="admin-spinner"></div> Saving...';

        try {
            const data = gatherData(page);
            await setDoc(doc(db, 'content', page), data, { merge: true });
            showToast(`${page.charAt(0).toUpperCase() + page.slice(1)} page saved!`);
            showStatus(page, '✓ Saved');
        } catch (error) {
            console.error('Save error:', error);
            showToast('Error saving. Please try again.', true);
        } finally {
            btn.classList.remove('saving');
            btn.innerHTML = originalHTML;
            initLucide();
        }
    });
});

function gatherData(page) {
    switch (page) {
        case 'home':
            return {
                heroTitle: getVal('home-hero-title'),
                heroSubtitle: getVal('home-hero-subtitle'),
                heroDescription: getVal('home-hero-description'),
                ctaText: getVal('home-cta-text'),
                vision: getVal('home-vision'),
                ctaTitle: getVal('home-cta-title'),
                ctaDescription: getVal('home-cta-description'),
                updatedAt: new Date().toISOString(),
            };
        case 'about':
            return {
                history1: getVal('about-history-1'),
                history2: getVal('about-history-2'),
                history3: getVal('about-history-3'),
                team1Name: getVal('about-team1-name'),
                team1Title: getVal('about-team1-title'),
                team1Bio: getVal('about-team1-bio'),
                team1LinkedIn: getVal('about-team1-linkedin'),
                team2Name: getVal('about-team2-name'),
                team2Title: getVal('about-team2-title'),
                team2Bio: getVal('about-team2-bio'),
                team2LinkedIn: getVal('about-team2-linkedin'),
                summary: getVal('about-summary'),
                updatedAt: new Date().toISOString(),
            };
        case 'pillars':
            return {
                quote: getVal('pillars-quote'),
                pillar1Title: getVal('pillar1-title'),
                pillar1Description: getVal('pillar1-description'),
                pillar2Title: getVal('pillar2-title'),
                pillar2Description: getVal('pillar2-description'),
                pillar3Title: getVal('pillar3-title'),
                pillar3Description: getVal('pillar3-description'),
                updatedAt: new Date().toISOString(),
            };
        case 'resources':
            return {
                items: gatherResources(),
                updatedAt: new Date().toISOString(),
            };
        case 'contact':
            return {
                welcome: getVal('contact-welcome'),
                location: getVal('contact-location'),
                email: getVal('contact-email'),
                phone: getVal('contact-phone'),
                updatedAt: new Date().toISOString(),
            };
        default:
            return {};
    }
}

// ─── RESOURCES DYNAMIC LIST ──────────────────────────────────
function renderResourceItems(items) {
    const container = document.getElementById('resources-list');
    container.innerHTML = '';

    items.forEach((item, idx) => {
        container.appendChild(createResourceElement(item, idx));
    });
    initLucide();
}

function createResourceElement(item = {}, idx) {
    const div = document.createElement('div');
    div.className = 'resource-item';
    div.dataset.index = idx;
    div.innerHTML = `
        <button class="delete-resource" title="Remove resource">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
        <div class="space-y-4">
            <div class="admin-field">
                <label>Title</label>
                <input type="text" class="res-title" value="${escapeHtml(item.title || '')}">
            </div>
            <div class="admin-field">
                <label>URL</label>
                <input type="url" class="res-url" value="${escapeHtml(item.url || '')}">
            </div>
            <div class="admin-field">
                <label>Category</label>
                <select class="res-category">
                    <option value="media" ${item.category === 'media' ? 'selected' : ''}>Media</option>
                    <option value="publication" ${item.category === 'publication' ? 'selected' : ''}>Publication</option>
                </select>
            </div>
            <div class="admin-field">
                <label>Description (optional)</label>
                <input type="text" class="res-description" value="${escapeHtml(item.description || '')}">
            </div>
        </div>
    `;

    div.querySelector('.delete-resource').addEventListener('click', () => {
        div.remove();
    });

    return div;
}

document.getElementById('add-resource-btn').addEventListener('click', () => {
    const container = document.getElementById('resources-list');
    const idx = container.children.length;
    container.appendChild(createResourceElement({}, idx));
    initLucide();
});

function gatherResources() {
    const items = [];
    document.querySelectorAll('.resource-item').forEach(el => {
        items.push({
            title: el.querySelector('.res-title').value,
            url: el.querySelector('.res-url').value,
            category: el.querySelector('.res-category').value,
            description: el.querySelector('.res-description').value,
        });
    });
    return items;
}

// ─── ANALYTICS ───────────────────────────────────────────────
async function loadAnalytics() {
    try {
        // Total views
        const totalSnap = await getDoc(doc(db, 'analytics', 'totals'));
        if (totalSnap.exists()) {
            const data = totalSnap.data();
            document.getElementById('stat-total-views').textContent =
                (data.totalViews || 0).toLocaleString();
            if (data.lastVisit) {
                const d = new Date(data.lastVisit);
                document.getElementById('stat-last-visit').textContent =
                    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            }
        }

        // Monthly views
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const monthSnap = await getDoc(doc(db, 'analytics', `month_${monthKey}`));
        if (monthSnap.exists()) {
            document.getElementById('stat-month-views').textContent =
                (monthSnap.data().totalViews || 0).toLocaleString();
        } else {
            document.getElementById('stat-month-views').textContent = '0';
        }
    } catch (error) {
        console.error('Analytics load error:', error);
    }
}

// ─── UTILITIES ───────────────────────────────────────────────
function setVal(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined) el.value = value;
}

function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/"/g, '&quot;');
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    toastText.textContent = message;
    toast.style.background = isError ? '#ef4444' : '#111111';
    toast.classList.remove('hidden');

    requestAnimationFrame(() => {
        toast.classList.add('visible');
    });

    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3000);
}

function showStatus(page, text) {
    const status = document.getElementById(`${page}-status`);
    if (status) {
        status.textContent = text;
        status.classList.add('visible');
        setTimeout(() => status.classList.remove('visible'), 3000);
    }
}

function initLucide() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Initialize icons on first load
document.addEventListener('DOMContentLoaded', initLucide);
