import { aws_ec2 as ec2, Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'
export interface Ton618NetworkProps {}

export class Ton618Network extends Stack {
  vpc: ec2.Vpc
  constructor(scope: Construct, id: string, props?: Ton618NetworkProps) {
    super(scope, id)
    this.vpc = new ec2.Vpc(this, 'Ton618VPC', {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      natGateways: 0,
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: 'private-subnet-1',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
      ],
    })
    const dynamodbEndpoint = this.vpc.addGatewayEndpoint('DynamoDBEndpoint', {
      service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
      subnets: [{ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }],
    })
  }
}
