#!/bin/sh
set -e

cd $(dirname "$0")

npm install
npm run build

cd cdk
npm install
npx tsc

cd ..

echo "Build complete. Run 'cd cdk && npx cdk deploy --require-approval never' to deploy to AWS."
