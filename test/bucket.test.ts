import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SecureLogBucket } from '../src';

describe('SecureLogBucket Testing', () => {

  describe('Normal SecureLogBucket Testing', () => {
    const stack = new Stack(new App(), 'TestingStack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    const bucket = new SecureLogBucket(stack, 'SecureLogBucket', {
      bucketName: 'example-log-bucket',
    });

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
                SSEAlgorithm: 'aws:kms',
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
              Id: 'ArchiveStepLifeCycle',
              Status: 'Enabled',
              Transitions: Match.arrayEquals([
                Match.objectEquals({
                  StorageClass: 'STANDARD_IA',
                  TransitionInDays: 60,
                }),
                Match.objectEquals({
                  StorageClass: 'INTELLIGENT_TIERING',
                  TransitionInDays: 120,
                }),
                Match.objectEquals({
                  StorageClass: 'GLACIER',
                  TransitionInDays: 180,
                }),
                Match.objectEquals({
                  StorageClass: 'DEEP_ARCHIVE',
                  TransitionInDays: 360,
                }),
              ]),
            }),
          ]),
        },
      });
    });

    it('Should match snapshot', () => {
      expect(template.toJSON()).toMatchSnapshot('normal-secure-log-bucket');
    });
  });

  describe('Full Props SecureLogBucket Testing', () => {
    const stack = new Stack(new App(), 'TestingStack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    const bucket = new SecureLogBucket(stack, 'SecureLogBucket', {
      bucketName: 'example-log-bucket',
      changeClassTransition: {
        infrequentAccessDays: 20,
        intelligentTieringDays: 40,
        glacierDays: 60,
        deepArchiveDays: 80,
      },
    });

    it('Is Bucket', () => {
      expect(bucket).toBeInstanceOf(s3.Bucket);
    });

    const template = Template.fromStack(stack);

    it('Should match lifecycle', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        LifecycleConfiguration: {
          Rules: Match.arrayEquals([
            Match.objectEquals({
              Id: 'ArchiveStepLifeCycle',
              Status: 'Enabled',
              Transitions: Match.arrayEquals([
                Match.objectEquals({
                  StorageClass: 'STANDARD_IA',
                  TransitionInDays: 20,
                }),
                Match.objectEquals({
                  StorageClass: 'INTELLIGENT_TIERING',
                  TransitionInDays: 40,
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
          ]),
        },
      });
    });

    it('Should match snapshot', () => {
      expect(template.toJSON()).toMatchSnapshot('full-props-secure-log-bucket');
    });

  });

  describe('Empty Props SecureLogBucket Testing', () => {
    const stack = new Stack(new App(), 'TestingStack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    const bucket = new SecureLogBucket(stack, 'SecureLogBucket');

    it('Is Bucket', () => {
      expect(bucket).toBeInstanceOf(s3.Bucket);
    });

    const template = Template.fromStack(stack);

    it('Should match snapshot', () => {
      expect(template.toJSON()).toMatchSnapshot('empty-props-secure-log-bucket');
    });

  });

});
