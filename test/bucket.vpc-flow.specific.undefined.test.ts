import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SecureLogBucket } from '../src';

describe('SecureLogBucket VPC Flow Log specific disabled Testing', () => {

  const app = new App();
  const stack = new Stack(app, 'TestingStack');

  const bucket = new SecureLogBucket(stack, 'SecureFlowLogBucket', {
    vpcFlowLog: {},
  });

  it('Is Bucket', () => {
    expect(bucket).toBeInstanceOf(s3.Bucket);
  });

  const template = Template.fromStack(stack);

  it('Should not has does not contain "delivery.logs.amazonaws.com" Principal', () => {

    const policies = template.findResources('AWS::S3::BucketPolicy');

    for (const policy of Object.values(policies)) {
      const statements = policy.Properties?.PolicyDocument?.Statement || [];
      for (const statement of statements) {
        expect(statement.Principal?.Service).not.toBe('delivery.logs.amazonaws.com');
      }
    }
  });

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });

});