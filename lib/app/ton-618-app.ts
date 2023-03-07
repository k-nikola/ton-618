import {
  aws_ec2 as ec2,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambda_nodejs,
  aws_dynamodb as dynamoDb,
  Duration,
  Stack,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as path from 'path'
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2-alpha'
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha'

export interface Ton618AppProps {
  vpc: ec2.Vpc
  dynamoDbTable: dynamoDb.Table
}

export class Ton618App extends Stack {
  constructor(scope: Construct, id: string, props: Ton618AppProps) {
    super(scope, id)
    // Lambda functions
    const postBlackholeLambda = new lambda_nodejs.NodejsFunction(
      this,
      'PostBlackholeLambda',
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        awsSdkConnectionReuse: true,
        entry: path.join(__dirname, 'lambda/post-bh.ts'),
        vpc: props.vpc,
        handler: 'postBlackhole',
        environment: {
          TABLE_NAME: props.dynamoDbTable.tableName,
        },
        timeout: Duration.seconds(10),
      }
    )
    const getBlackholeLambda = new lambda_nodejs.NodejsFunction(
      this,
      'GetBlackholeLambda',
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        awsSdkConnectionReuse: true,
        entry: path.join(__dirname, 'lambda/get-bh.ts'),
        vpc: props.vpc,
        handler: 'getBlackholes',
        environment: {
          TABLE_NAME: props.dynamoDbTable.tableName,
        },
        timeout: Duration.seconds(10),
      }
    )
    // Allow Lambdas to Read/Write to DB
    props.dynamoDbTable.grantReadData(getBlackholeLambda)
    props.dynamoDbTable.grantReadWriteData(postBlackholeLambda)

    // Create HTTP API Gateway
    const ton618ApiGateway = new apigwv2.HttpApi(this, 'Ton618ApiGateway')

    // Api Gateway routes
    ton618ApiGateway.addRoutes({
      path: '/blackholes',
      methods: [apigwv2.HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        'PostBlackholeRoute',
        postBlackholeLambda
      ),
    })

    ton618ApiGateway.addRoutes({
      path: '/blackholes',
      methods: [apigwv2.HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        'GetBlackholeRoute',
        getBlackholeLambda
      ),
    })
  }
}
