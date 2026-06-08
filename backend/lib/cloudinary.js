import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// // Minimal, non-sensitive debug logging to verify env vars are loaded.
// // Do not log secrets. Remove these logs after debugging.
// try {
//   const cfg = cloudinary.config();
//   // Log only presence/length of key to avoid leaking secrets
//   // Example output: Cloudinary config: dgyfftzbb api_key=present
//   // eslint-disable-next-line no-console
//   console.log(
//     "Cloudinary config:",
//     cfg.cloud_name || "(no cloud_name)",
//     cfg.api_key ? "api_key=present" : "api_key=missing"
//   );
// } catch (e) {
//   // eslint-disable-next-line no-console
//   console.log("Cloudinary config read error:", e.message || e);
// }

export default cloudinary;
