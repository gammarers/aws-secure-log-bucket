import { SecureBucket, SecureBucketEncryption } from '@yicr/secure-bucket';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface SecureLogBucketProps {
  readonly bucketName?: string;
}

export class SecureLogBucket extends SecureBucket {

  constructor(scope: Construct, id: string, props?: SecureLogBucketProps) {
    super(scope, id, {
      bucketName: props?.bucketName,
      encryption: SecureBucketEncryption.KMS_MANAGED,
    });

    // 👇Add Lifecycle rule.
    this.addLifecycleRule({
      id: 'ArchiveStepLifeCycle',
      enabled: true,
      transitions: [
        {
          storageClass: s3.StorageClass.INFREQUENT_ACCESS,
          transitionAfter: cdk.Duration.days(60),
        },
        {
          storageClass: s3.StorageClass.INTELLIGENT_TIERING,
          transitionAfter: cdk.Duration.days(120),
        },
        {
          storageClass: s3.StorageClass.GLACIER,
          transitionAfter: cdk.Duration.days(180),
        },
        {
          storageClass: s3.StorageClass.DEEP_ARCHIVE,
          transitionAfter: cdk.Duration.days(360),
        },
      ],
    });
  }
}