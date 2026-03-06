export const FieldStatus = {
  ACTIVE: 'ACTIVE',
  STALE: 'STALE',
  ERROR: 'ERROR',
  DISABLED: 'DISABLED',
} as const;
export type FieldStatus = (typeof FieldStatus)[keyof typeof FieldStatus];

export const PromotionStatus = {
  DRAFT: 'DRAFT',
  PROMOTED: 'PROMOTED',
} as const;
export type PromotionStatus = (typeof PromotionStatus)[keyof typeof PromotionStatus];
