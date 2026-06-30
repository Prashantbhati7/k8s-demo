# Type of clusters

- ClusterIP(For Internal access)
- NodePort(To access the application on a particular port)
- LoadBalancer(To access the application on a domain name or IP address without using the port number)
- External (To use an external DNS for routing)


# Sample YAML for ClusterIP
ClusterIP is the default Service type.
It creates an IP that is only reachable inside the Kubernetes cluster.
```
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: ClusterIP  # Can be omitted as it is the default
  selector:
    app: backend  # Matches the labels on your target Pods
  ports:
    - protocol: TCP
      port: 80         # The port the service listens on inside the cluster
      targetPort: 8080 # The port the container is actually running on

```

# Nodeport
```
apiVersion: v1
kind: Service
metadata:
  name: nodeport-service
  labels:
    env: demo
spec:
  type: NodePort
  ports:
  - nodePort: 30001
    port: 80
    targetPort: 80
  selector:
    env: demo
```

# loadbalancer 
```
apiVersion: v1
kind: Service
metadata:
  name: lb-service
  labels:
    env: demo
spec:
  type: LoadBalancer
  ports:
  - port: 80
  selector:
    env: demo
```

# external name
```
apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: prod
spec:
  type: ExternalName
  externalName: my.api.example.com

```