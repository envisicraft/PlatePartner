/**
 * Project: Dining Architect - Master Spec v6.0
 * Assets: Global UI Constants & Styles
 */

export const Brand = {
    PANTRY_NAME: "Plate Pantry", // Official term for the vault
    PROJECT_NAME: "Dining Architect"
};

export const Icons = {
    STAR: "★",      // Rating DNA: 1-5 scale
    GHOST: "👻",    // Ghost Log for unpolished memories
    PENCIL: "✎",    // Pencil Icon for the Monthly Sweep drawer
    HISTORY: "🕒",  // Visible for quick "color balance" checks
    PANTRY: "🍽️",   // Digital Pantry access
    PLUS: "+"       // Manage The Table / Add Avatar
};

export const CuisineStyles = {
    ITALIAN: { label: "Italian", color: "#EF4444" },     // Red
    MEXICAN: { label: "Mexican", color: "#10B981" },     // Green
    JAPANESE: { label: "Japanese", color: "#F59E0B" },    // Amber
    CASUAL: { label: "Casual", color: "#6366F1" },       // Indigo (Vibe Inference)
    ATMOSPHERIC: { label: "Atmospheric", color: "#8B5CF6" }, // Violet (Vibe Inference)
    UNIVERSAL: { label: "Universal", color: "#94A3B8" }    // Slate
};

export const Avatars = [
    {
        id: 'user_01',
        name: 'JD',
        initials: 'JD',
        color: '#FDE68A',
        avoids: 'Peanuts, Shellfish',
        cautions: 'High Sodium'
    }, // Initials on parchment circles
    {
        id: 'user_02',
        name: 'Sarah',
        initials: 'SA',
        color: '#BFDBFE',
        avoids: 'Dairy',
        cautions: 'Celiac'
    }
];