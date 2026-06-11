# overview 
    this node application stops the server (i.e kill the running process) when we req on /stop
    this is to test the self healing of k8s , how it works 

## steps 

1) push the image to dockerhub 
2) run following commands on terminal 
 ```  
  kubectl create deployment my-node-app --image=prashantbhati7/selfkillingnode:01
  kubectl get deployment
  kubectl get pods

  
   kubectl expose deployment my-node-app  --port=3000 --type=LoadBalancer
   minikube service my-node-app

   minikube dashboard
 ```

 ## observation 
  you will notice that on hitting /stop the process stop pod stops and retries again and the container got up and running again without any manual intervention , that's becasuse kubernetes is self healing.