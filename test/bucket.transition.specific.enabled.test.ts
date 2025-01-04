import { App, Duration, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SecureLogBucket } from '../src';

describe('SecureLogBucket specific transition enabled true Testing', () => {

  const stack = new Stack(new App(), 'TestingStack');

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
        enabled: true,
        days: 20,
      },
      transitionStepGlacier: {
        enabled: true,
        days: 60,
      },
      transitionStepDeepArchive: {
        enabled: true,
        days: 80,
      },
    },
  });

  it('Is Bucket', () => {
    expect(bucket).toBeInstanceOf(s3.Bucket);
  });

  const template = Template.fromStack(stack);

  it('Should have specific encryption', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketEncryption: Match.objectEquals({
        ServerSideEncryptionConfiguration: [
          {
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: 'aws:kms',
            },
          },
        ],
      }),
    });
  });

  it('Should match specific lifecycle & other lifecycle', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      LifecycleConfiguration: {
        Rules: Match.arrayEquals([
          Match.objectEquals({
            Id: 'archive-step-lifecycle-rule',
            Status: 'Enabled',
            Transitions: Match.arrayEquals([
              Match.objectEquals({
                StorageClass: 'STANDARD_IA',
                TransitionInDays: 20,
              }),
              Match.objectEquals({
                StorageClass: 'GLACIER',
                TransitionInDays: 60,
              }),
              Match.objectEquals({
                StorageClass: 'DEEP_ARCHIVE',
                TransitionInDays: 80,
              }),
            ]),
          }),
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
