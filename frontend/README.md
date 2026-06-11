# used commands for Kubernetes 

Kubernetes
```
minikube start
minikube start —driver=docker      // default
minikube start —driver=ssh
minikube status 
minikube dashboard


kubectl create deployment my-app —image=<image-name/link>
kubectl create deployment my-nginx —image=nginx:latest

kubectl get deployment
kubectl get pods
```
# create service to expose the port of the deployment 
```
kubectl expose deployment <deployment-name> —port=<port-at-with-application-inside-pod-container-listenting> 

kubectl expose deployment my-nginx —port=80 --type=
kubectl get services
```

// create image -> push to docker hub 
// create deployment -> pull image from docker hub 
// create expose service  -> to expose the ports of the pods 

```
minikube service my-nginx       // to tell minikube about service created 

minikube delete

kubectl delete deployment my-nginx 

kubectl logs <pod-name> 

kubectl describe pods
```

## RollOut- updating the application with zero downtime 

```
kubectl set image deployment <deployment-name> <container-name-inside-pod>=<image-name/link>


kubectl get pods
```

### More about zero downtime
     then check pods and see that until this pod container is not up previous keeps running.
     You will see that untill the new image is being pulled and container is not up the previous container remain running and then when the new image is ready and up . 
     the previous get deleted and new image is set into the container in the given pod

### what if we gave wrong image to set ?

    in that case k8s will show image update and in backgroud start pulling the image till now previous image is still up and running then if it doesn't find a valid image k8s does ImagePullBackOff . then we can do rollout 


## Rollback 
    // shows the status of the rollout 
    ```kubectl rollout status deployment <deployment-name>  // this will show waiting to finish ,and old replicas are pending termination ```
    // to rollback we need to undo rollout 
 
    ```kubectl rollout undo deployment <deployment-name>```

