import { SecureBucket, SecureBucketProps } from '@gammarers/aws-secure-bucket';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
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

export interface VPCFlowLog {
  readonly enable?: boolean;
  readonly bucketObjectKeyPrefix?: string[];
}

export enum SecureLogBucketType {
  NORMAL = 'normal',
  VPC_FLOW_LOG = 'vpc-flow-log',
}

// -- delivery.logs.amazonaws.com
// VPC Flow Logs
// Network Load Balancer (NLB) Access Logs
// Route 53 Resolver Query Logs
// AWS Network Firewall Logs
// Verified Access Logs
// VPC Lattice Access Logs
// Global Accelerator Flow Logs
// Site-to-Site VPN Logs

// logging.s3.amazonaws.com
// S3 Access Logs

// logs.<Region>.amazonaws.com
// CloudWatch Logs Export (CreateExportTask)

interface SecureBaseLogBucketProps extends SecureBucketProps {

  readonly lifecycleStorageClassTransition?: LifecycleStorageClassTransition;

  /**
   * @deprecated This property is deprecated. Use the bucketType property instead.
   */
  readonly vpcFlowLog?: VPCFlowLog;
}

export interface SecureNormalLogBucketProps extends SecureBaseLogBucketProps {

  /**
   * The type of the bucket.
   * @default SecureLogBucketType.NORMAL
   */
  readonly logBucketType?: SecureLogBucketType.NORMAL | undefined;
}

export interface SecureVpcFlowLogBucketProps extends SecureBaseLogBucketProps {
  /**
   * The type of the bucket.
   */
  readonly logBucketType: SecureLogBucketType.VPC_FLOW_LOG;
  /**
   * The prefix of the bucket object key.
   */
  readonly bucketObjectKeyPrefix?: string[];
}

export type SecureLogBucketProps = SecureNormalLogBucketProps | SecureVpcFlowLogBucketProps;

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
          const enabled = transitionStep.enabled ?? true;
          if (enabled) {
            // enable & days?
            transitions.push(crateTransition(s3.StorageClass.INFREQUENT_ACCESS, transitionStep.days || TRANSITION_INFREQUENT_ACCESS_DEFAULT_DAYS));
          }
        } else {
          // default: 400 days
          transitions.push(crateTransition(s3.StorageClass.INFREQUENT_ACCESS, TRANSITION_INFREQUENT_ACCESS_DEFAULT_DAYS));
        }
        // transition glacier
        if (props?.lifecycleStorageClassTransition?.transitionStepGlacier) {
          const transitionStep = props.lifecycleStorageClassTransition.transitionStepGlacier;
          const enabled = transitionStep.enabled ?? true;
          if (enabled) {
            // enable
            transitions.push(crateTransition(s3.StorageClass.GLACIER, transitionStep.days || TRANSITION_GLACIER_DEFAULT_DAYS));
          }
        } else {
          // default: 720 days
          transitions.push(crateTransition(s3.StorageClass.GLACIER, TRANSITION_GLACIER_DEFAULT_DAYS));
        }
        // transition deep archive
        if (props?.lifecycleStorageClassTransition?.transitionStepDeepArchive) {
          const transitionStep = props.lifecycleStorageClassTransition.transitionStepDeepArchive;
          const enabled = transitionStep.enabled ?? true;
          if (enabled) {
            // enable
            transitions.push(crateTransition(s3.StorageClass.DEEP_ARCHIVE, transitionStep.days || TRANSITION_DEEP_ARCHIVE_DEFAULT_DAYS));
          }
        } else {
          // default: 980 days
          transitions.push(crateTransition(s3.StorageClass.DEEP_ARCHIVE, TRANSITION_DEEP_ARCHIVE_DEFAULT_DAYS));
        }

        if (transitions.length > 0) {
          return [
            {
              id: 'archive-step-lifecycle-rule',
              enabled: true,
              transitions,
            },
            ...(props?.lifecycleRules || []),
          ];
        }
        return props?.lifecycleRules || [];
      })(),
    });

    // 👇 Get current account
    const account = cdk.Stack.of(this).account;

    if (props?.vpcFlowLog || props?.logBucketType === SecureLogBucketType.VPC_FLOW_LOG) {
      const enable = (() => {
        if (props?.logBucketType === SecureLogBucketType.VPC_FLOW_LOG) {
          return true;
        }
        return props?.vpcFlowLog?.enable ?? false;
      })();

      if (enable) {
        // 👇バケットACLアクセス権
        this.addToResourcePolicy(new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['s3:GetBucketAcl'],
          principals: [
            new iam.ServicePrincipal('delivery.logs.amazonaws.com'),
          ],
          resources: [this.bucketArn],
        }));

        // 👇バケット書き込みアクセス権
        this.addToResourcePolicy(new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['s3:PutObject'],
          principals: [
            new iam.ServicePrincipal('delivery.logs.amazonaws.com'),
          ],
          //resources: [`${this.bucketArn}/AWSLogs/${account}/*`],
          resources: (() => {
            const objectKeyPrefix = (() => {
              if (props?.vpcFlowLog) {
                return props.vpcFlowLog.bucketObjectKeyPrefix;
              }
              if (props?.logBucketType === SecureLogBucketType.VPC_FLOW_LOG) {
                return props.bucketObjectKeyPrefix;
              }
              return undefined;
            })();
            if (objectKeyPrefix) {
              const resources: Array<string> = [];
              for (const keyPrefix of objectKeyPrefix) {
                resources.push(`${this.bucketArn}/${keyPrefix}/AWSLogs/${account}/*`);
              }
              return resources;
            }
            return [`${this.bucketArn}/AWSLogs/${account}/*`];
          })(),
          conditions: {
            StringEquals: {
              's3:x-amz-acl': 'bucket-owner-full-control',
            },
          },
        }));
      }
    }
  }
}