export type SoundType = 'keyPress' | 'guess' | 'win' | 'lose' | 'error';

/**
 * Sound effects have been disabled as per user request.
 * This function is now a no-op.
 * @param type The type of sound to play.
 * @param isSoundEnabled A boolean flag from settings to control playback.
 */
export const playSound = (type: SoundType, isSoundEnabled: boolean) => {
  // Sounds are disabled.
};