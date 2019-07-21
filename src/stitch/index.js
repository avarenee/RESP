import { stitchClient, db } from "./database";
import {
  loginAnonymous,
  logoutCurrentUser,
  hasLoggedInUser,
  getCurrentUser,
} from "./auth";

export { stitchClient, db };
export { loginAnonymous, logoutCurrentUser, hasLoggedInUser, getCurrentUser };
