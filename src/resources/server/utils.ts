import { ObjectId } from "mongodb";
import { NextApiResponse } from "next";

/* Function to convert HexString to ObjectId */
export function HextToObj(str: string) {
  return ObjectId.createFromHexString(str);
}

/* Function to convert ObjectId to HexString */
export function ObjToHex(obj: ObjectId) {
  return obj.toHexString();
}

type CookieProps = {
  HttpOnly?: boolean;
  Secure?: boolean;
  Path?: string;
  "Max-Age"?: number;
  SameSite?: "Lax" | "Strict" | "None";
};

export function setCookie(res: NextApiResponse, cookies: Record<string, unknown>, props?: CookieProps) {
  const cookieProps = Object.assign(
    {
      HttpOnly: true,
      Secure: true,
      Path: "/",
      "Max-Age": 3600,
      SameSite: "Lax",
    },
    props
  );

  const cookieString = Object.keys(cookies)
    .map((c) => {
      if (typeof cookies[c] === "boolean" && cookies[c]) {
        return c;
      }

      return `${c}=${cookies[c]}`;
    })
    .filter(Boolean);

  const propString = Object.keys(cookieProps)
    .map((c) => {
      if (typeof (cookieProps as Record<string, unknown>)[c] === "boolean") {
        if ((cookieProps as Record<string, unknown>)[c] === true) {
          return c;
        }
        return;
      }
      return `${c}=${(cookieProps as Record<string, unknown>)[c]}`;
    })
    .filter(Boolean);

  console.info("cookies:", [...cookieString, ...propString].join("; "));
  res.setHeader("Set-Cookie", [...cookieString, ...propString].join("; "));
}
