import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Networking } from './constructs/networking';
import { LambdaApi } from './constructs/lambda-api';
import { Storage } from './constructs/storage';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const networking = new Networking(this, 'Networking');
    const storage = new Storage(this, 'Storage');

    new LambdaApi(this, 'LambdaApi', {
      vpc: networking.vpc,
      bucket: storage.bucket,
    });
  }
}
