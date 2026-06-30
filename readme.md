# About Kubernetes Architecture 
kubernetes can have multiple cluster and Each cluster is completely independent.
Each cluster has:
- its own API Server
- its own etcd
- its own nodes
- its own networking
- its own DNS
Think of each cluster as a separate "mini cloud."

## Can Pods communicate across clusters?
ans : Not by default.
To communicate across clusters, we need additional infrastructure, such as:
- Multi-cluster service meshes (e.g., Istio)
- VPNs or private networking between clusters
- APIs exposed through ingress/load balancers
- Multi-cluster networking solutions like Submariner or Cilium Cluster Mesh

# Inside One Cluster
Cluster
├── Node 1
├── Node 2
├── Node 3

Nodes are just machines.
They may be
- Virtual Machines
- EC2 instances
- Azure VMs
- Bare metal servers

## Inside Nodes
Node1
  Pod A
  Pod B
  Pod C

Node2
  Pod D
  Pod E

Node3
  Pod F
Pods may live on different nodes.

### Can Pod A talk to Pod F?
Yes.
This is one of Kubernetes' biggest features.
Pod A can directly communicate with Pod F using Pod IP.

### But should we use Pod IP? 
No. **Why?**
Pods die.
Pod:10.244.1.8 Crash ->New Pod:10.244.1.20
IP changed.
Everything breaks.
**That's why Services exist.** 

## Namespace
Inside one cluster
Cluster
├── default
├── kube-system
├── monitoring
├── frontend
├── backend

A namespace is not a separate network.
It is mainly a logical isolation boundary for resources.
Pods in different namespaces are still on the same cluster network.

### Can Pods communicate across namespaces?
  Yes.
Nothing prevents
 - frontend namespace
from calling
 - backend namespace
**by IP.**
 Unless a NetworkPolicy blocks it.

### But again should we use IP ? 
NO ? then what we should use ? 
we can use fully qualified domain name to access the services in different namespaces 
``` <Service>.<Namespace>.svc.<ClusterDomain> ```

## Node communication
Nodes communicate with each other.
This is necessary because

Pod A
  - Node1
must reach

Pod B
 - Node2

The CNI (Container Network Interface) plugin handles this networking.
Popular CNI plugins include Calico, Cilium, and Flannel.

## communication matrics

| Source                              | Destination  | Possible?                                            | How |
| ----------------------------------- | ------------ | ---------------------------------------------------- | --- |
| Pod → Pod (same node)               | ✅            | Pod IP or Service                                    |     |
| Pod → Pod (different node)          | ✅            | Pod IP or Service                                    |     |
| Pod → Service (same namespace)      | ✅            | `service-name`                                       |     |
| Pod → Service (different namespace) | ✅            | `service.namespace` or FQDN                          |     |
| Service → Service                   | Indirectly   | Pods call Services                                   |     |
| Namespace → Namespace               | ✅            | No network isolation by default                      |     |
| Cluster → Cluster                   | ❌ by default | Needs VPN, service mesh, or multi-cluster networking |     |
| Internet → ClusterIP                | ❌            | Not exposed externally                               |     |
| Internet → NodePort                 | ✅            | `NodeIP:NodePort`                                    |     |
| Internet → LoadBalancer             | ✅            | External IP/DNS                                      |     |
| Internet → Ingress                  | ✅            | HTTP/HTTPS routing to Services                       |     |



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