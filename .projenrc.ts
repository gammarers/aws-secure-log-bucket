import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  cdkVersion: '2.43.0',
  defaultReleaseBranch: 'main',
  name: '@yicr/secure-log-bucket',
  description: 'secure log bucket.',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/yicr/secure-log-bucket.git',
});
project.synth();