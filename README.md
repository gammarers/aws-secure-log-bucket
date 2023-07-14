# AWS Secure Log Bucket

secure multiple transition phases in a single lifecycle policy bucket.

## Lifecycle rule

The storage class will be changed with the following lifecycle configuration.

| Storage Class       | Defaul transition after days | 
| ------------------- |------------------------------| 
| INFREQUENT_ACCESS   | 60 days                      | 
| INTELLIGENT_TIERING | 120 days                     | 
| GLACIER             | 180 days                     | 
| DEEP_ARCHIVE        | 360 days                     |

## Install

### TypeScript

```shell
npm install aws-secure-log-bucket
```
or
```shell
yarn add aws-secure-log-bucket
```

### Python

```shell
pip install aws-secure-log-bucket
```

## Example

```shell
npm install aws-secure-log-bucket
```

```typescript
import { SecureLogBucket } from 'aws-secure-log-bucket';

new SecureLogBucket(stack, 'SecureLogBucket');
```

## License

This project is licensed under the Apache-2.0 License.
