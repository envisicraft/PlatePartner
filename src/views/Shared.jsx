import React from 'react';
import { IconStar } from '../Icons';

export const PROMPT_HOME = "What are you in the mood for?\n- Ask for what I've eaten?\n- Ask what or where to eat?\n- Tap the camera to start a new pantry item...";
export const PROMPT_PANTRY = "Search your saved pantry card memories . A dish, food style, a restaurant, a city, or even a note like 'extra spicy.' Or tap the mic to just ask me!";
export const MASTER_CATEGORIES = [{ id: "American", subs: "Burgers, BBQ" }, { id: "Asian", subs: "Sushi, Ramen" }, { id: "Bakery", subs: "Bread, Pastry" }, { id: "Bar/Pub", subs: "Wings, Drinks" }, { id: "Breakfast/Brunch", subs: "Eggs, Coffee" }, { id: "Burger", subs: "Classic, Craft" }, { id: "Coffee/Tea", subs: "Cafe, Matcha" }, { id: "Dessert", subs: "Ice Cream, Cake" }, { id: "Fast Food", subs: "Drive-thru" }, { id: "French", subs: "Bistro, Crepes" }, { id: "Healthy", subs: "Salads, Bowls" }, { id: "Indian", subs: "Curry, Naan" }, { id: "Italian", subs: "Pizza, Pasta" }, { id: "Mediterranean", subs: "Greek, Hummus" }, { id: "Mexican", subs: "Tacos, Latin" }, { id: "Pizza", subs: "New York, Napo" }, { id: "Salad", subs: "Garden, Caesar" }, { id: "Seafood", subs: "Fish, Oysters" }, { id: "Steakhouse", subs: "Chops, Grill" }, { id: "Vegan/Veg", subs: "Plant-based" }].sort((a, b) => a.id.localeCompare(b.id));
export const CUISINE_MAP = { "American": "#3B82F6", "Italian": "#22C55E", "Mexican": "#EA580C", "Healthy": "#84CC16", "Asian": "#EF4444", "Seafood": "#06B6D4", "Burger": "#F97316", "Indian": "#D97706", "Fast Food": "#CA8A04", "Sandwiches": "#92400E", "Cafe & Dessert": "#EC4899", "Bakery": "#FBBF24", "Bar/Pub": "#7C3AED", "Breakfast/Brunch": "#FDE047", "Coffee/Tea": "#A8A29E", "Dessert": "#F472B6", "French": "#9333EA", "Mediterranean": "#14B8A6", "Pizza": "#B91C1C", "Salad": "#4ADE80", "Steakhouse": "#7F1D1D", "Vegan/Veg": "#10B981" };
export const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
export const PARCHMENT_BG = { backgroundColor: '#E8D4A9', backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")`, backgroundRepeat: 'repeat' };

/** Convert internal YYYY-MM-DD to display MM/DD/YYYY. Passes through 'Today', 'Yesterday', etc. */
export const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'Today' || dateStr === 'Yesterday') return dateStr || '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
};

/** Parse display MM/DD/YYYY back to internal YYYY-MM-DD */
export const parseDate = (displayStr) => {
    if (!displayStr) return '';
    const parts = displayStr.split('/');
    if (parts.length !== 3) return displayStr;
    return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
};

export const NumberedStar = ({ rating, value, onClick, size = 32 }) => {
    const isActive = value <= rating;
    const colors = ["#EF4444", "#F59E0B", "#F59E0B", "#22C55E", "#D4AF37"];
    const activeColor = colors[Math.min(rating - 1, 4)];
    return (<button onClick={() => onClick(value)} className={`relative flex items-center justify-center transition-all active:scale-90 ${isActive ? '' : 'text-black/10'}`} style={{ width: size, height: size, color: isActive ? activeColor : undefined }}><IconStar fill="currentColor" size={size} className="absolute" /><span className={`relative z-10 text-[10px] font-black ${isActive ? 'text-black/70' : 'text-black/30'}`}>{value}</span></button>);
};
