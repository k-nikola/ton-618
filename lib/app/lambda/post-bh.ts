import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import { v4 } from 'uuid'
const client = new DynamoDB.DocumentClient()

export async function postBlackhole(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        result: 'Invalid request.',
      }),
    }
  }
  const data = JSON.parse(event.body)
  const uuid = v4()
  const putBh = await client
    .put({
      TableName: process.env.TABLE_NAME!,
      Item: {
        id: uuid,
        ...data,
      },
    })
    .promise()
    .then((res) => {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `Success writing to DB`,
          data: data,
        }),
      }
    })
    .catch((err) => {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: `Failed writing to DB`,
          error: err,
        }),
      }
    })
  return putBh
}
