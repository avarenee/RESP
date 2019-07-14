import { AnonymousCredential } from "mongodb-stitch-browser-sdk";
import { stitchClient } from "./Database";

export function loginAnonymous() {
  const credential = new AnonymousCredential();
  return stitchClient.auth.loginWithCredential(credential);
}

export function hasLoggedInUser() {
  return stitchClient.auth.isLoggedIn;
}

export function getCurrentUser() {
  return stitchClient.auth.isLoggedIn ? stitchClient.auth.user : null;
}

export function logoutCurrentUser() {
  const user = getCurrentUser();
  return stitchClient.auth.logoutUserWithId(user.id);
}
