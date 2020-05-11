#!/bin/sh
DEPLOYDIR="nest/k8s"
echo "Creating backups"
cp -f $DEPLOYDIR/aws-secret.yaml $DEPLOYDIR/aws-secret.yaml.backup
cp -f $DEPLOYDIR/env-secret.yaml $DEPLOYDIR/env-secret.yaml.backup
cp -f $DEPLOYDIR/env-configmap.yaml $DEPLOYDIR/env-configmap.yaml.backup

echo "Setting up files"
sed -i '' -e "s/___INSERT_AWS_CREDENTIALS_FILE__BASE64____/${AWS_CREDENTIALS}/g" $DEPLOYDIR/aws-secret.yaml
sed -i '' -e "s/___JWKS_URL___/${JWKS_URL_ENC}/g" $DEPLOYDIR/env-secret.yaml
sed -i '' -e "s/___INSERT_AWS_BUCKET___/${AWS_BUCKET}/g" $DEPLOYDIR/env-configmap.yaml
sed -i '' -e "s/___INSERT_AWS_PROFILE___/${AWS_PROFILE}/g" $DEPLOYDIR/env-configmap.yaml
sed -i '' -e "s/___INSERT_AWS_REGION___/${AWS_REGION}/g" $DEPLOYDIR/env-configmap.yaml
sed -i '' -e "s/___USER_TABLE_NAME___/${USER_TABLE_NAME}/g" $DEPLOYDIR/env-configmap.yaml
sed -i '' -e "s/___USER_TABLE_INDEX___/${USER_TABLE_INDEX}/g" $DEPLOYDIR/env-configmap.yaml
sed -i '' -e "s/___CONVERSATION_TABLE_NAME___/${CONVERSATION_TABLE_NAME}/g" $DEPLOYDIR/env-configmap.yaml
sed -i '' -e "s/___CONVERSATION_TABLE_UDATE_IDX___/${CONVERSATION_TABLE_UDATE_IDX}/g" $DEPLOYDIR/env-configmap.yaml
sed -i '' -e "s/___CONVERSATION_TABLE_CID_IDX___/${CONVERSATION_TABLE_CID_IDX}/g" $DEPLOYDIR/env-configmap.yaml
sed -i '' -e "s/___MESSAGE_TABLE_NAME___/${MESSAGE_TABLE_NAME}/g" $DEPLOYDIR/env-configmap.yaml
sed -i '' -e "s/___MESSAGE_TABLE_UDATE_IDX___/${MESSAGE_TABLE_UDATE_IDX}/g" $DEPLOYDIR/env-configmap.yaml
sed -i '' -e "s/___PORT___/${PORT}}/g" $DEPLOYDIR/env-configmap.yaml

echo "Deploying secrets"
kubectl delete secret env-secret
kubectl create -f $DEPLOYDIR/env-secret.yaml
kubectl delete secret aws-secret
kubectl create -f $DEPLOYDIR/aws-secret.yaml
echo "Deploying env"
kubectl delete configmap env-config 
kubectl create -f $DEPLOYDIR/env-configmap.yaml
echo "Deploying bill"
kubectl apply -f $DEPLOYDIR/nirop-bill-deployment.yaml
kubectl apply -f $DEPLOYDIR/nirop-bill-service.yaml
echo "Deploying keel"
kubectl apply -f $DEPLOYDIR/nirop-keel-deployment.yaml
kubectl apply -f $DEPLOYDIR/nirop-keel-service.yaml
echo "Deploying mantle"
kubectl apply -f $DEPLOYDIR/nirop-mantle-deployment.yaml
kubectl apply -f $DEPLOYDIR/nirop-mantle-service.yaml
echo "Deploying sing"
kubectl apply -f $DEPLOYDIR/nirop-sing-deployment.yaml
kubectl apply -f $DEPLOYDIR/nirop-sing-service.yaml
echo "Deploying crown"
kubectl apply -f $DEPLOYDIR/nirop-crown-deployment.yaml
kubectl apply -f $DEPLOYDIR/nirop-crown-service.yaml

echo "Cleaning up"
mv -f $DEPLOYDIR/aws-secret.yaml.backup $DEPLOYDIR/aws-secret.yaml
mv -f $DEPLOYDIR/env-secret.yaml.backup $DEPLOYDIR/env-secret.yaml
mv -f $DEPLOYDIR/env-configmap.yaml.backup $DEPLOYDIR/env-configmap.yaml