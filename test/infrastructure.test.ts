import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { InfrastructureStack } from '../lib/infrastructure-stack';

test('Stack contains VPC, S3, Lambda, and API Gateway with correct properties', () => {
  const app = new cdk.App();
  const stack = new InfrastructureStack(app, 'TestStack');

  const template = Template.fromStack(stack);

  // ✅ Check VPC exists
  template.hasResourceProperties('AWS::EC2::VPC', {});

  // ✅ Check S3 bucket exists with encryption
  template.hasResourceProperties('AWS::S3::Bucket', {
    BucketEncryption: {
      ServerSideEncryptionConfiguration: [
        {
          ServerSideEncryptionByDefault: {
            SSEAlgorithm: 'AES256',
          },
        },
      ],
    },
  });

  // ✅ Check Lambda function exists with Node.js 18 runtime
  template.hasResourceProperties('AWS::Lambda::Function', {
    Runtime: 'nodejs18.x',
  });

  // ✅ Check API Gateway exists
  template.hasResourceProperties('AWS::ApiGateway::RestApi', {});
});
