import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SecureLogBucket } from '../src';

describe('SecureLogBucket Transition specific disable Testing', () => {

  const stack = new Stack(new App(), 'TestingStack');

  new SecureLogBucket(stack, 'SecureLogBucket', {
    bucketName: 'example-log-bucket',
    encryption: s3.BucketEncryption.KMS_MANAGED,
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

  const template = Template.fromStack(stack);

  it('Should not has lifecycle', () => {
    const resources = template.findResources('AWS::S3::Bucket');
    for (const resource of Object.values(resources)) {
      expect(resource.Properties).not.toHaveProperty('LifecycleConfiguration');
    }
  });

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });

});
