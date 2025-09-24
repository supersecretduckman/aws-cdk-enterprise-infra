import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface LambdaApiProps {
  vpc: ec2.Vpc;
  bucket: s3.Bucket;
}

export class LambdaApi extends Construct {
  constructor(scope: Construct, id: string, props: LambdaApiProps) {
    super(scope, id);

    const lambdaFn = new lambda.Function(this, 'LambdaHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        BUCKET_NAME: props.bucket.bucketName,   // ✅ Set env var
      },
    });

    // ✅ Give Lambda permission to write to bucket
    props.bucket.grantReadWrite(lambdaFn);

    new apigateway.LambdaRestApi(this, 'ApiGateway', {
      handler: lambdaFn,
      proxy: true,
    });
  }
}
