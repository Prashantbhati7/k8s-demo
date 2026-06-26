# commands of kubernetes 

# imperative 
## Basic(to start and create pods)
```
minikube start
minikube start —driver=docker      // default
minikube start —driver=ssh
minikube status 
minikube dashboard

kubectl run <pod-name> --name=<image-name/link>    // to create a pod
kubectl create deployment my-app —image=<image-name/link>     // create a deployment
kubectl create deployment my-nginx —image=nginx:latest

kubectl describe pod <pod-name>   // to know about pod (error ,status)

kubectl exec -it <pod-name> -- sh     // to. get into the pod 

kubectl explain pod                        
kubectl explain deployment
kubectl get deployment
kubectl get pods
kubectl get pods -o wide    // extended 
```
## create service to expose the port of the deployment 
```
kubectl expose deployment <deployment-name> —port=<port-at-with-application-inside-pod-container-listenting> 
example:
kubectl expose deployment my-nginx —port=80 --type=
kubectl get services
minikube service my-nginx       // to tell minikube about service created 

minikube delete
kubectl delete pod <pod-name>
kubectl delete deployment my-nginx 

kubectl logs <pod-name> 

kubectl describe pods

```

## command to execute and make pod using yaml file 
``` kubectl create -f pod.yml ```
``` kubectl apply -f pod.yml ```


# declarative 

## basic structure 
```
apiVersion:      # This tells Kubernetes which API should handle this object.
kind:       # What are you creating?
metadata:   # Information about the object.
spec:   # It describes what you want.
```

example :-
## pod
```
apiVersion: v1
kind: Pod

metadata:
  name: nginx-pod
  labels:     # label for pod
    env:demo
    type:frontend
spec:
  containers:
    - name: nginx      # there could be multiple container inside pod that's why - 
      image: nginx
      ports:
        - containerPort: 80

```
equivalent to 
Create a Pod named nginx-pod.
Inside it, run one container called nginx using the nginx image and expose port 80.

## Deployment 
```
apiVersion: apps/v1
kind: Deployment

metadata:
  name: nginx-deployment

spec:
  replicas: 3        # I always want 3 Pods running.

  selector:         # tells deployment Manage every Pod whose label is: nginx
    matchLabels:    
      app: nginx

  template:  #The Deployment creates Pods. So it needs a Pod blueprint. That's exactly what template is.

    metadata:
      labels:     # labels of the pods
        app: nginx

    spec:       # inside the pod what you want 
      containers:
        - name: nginx
          image: nginx
```


## service.yml
why ?
Pods get new IP addresses if recreated.
Instead of talking directly to Pods, you create a Service.

```
apiVersion: v1
kind: Service

metadata:
  name: nginx-service

spec:
  selector:
    app: nginx

  ports:
    - port: 80   
      targetPort: 80

  type: NodePort

```

equivalent to - find every pod whose label is app=nginx,and expose port 80.