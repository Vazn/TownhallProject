import { fileURLToPath } from "url";
import path from "path";

export { __filename, __dirname };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//== REMINDER: Extending express-session to allow custom attributes
declare module "express-session" {
   export interface SessionData {
      authenticated :boolean;
      user: {
         pseudo :string,
         password :string,
      }
   }
}
