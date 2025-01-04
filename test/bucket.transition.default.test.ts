import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SecureLogBucket } from '../src';

describe('SecureLogBucket default Testing', () => {

  const stack = new Stack(new App(), 'TestingStack');

  const bucket = new SecureLogBucket(stack, 'SecureLogBucket');

  it('Is Bucket', () => {
    expect(bucket).toBeInstanceOf(s3.Bucket);
  });

  const template = Template.fromStack(stack);

  it('Should have encryption', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketEncryption: Match.objectEquals({
        ServerSideEncryptionConfiguration: [
          {
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: 'AES256',
            },
          },
        ],
      }),
    });
  });

  it('Should versioning enabled', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      VersioningConfiguration: Match.objectEquals({
        Status: 'Enabled',
      }),
    });
  });

  it('Should exist lifecycle', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      LifecycleConfiguration: {
        Rules: Match.arrayEquals([
          Match.objectEquals({
            Id: 'archive-step-lifecycle-rule',
            Status: 'Enabled',
            Transitions: Match.arrayEquals([
              Match.objectEquals({
                StorageClass: 'STANDARD_IA',
                TransitionInDays: 400,
              }),
              Match.objectEquals({
                StorageClass: 'GLACIER',
                TransitionInDays: 720,
              }),
              Match.objectEquals({
                StorageClass: 'DEEP_ARCHIVE',
                TransitionInDays: 980,
              }),
            ]),
          }),
        ]),
      },
    });
  });

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });

});
