import { savePlate, db } from './db';

export const INITIAL_MEALS = [
    { id: 'mock-1', userIds: ['JD', 'SM'], dish: 'TRUFFLE BURGER', place: 'THE GRILL', rating: 5, placeRating: 4, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300', date: '2026-02-23', primaryStyle: "American", notes: "Best burger in town.", petFriendly: false },
    { id: 'mock-2', userIds: ['JD'], dish: 'SPICY TUNA ROLL', place: 'SUSHI ZEN', rating: 4, placeRating: 3, img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=300', date: '2026-02-23', primaryStyle: "Asian", notes: "Very spicy!", petFriendly: false },
    { id: 'mock-3', userIds: ['SM'], dish: 'MARGHERITA PIZZA', place: 'NAPOLI BOYS', rating: 3, placeRating: 4, img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=300', date: '2026-02-22', primaryStyle: "Italian", notes: "", petFriendly: true },
    { id: 'mock-4', userIds: ['JD', 'SM'], dish: 'BRUNCH BOWL', place: 'EARLY BIRD CAFE', rating: 4, placeRating: 5, img: '', date: '2026-02-22', primaryStyle: "Healthy", notes: "", petFriendly: true },
    { id: 'mock-5', userIds: ['JD'], dish: 'STREET TACOS', place: 'EL CAMINO', rating: 5, placeRating: 4, img: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=300', date: '2026-02-21', primaryStyle: "Mexican", notes: "Secret menu item!", petFriendly: false },
    { id: 'mock-6', userIds: ['JD', 'SM'], dish: 'VEGAN ROLL', place: 'SUSHI ZEN', rating: 3, placeRating: 3, img: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=300', date: '2026-02-20', primaryStyle: "Vegan/Veg", notes: "Healthy!", petFriendly: false },
    { id: 'mock-7', userIds: ['JD'], dish: 'PORK BELLY BAO', place: 'NIGHT MARKET', rating: 5, placeRating: 4, img: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=300', date: '2026-02-19', primaryStyle: "Asian", notes: "Melt in your mouth.", petFriendly: true },
    { id: 'mock-8', userIds: ['SM'], dish: 'AVOCADO TOAST', place: 'CAFE FLORA', rating: 4, placeRating: 5, img: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&q=80&w=300', date: '2026-02-18', primaryStyle: "Breakfast/Brunch", notes: "", petFriendly: true },
    { id: 'mock-9', userIds: ['JD', 'SM'], dish: 'CHICKEN TIKKA', place: 'TAJ MAHAL', rating: 5, placeRating: 4, img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=300', date: '2026-02-17', primaryStyle: "Indian", notes: "Extra garlic naan.", petFriendly: false },
    { id: 'mock-10', userIds: ['JD'], dish: 'LOBSTER ROLL', place: 'Home', rating: 5, placeRating: null, img: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?auto=format&fit=crop&q=80&w=300', date: '2026-02-16', primaryStyle: "Seafood", notes: "", petFriendly: true },
    { id: 'mock-11', userIds: ['SM'], dish: 'PAD THAI', place: 'SMILE THAI', rating: 3, placeRating: 4, img: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&q=80&w=300', date: '2026-02-15', primaryStyle: "Asian", notes: "A bit too sweet.", petFriendly: false },
    { id: 'mock-12', userIds: ['JD', 'SM'], dish: 'FILET MIGNON', place: 'BOURBON STEAK', rating: 5, placeRating: 5, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=300', date: '2026-02-14', primaryStyle: "Steakhouse", notes: "Anniversary dinner!", petFriendly: false },
    { id: 'mock-13', userIds: ['JD'], dish: 'MATCHA LATTE', place: 'KINTSUGI', rating: 4, placeRating: 4, img: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&q=80&w=300', date: '2026-02-13', primaryStyle: "Coffee/Tea", notes: "Perfect microfoam.", petFriendly: true },
    { id: 'mock-14', userIds: ['SM'], dish: 'FALAFEL WRAP', place: 'OASIS', rating: 4, placeRating: 3, img: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&q=80&w=300', date: '2026-02-12', primaryStyle: "Mediterranean", notes: "Quick lunch.", petFriendly: false },
    { id: 'mock-15', userIds: ['JD', 'SM'], dish: 'CHOCOLATE CAKE', place: 'Home', rating: 4, placeRating: null, img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300', date: '2026-02-11', primaryStyle: "Dessert", notes: "So rich.", petFriendly: false },
    { id: 'mock-16', userIds: ['JD'], dish: 'BREAKFAST BURRITO', place: 'SUNRISE DINER', rating: 4, placeRating: 4, img: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=300', date: '2026-02-20', primaryStyle: "Mexican", notes: "Huge portion.", petFriendly: false },
    { id: 'mock-17', userIds: ['SM'], dish: 'ACAI BOWL', place: 'JUICE IT', rating: 5, placeRating: 5, img: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&q=80&w=300', date: '2026-02-20', primaryStyle: "Healthy", notes: "Refreshing.", petFriendly: true },
    { id: 'mock-18', userIds: ['JD', 'SM'], dish: 'GELATO', place: 'DOLCE VITA', rating: 5, placeRating: 5, img: '', date: '2026-02-20', primaryStyle: "Dessert", notes: "Pistachio!", petFriendly: false },
    { id: 'mock-19', userIds: ['JD'], dish: 'CLAM CHOWDER', place: 'SEASIDE SHACK', rating: 4, placeRating: 4, img: 'https://images.unsplash.com/photo-1548943487-a2e4142f36bc?auto=format&fit=crop&q=80&w=300', date: '2026-02-18', primaryStyle: "Seafood", notes: "Very creamy.", petFriendly: false },
    { id: 'mock-20', userIds: ['SM'], dish: 'ESPRESSO', place: 'DARK ROAST', rating: 5, placeRating: 5, img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=300', date: '2026-02-18', primaryStyle: "Coffee/Tea", notes: "Perfect pull.", petFriendly: false },
    { id: 'mock-21', userIds: ['JD', 'SM'], dish: 'PUPUSAS', place: 'EL RINCON', rating: 4, placeRating: 4, img: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&q=80&w=300', date: '2026-02-20', primaryStyle: "Mexican", notes: "First time.", petFriendly: true },
    { id: 'mock-22', userIds: ['SM'], dish: 'MAC AND CHEESE', place: 'THE DINER', rating: 3, placeRating: 3, img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=300', date: '2026-02-20', primaryStyle: "American", notes: "Too cheesy.", petFriendly: false }
];

export async function seedDatabase() {
    const count = await db.visit_logs.count();
    if (count < 23) {
        console.log("Seeding database with missing meals...");

        await db.visit_logs.clear();
        await db.dish_items.clear();
        await db.media_assets.clear();
        await db.locations.clear();

        for (let meal of INITIAL_MEALS) {
            await savePlate(meal);
        }

        // Let's also add 1 ghost log for testing
        await db.locations.put({ place_id: 'morningcafe', name: 'Morning Cafe', latitude: null, longitude: null });
        await db.visit_logs.put({
            visit_id: 'ghost-99',
            place_id: 'morningcafe',
            timestamp_in: Date.now() - 3600000,
            status: 'PENDING_POLISH',
            rating_score: 0,
            is_ghost: true,
            userIds: ['JD'],
            ui_date_string: '2026-02-24'
        });

        console.log("Seeding complete!");
    }
}
