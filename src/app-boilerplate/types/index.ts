import { Pages } from "../utils/constants";

// Shorthand
export type Page = keyof typeof Pages;
// Alternative
// type Page = (typeof Pages)[keyof typeof Pages];
