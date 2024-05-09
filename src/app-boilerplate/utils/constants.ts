// Shorthand
export type Page = keyof typeof Pages;
// Alternative
// export type Page = (typeof Pages)[keyof typeof Pages];

export const Pages = {
  FORM: "FORM",
  CONFIRMATION: "CONFIRMATION",
  COMPLETED: "COMPLETED",
} as const;