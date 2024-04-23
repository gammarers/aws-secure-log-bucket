import { awscdk, javascript } from 'projen';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  authorOrganization: true,
  cdkVersion: '2.80.0',
  constructsVersion: '10.0.5',
  jsiiVersion: '5.2.x',
  typescriptVersion: '5.2.x',
  defaultReleaseBranch: 'main',
  name: '@gammarers/aws-secure-log-bucket',
  description: 'secure multiple transition phases in a single lifecycle policy bucket.',
  keywords: ['aws', 'cdk', 'aws-cdk', 's3', 'bucket', 'lifecycle', 'log'],
  projenrcTs: true,
  repositoryUrl: 'https://github.com/gammarers/aws-secure-log-bucket.git',
  majorVersion: 1,
  deps: [
    '@gammarer/aws-secure-bucket@~1.1.0',
  ],
  peerDeps: [
    '@gammarer/aws-secure-bucket@~1.1.0',
  ],
  releaseToNpm: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  minNodeVersion: '16.0.0',
  workflowNodeVersion: '20.11.0',
  depsUpgrade: true,
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.expressions(['0 18 * * 0']), // // every sunday (JST/MON:03:00)
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['yicr'],
  },
  publishToPypi: {
    distName: 'gammarers.aws-secure-log-bucket',
    module: 'gammarers.aws_secure_log_bucket',
  },
  publishToNuget: {
    dotNetNamespace: 'Gammarers.CDK.AWS',
    packageId: 'Gammarers.CDK.AWS.SecureLogBucket',
  },
});
project.synth();