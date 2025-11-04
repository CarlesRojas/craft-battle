/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as combination from "../combination.js";
import type * as fight from "../fight.js";
import type * as game from "../game.js";
import type * as instance from "../instance.js";
import type * as invite from "../invite.js";
import type * as username from "../username.js";
import type * as word from "../word.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  combination: typeof combination;
  fight: typeof fight;
  game: typeof game;
  instance: typeof instance;
  invite: typeof invite;
  username: typeof username;
  word: typeof word;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
