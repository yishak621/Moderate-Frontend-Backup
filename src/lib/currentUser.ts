import { getToken, getImpersonationToken } from "@/services/tokenService";
import { customJwtPayload } from "@/types/postAttributes";
import { jwtDecode } from "jwt-decode";

let impersonationToken: string | null = null;
try {
  impersonationToken = getImpersonationToken() as string | null;
} catch {
  impersonationToken = null;
}

const regularToken = getToken();
const activeToken = impersonationToken || regularToken;

export const decoded: customJwtPayload | null = activeToken
  ? (jwtDecode(activeToken) as customJwtPayload)
  : null;
