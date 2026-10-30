
// ==========================================
// OFFICE SECURITY SHIELD
// Allowed Websites / Domain Whitelist
// ==========================================

const allowedDomains = [
    // Existing office websites
    "tcpalookup.us",
    "redfin.com",
    "highprogrammer.com",
    "homes.com",
    "zillow.com",
    "chatgpt.com",
    "thatsthem.com",
    "fastpeoplesearch.com",
    "verifalia.com",
    "web.whatsapp.com",
    "merakisystem.com",
    "merakisystem.i5.tel",

    // Google Workspace
    "docs.google.com",       // Docs, Sheets, Slides, Forms
    "drive.google.com",      // Google Drive
    "forms.gle",             // Google Forms short links
    "accounts.google.com"    // Google account login
];

// ==========================================
// CHECK ALLOWED DOMAIN
// ==========================================

function isDomainAllowed(hostname) {
    const cleanHost = hostname.toLowerCase().trim();

    return allowedDomains.some(domain => {
        const cleanDomain = domain.toLowerCase().trim();

        return (
            cleanHost === cleanDomain ||
            cleanHost.endsWith("." + cleanDomain)
        );
    });
}

// ==========================================
// TRACK AND CHECK TAB NAVIGATION
// ==========================================

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    const currentUrl = changeInfo.url || tab.url;

    if (!currentUrl) return;

    if (changeInfo.status === "loading" || changeInfo.url) {

        try {
            const url = new URL(currentUrl);

            // Allow browser internal pages
            if (
                url.protocol !== "http:" &&
                url.protocol !== "https:"
            ) {
                return;
            }

            const hostname = url.hostname;
            const isAllowed = isDomainAllowed(hostname);

            // Debug information
            console.log(
                "[Office Security Shield]",
                "URL:", currentUrl,
                "Hostname:", hostname,
                "Allowed:", isAllowed
            );

            // Block unauthorized websites
            if (!isAllowed) {

                console.warn(
                    "[Office Security Shield] Blocked:",
                    currentUrl
                );

                chrome.tabs.update(tabId, {
                    url: chrome.runtime.getURL("blocked.html")
                }).catch(() => {
                    // Ignore if tab is closed
                });
            }

        } catch (error) {
            console.error(
                "[Office Security Shield] Invalid URL:",
                currentUrl,
                error
            );
        }
    }
});
