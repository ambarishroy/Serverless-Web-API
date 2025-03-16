import { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const handler = async function (event: any) {
	return {
		statusCode: 200,
		body: 'Unauthenticated access allowed',
	};
};
