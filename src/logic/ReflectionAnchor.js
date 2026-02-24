/**
 * Project: Dining Architect - Master Spec v6.0
 * Logic: Daily Reflection Time Anchor
 * Requirement: Triggers Morning Whisper at defined Profile time.
 */

export const isReflectionWindowActive = (profile, lastReflectionDate) => {
    const now = new Date();
    const todayStr = now.toDateString();

    // 1. Double-Trigger Protection: Don't prompt twice in one day
    if (lastReflectionDate === todayStr) return false;

    // 2. Parse Profile Anchor (e.g., "08:30")
    const [hours, minutes] = profile.reflectionTime.split(':').map(Number);
    const anchor = new Date();
    anchor.setHours(hours, minutes, 0, 0);

    // 3. Apply the "1-hour delay" buffer if enabled in Profile
    if (profile.useBuffer) {
        anchor.setHours(anchor.getHours() + 1);
    }

    // 4. Silent Check: Is the current time past the calculated anchor?
    return now >= anchor;
};