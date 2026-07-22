const DEVICE_ID_KEY = 'hl_device_id';
const RESONATED_LIES_KEY = 'hl_resonated_lies';

/**
 * Generates or retrieves the unique anonymous device ID.
 * Example format: LIAR-a1b2c3d4
 */
export const getDeviceId = (): string => {
  if (typeof window === 'undefined') return ''; // Prevent SSR errors

  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    // Generate a random 8-character hex string
    const randomHex = Math.random().toString(16).substring(2, 10);
    deviceId = `LIAR-${randomHex}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
};

/**
 * Retrieves the list of resonated lie IDs from local storage.
 */
export const getResonatedLies = (): string[] => {
  if (typeof window === 'undefined') return [];
  
  const saved = localStorage.getItem(RESONATED_LIES_KEY);
  if (!saved) return [];
  
  try {
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
};

/**
 * Adds a lie ID to the resonated list if it doesn't already exist.
 */
export const addResonatedLie = (lieId: string): void => {
  if (typeof window === 'undefined') return;

  const currentList = getResonatedLies();
  if (!currentList.includes(lieId)) {
    currentList.push(lieId);
    localStorage.setItem(RESONATED_LIES_KEY, JSON.stringify(currentList));
  }
};

/**
 * Checks if a lie has already been resonated by this device.
 */
export const hasResonated = (lieId: string): boolean => {
  const currentList = getResonatedLies();
  return currentList.includes(lieId);
};
