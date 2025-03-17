import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import Ajv from "ajv";
import schema from "../shared/types.schema.json";
import addFormats from "ajv-formats";
import {
  CookieMap,
  createPolicy,
  JwtToken,
  parseCookies,
  verifyToken,
} from "./utils";

const ajv = new Ajv();
addFormats(ajv);
const isValidReview = ajv.compile(schema.definitions["Review"] || {});
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
    console.log("[EVENT]", JSON.stringify(event));
    const body = event.body ? JSON.parse(event.body) : undefined;

    if (!body) {
      return {
        statusCode: 400,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ message: "Missing request body" }),
      };
    }

    if (!isValidReview(body)) {
      return {
        statusCode: 400,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          message: "Invalid review. Must match Review schema.",
          errors: isValidReview.errors,
        }),
      };
    }

    await ddbDocClient.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          movieId: body.movieId,
          reviewId: Date.now(),
          ReviewerId: body.ReviewerId,
          ReviewDate: body.ReviewDate,
          Content: body.Content,
        },
      })
    );

    return {
      statusCode: 201,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ message: "Review added successfully" }),
    };
  } catch (error: any) {
    console.error("Error adding review:", error.message);
    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};

function createDdbDocClient() {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });
  return DynamoDBDocumentClient.from(ddbClient, {
    marshallOptions: {
      convertEmptyValues: true,
      removeUndefinedValues: true,
      convertClassInstanceToMap: true,
    },
    unmarshallOptions: {
      wrapNumbers: false,
    },
  });
}
