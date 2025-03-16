import { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const handler : APIGatewayProxyHandlerV2  = async function (event: any) {
	return {
		statusCode: 200,
		body: 'You received a super secret!!',
	};
};
