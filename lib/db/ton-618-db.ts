import { aws_dynamodb as dynamoDb, RemovalPolicy, Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'
interface Ton618DbProps {}

export class Ton618Db extends Stack {
  dynamoDbTable: dynamoDb.Table
  constructor(scope: Construct, id: string, props?: Ton618DbProps) {
    super(scope, id)
    this.dynamoDbTable = new dynamoDb.Table(this, 'Ton618Table', {
      partitionKey: {
        name: 'id',
        type: dynamoDb.AttributeType.STRING,
      },
      tableName: 'Ton618',
      removalPolicy: RemovalPolicy.DESTROY,
    })
  }
}
