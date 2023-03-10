import { StackProps, Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { Ton618Network } from './network/ton-618-network'
import { Ton618Db } from './db/ton-618-db'
import { Ton618App } from './app/ton-618-app'

export class Ton618 extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)
    const tonNetwork = new Ton618Network(this, 'Network')
    const tonDb = new Ton618Db(this, 'Db')
    const ton618App = new Ton618App(this, 'App', {
      vpc: tonNetwork.vpc,
      dynamoDbTable: tonDb.dynamoDbTable,
    })
  }
}
