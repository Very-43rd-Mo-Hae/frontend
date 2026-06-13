export type RingColor = 'cyan' | 'green' | 'yellow';
export type RingSlotColor = RingColor;
export type RingSlots = readonly (RingSlotColor | null | undefined)[];

export const ringColorMap = {
  cyan: '#61dddd',
  green: '#74dc94',
  yellow: '#fee73d',
} as const;
