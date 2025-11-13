/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as bingo from "../bingo.js";
import type * as classic from "../classic.js";
import type * as combination from "../combination.js";
import type * as crons from "../crons.js";
import type * as instance from "../instance.js";
import type * as inviteBingo from "../inviteBingo.js";
import type * as searchingOpponent from "../searchingOpponent.js";
import type * as username from "../username.js";
import type * as word from "../word.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  bingo: typeof bingo;
  classic: typeof classic;
  combination: typeof combination;
  crons: typeof crons;
  instance: typeof instance;
  inviteBingo: typeof inviteBingo;
  searchingOpponent: typeof searchingOpponent;
  username: typeof username;
  word: typeof word;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
