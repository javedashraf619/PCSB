// Whitelist (Allowed Domains) ki list
// Yahan sirf wo websites add karein jinhe allow karna hai.
// In ke ilawa baqi tamaam websites block ho jayengi.
const allowedDomains = [
    "tcpalookup.us",
    "redfin.com",
    "highprogrammer.com",
    "homes.com",
    "zillow.com",
    "chatgpt.com",
    "thatsthem.com",
    "fastpeoplesearch.com",
    "verifalia.com",
    "docs.google.com",
    "web.whatsapp.com",
    "merakisystem.com",
    "merakisystem.i5.tel",
    
    // Is k nichay saray link sirf spreedsheet ko allow krne k liye add kiye gyae hein
    "google.com",
    "docs.google.com",
    "drive.google.com",
    "sheets.google.com",
    "slides.google.com",
    "forms.google.com",
    "meet.google.com",
    "calendar.google.com",
    "mail.google.com",
    "accounts.google.com",
    "gstatic.com",
    "googleapis.com",
    "googleusercontent.com",
 

    // Mazeed websites yahan add kar sakte hain, misal ke tor par:
    // "github.com",
    // "office.com",
];

// Domain match karne ke liye helper function
function isDomainAllowed(hostname) {
    const cleanHost = hostname.toLowerCase();

    return allowedDomains.some(domain => {
        // Domain ko clean karein (https://, www, ya extra slash waghera remove karein)
        const cleanDomain = domain
            .toLowerCase()
            .trim()
            .replace(/^(https?:\/\/)?(www\.)?/, '')
            .replace(/\/.*$/, '');

        if (!cleanDomain) return false;

        // Exact match (jaise google.com) ya subdomain (jaise mail.google.com)
        return cleanHost === cleanDomain || cleanHost.endsWith('.' + cleanDomain);
    });
}

// Tab update hone par check karega
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const currentUrl = changeInfo.url || tab.url;
    if (!currentUrl) return;

    // Jab URL change ho ya page load ho raha ho
    if (changeInfo.status === 'loading' || changeInfo.url) {
        try {
            const url = new URL(currentUrl);

            // Sirf http aur https websites ko filter karein
            // Internal browser pages (chrome://, chrome-extension://, about:blank) ko allow rakhna zaroori hai
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                return;
            }

            const hostname = url.hostname;

            // Check karein ke kya URL allowed list mein hai
            const isAllowed = isDomainAllowed(hostname);

            if (!isAllowed) {
                // Agar website allowed list mein NAHI hai toh blocked.html par redirect kar dein
                chrome.tabs.update(tabId, {
                    url: chrome.runtime.getURL("blocked.html")
                }).catch(() => {
                    // Agar tab band ho gaya ho toh error ignore karein
                });
            }
        } catch (e) {
            console.error("Invalid URL:", currentUrl);
        }
    }
});