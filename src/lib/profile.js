export const ACTIVITY_TYPES = ['walk', 'feed', 'bath', 'play'];

export function areSchedulesComplete(additional) {
  const a = additional || {};
  return (
    a.feed && Object.values(a.feed).length > 0 &&
    a.play && Object.values(a.play).length > 0 &&
    a.walk && Object.values(a.walk).length > 0 &&
    a.bath && Object.values(a.bath).length > 0
  );
}

export function isBasicInfoComplete(petInfo) {
  return Boolean(petInfo?.basic?.name);
}

export function getOnboardingStatus(petInfo) {
  if (!petInfo?.basic?.type) return 'needs_type';
  if (!isBasicInfoComplete(petInfo)) return 'needs_basic';
  if (!areSchedulesComplete(petInfo?.additional)) return 'needs_schedules';
  return 'complete';
}

