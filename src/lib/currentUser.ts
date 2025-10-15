import { getToken } from "@/services/tokenService";
import { customJwtPayload } from "@/types/postAttributes";
import { jwtDecode } from "jwt-decode";

const jwtCookie = getToken();
export const decoded: customJwtPayload | null = jwtCookie
  ? (jwtDecode(jwtCookie) as customJwtPayload)
  : null;
