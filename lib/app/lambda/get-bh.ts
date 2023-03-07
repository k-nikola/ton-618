import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
const client = new DynamoDB.DocumentClient()

export async function getBlackholes(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const getBh = await client
    .scan({ TableName: process.env.TABLE_NAME! })
    .promise()
    .then((res) => {
      const items = res.Items ? [...res.Items] : []
      return {
        statusCode: 200,
        body: JSON.stringify(items),
      }
    })
    .catch((err) => {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Error getting items from the DB',
          error: err,
        }),
      }
    })
  return getBh
}
