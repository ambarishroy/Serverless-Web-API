import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  CookieMap,
  createPolicy,
  JwtToken,
  parseCookies,
  verifyToken,
} from "./utils";

export const handler: APIGatewayProxyHandlerV2 = async function (event: any) {
  console.log("[EVENT]", JSON.stringify(event));
  const cookies: CookieMap = parseCookies(event);
  if (!cookies) {
    return {
      statusCode: 200,
      body: "Unauthorised request!!",
    };
  }

  const verifiedJwt: JwtToken = await verifyToken(
    cookies.token,
    process.env.USER_POOL_ID,
    process.env.REGION!
  );
  console.log(JSON.stringify(verifiedJwt));
  return {
    statusCode: 200,
    body: "You received a super secret!!",
  };
};
