// Barrel file strictly for backward compatibility across the app.
// New features should import directly from the respective service in `src/services/`.

export * from "./services/firebaseCore";
export * from "./services/userService";
export * from "./services/protocolService";
export * from "./services/sessionService";
export * from "./services/adminService";
