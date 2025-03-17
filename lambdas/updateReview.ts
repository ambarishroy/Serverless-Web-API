import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import Ajv from "ajv";
import {
  CookieMap,
  createPolicy,
  JwtToken,
  parseCookies,
  verifyToken,
} from "./utils";

const ajv = new Ajv();

const isValidUpdate = ajv.compile({
  type: "object",
  additionalProperties: false,
  properties: {
    Content: { type: "string" },
  },
  required: ["Content"]
});

const ddbDocClient = createDdbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
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
  try {
    const movieId = event.pathParameters?.movieId;
    const reviewId = event.pathParameters?.reviewId;
    const body = event.body ? JSON.parse(event.body) : undefined;

    if (!movieId || !reviewId) {
      return response(400, { message: "Missing path parameters" });
    }

    if (!body || !isValidUpdate(body)) {
      return response(400, {
        message: "Invalid input. Only 'Content' is updatable.",
        errors: isValidUpdate.errors,
      });
    }
    console.log("Body received:", body);
    console.log("Path Params:", movieId, reviewId);
    
    await ddbDocClient.send(
      new UpdateCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          movieId: Number(movieId),
          reviewId: Number(reviewId),
        },
        UpdateExpression: "SET Content = :content",
        ExpressionAttributeValues: {
          ":content": body.Content,
        },
      })
    );

    return response(200, { message: "Review content updated successfully" });
  } catch (error: any) {
    console.error("Update error:", error.message);
    return response(500, { error: error.message });
  }
};

function createDdbDocClient() {
  const client = new DynamoDBClient({ region: process.env.REGION });
  return DynamoDBDocumentClient.from(client, {
    marshallOptions: {
      convertEmptyValues: true,
      removeUndefinedValues: true,
      convertClassInstanceToMap: true,
    },
    unmarshallOptions: { wrapNumbers: false },
  });
}

function response(statusCode: number, body: any) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}
