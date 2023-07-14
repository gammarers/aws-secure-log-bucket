import { awscdk, javascript } from 'projen';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  cdkVersion: '2.61.0',
  defaultReleaseBranch: 'main',
  name: 'aws-secure-log-bucket',
  description: 'secure multiple transition phases in a single lifecycle policy bucket.',
  keywords: ['aws', 'cdk', 'aws-cdk', 's3', 'bucket', 'lifecycle', 'log'],
  projenrcTs: true,
  repositoryUrl: 'https://github.com/yicr/aws-secure-log-bucket.git',
  devDeps: [
    'aws-secure-bucket',
  ],
  peerDeps: [
    'aws-secure-bucket',
  ],
  releaseToNpm: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  minNodeVersion: '16.0.0',
  workflowNodeVersion: '16.19.1',
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.expressions(['0 18 * * *']),
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['yicr'],
  },
  publishToPypi: {
    distName: 'aws-secure-log-bucket',
    module: 'aws_secure_log_bucket',
  },
});
project.synth();