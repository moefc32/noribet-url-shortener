const reserved = [
    '2fa',
    'about',
    'account',
    'admin',
    'administrator',
    'api',
    'assets',
    'auth',
    'billing',
    'callback',
    'confirm',
    'contact',
    'dashboard',
    'docs',
    'faq',
    'health',
    'help',
    'home',
    'index',
    'init',
    'legal',
    'login',
    'logout',
    'me',
    'metrics',
    'mfa',
    'privacy',
    'profile',
    'public',
    'register',
    'root',
    'security',
    'settings',
    'sitemap',
    'static',
    'subscribe',
    'support',
    'terms',
    'tos',
    'verify',
];

export default function isValidShortURL(input) {
    if (input === '') return true;

    const isAlphanumeric = /^[A-Za-z0-9]+$/.test(input);
    if (!isAlphanumeric) return false;

    return !reserved.includes(input.toLowerCase());
}