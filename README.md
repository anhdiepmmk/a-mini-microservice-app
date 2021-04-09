### Make deployment update image without edit yaml file.
```
kubectl rollout restart deployment/posts-depl
```
### Tell k8s do not pull image from internet (just use an image that existing on the local machine)
```
containers:
  - name: ...
    image: ...
    imagePullPolicy: Never <---
```