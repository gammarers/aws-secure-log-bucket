import { SecureBucket, SecureBucketProps } from '@gammarers/aws-secure-bucket';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface TransitionStep {
  readonly enabled?: boolean;
  readonly days?: number;
}

export interface LifecycleStorageClassTransition {
  readonly transitionStepInfrequentAccess?: TransitionStep;
  readonly transitionStepGlacier?: TransitionStep;
  readonly transitionStepDeepArchive?: TransitionStep;
}

export interface SecureLogBucketProps extends SecureBucketProps {
  readonly lifecycleStorageClassTransition?: LifecycleStorageClassTransition;
}

const TRANSITION_INFREQUENT_ACCESS_DEFAULT_DAYS: number = 400;
const TRANSITION_GLACIER_DEFAULT_DAYS: number = 720;
const TRANSITION_DEEP_ARCHIVE_DEFAULT_DAYS: number = 980;

export class SecureLogBucket extends SecureBucket {

  constructor(scope: Construct, id: string, props?: SecureLogBucketProps) {
    super(scope, id, {
      ...props,
      versioned: true,
      encryption: props?.encryption ?? s3.BucketEncryption.S3_MANAGED,
      lifecycleRules: (() => {
        const crateTransition = ((storageClass: s3.StorageClass, duration: number) => {
          return {
            storageClass: storageClass,
            transitionAfter: cdk.Duration.days(duration),
          };
        });
        const transitions: s3.Transition[] = [];
        // transition infrequent access
        if (props?.lifecycleStorageClassTransition?.transitionStepInfrequentAccess) {
          const transitionStep = props.lifecycleStorageClassTransition.transitionStepInfrequentAccess;
          if (transitionStep && (transitionStep?.enabled !== false)) {
            // enable & days?
            transitions.push(crateTransition(s3.StorageClass.INFREQUENT_ACCESS, transitionStep.days ?? TRANSITION_INFREQUENT_ACCESS_DEFAULT_DAYS));
          }
        } else {
          // default: 400 days
          transitions.push(crateTransition(s3.StorageClass.INFREQUENT_ACCESS, TRANSITION_INFREQUENT_ACCESS_DEFAULT_DAYS));
        }
        // transition glacier
        if (props?.lifecycleStorageClassTransition?.transitionStepGlacier) {
          const transitionStep = props.lifecycleStorageClassTransition.transitionStepGlacier;
          if (transitionStep && (transitionStep?.enabled !== false)) {
            // enable
            transitions.push(crateTransition(s3.StorageClass.GLACIER, transitionStep.days ?? TRANSITION_GLACIER_DEFAULT_DAYS));
          }
        } else {
          // default: 720 days
          transitions.push(crateTransition(s3.StorageClass.GLACIER, TRANSITION_GLACIER_DEFAULT_DAYS));
        }
        // transition deep archive
        if (props?.lifecycleStorageClassTransition?.transitionStepDeepArchive) {
          const transitionStep = props.lifecycleStorageClassTransition.transitionStepDeepArchive;
          if (transitionStep && (transitionStep?.enabled !== false)) {
            // enable
            transitions.push(crateTransition(s3.StorageClass.DEEP_ARCHIVE, transitionStep.days ?? TRANSITION_DEEP_ARCHIVE_DEFAULT_DAYS));
          }
        } else {
          // default: 980 days
          transitions.push(crateTransition(s3.StorageClass.DEEP_ARCHIVE, TRANSITION_DEEP_ARCHIVE_DEFAULT_DAYS));
        }

        if (transitions.length > 0) {
          const lifecycleRules: s3.LifecycleRule[] = [
            {
              id: 'archive-step-lifecycle-rule',
              enabled: true,
              transitions,
            },
          ];
          if (props?.lifecycleRules) {
            return lifecycleRules.concat(props.lifecycleRules);
          }
          return lifecycleRules;
        } else {
          if (props?.lifecycleRules) {
            return props.lifecycleRules;
          }
        }
        return undefined;
      })(),
    });
  }
}