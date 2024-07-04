import { App, Duration, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SecureLogBucket } from '../src';

describe('SecureLogBucket Other Lifecycle & disable all Testing', () => {

  const stack = new Stack(new App(), 'TestingStack', {
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
  });

  const bucket = new SecureLogBucket(stack, 'SecureLogBucket', {
    bucketName: 'example-log-bucket',
    encryption: s3.BucketEncryption.KMS_MANAGED,
    lifecycleRules: [
      {
        id: 'delete-object-lifecycle-rule',
        enabled: true,
        expiration: Duration.days(990),
      },
    ],
    lifecycleStorageClassTransition: {
      transitionStepInfrequentAccess: {
        enabled: false,
      },
      transitionStepGlacier: {
        enabled: false,
      },
      transitionStepDeepArchive: {
        enabled: false,
      },
    },
  });

  it('Is Bucket', () => {
    expect(bucket).toBeInstanceOf(s3.Bucket);
  });

  const template = Template.fromStack(stack);

  it('Should match other lifecycle', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      LifecycleConfiguration: {
        Rules: Match.arrayEquals([
          Match.objectEquals({
            Id: 'delete-object-lifecycle-rule',
            Status: 'Enabled',
            ExpirationInDays: 990,
          }),
        ]),
      },
    });
  });

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });

});
