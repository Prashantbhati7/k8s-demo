In the same namespace recources can communicate using hostnames only 
but in different namespaces we can't communicate using the hostnames we either need ip or fully quealified domain name 
namespaces are isolated with each other 

check exisiting namespaces 

``` 
kubectl get namespace
kubectl get ns

kubectl get all --namespaces=<namespace-name>
kubectl get all -n <namespace-name>


````

Creating Namespace (Declarative Way)


``` 
apiVersion: v1
kind: Namespace 
metadata:
    name: demo-namespace

```

create pod/deployment in this namespace 
```
kubectl create deployment <deployment-name> --image=<image-link> --namespace=demo-namespace 
kubectl create deployment <deployment-name> --image=<image-link> -n demo-namespace
 
 // check 
 kubectl get deployment --namespace=demo-namespace
 kubectl get deploy -n demo-namespace

```


checking the communication of pods in different name space 
```
kubectl create deployment nginx-demo --image=nginx -n demo-namespace 
kubectl create deployment nginx-demo --image=nginx 

```
then get into the pod of demo-namespace
``` 
kubectl get pods -o wide -n demo-namespace     // copy the name and Ip of the pod
kubectl exec -it <pod-name> -- sh
 ```
similarly for pod of default namespace 
``` 
kubectl get pods             // copy the name and Ip of the pod
kubectl exec -it <pod-name> -- sh
```

The. in both try to communicate 
```
[demo namespace pod]# curl <ip-of-default-namespace-pod>
[default namespace pod]# cur <ip-of-demo-namespace-pod>

```
yess ! we are able to connect to pod with ip of the pod in differnt namespace 

create a service in both the namespace and try to access them using hostname 
```
kubectl expose deployment nginx-demo --name=demo-service --port=80 -n demo-namespace
kubectl expose deployment nginx-demo --name=default-service --port=80 
```


now in both the namespace's pod try to interact with services int another namespace 
```
[demo namespace pod]# curl default-service
[default namespace pod]# curl demo-service 
```

result: No we are not able to interact with the services in different namespace 

How can we interact then ? 

```
[demo namespace pod]# cat etc/resolve.config     // this file contain the fully qualified domain name to access the services in this namespace
search demo.svc.cluster.local svs.cluster.local cluster.local.nameserver <ip>
```
```
[default namespace pod]# cat etc/resolve.config     // this file contain the fully qualified domain name to access the services in this domain 
search default.svc.cluster.local svs.cluster.local cluster.local.nameserver <ip>
```
Now we can use this fully qualified domain name 
```
[demo namespace pod]# curl default-service.default.svc.cluster.local
[default namespace pod]# curl demo-service.demo.svc.cluster.local
```