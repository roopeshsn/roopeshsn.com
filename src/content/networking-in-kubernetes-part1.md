---
title: A Kubernetes networking guide on Service types, Ingress resources, and Gateway API - Part 1
createdAt: 2024-04-07
updatedAt: 2024-04-07
category: kubernetes
summary: A short write-up on service types, ingress resources, and gateway API
tags: kubernetes
author: Roopesh Saravanan
---

Not only Kubernetes, but any workload that needs to be accessible from the external world, networking is crucial. In this first part of our series of bytes, we are going to look at ways of exposing a workload for external access in Kubernetes.

As you know, pods are ephimeral, meaning they can be created and destroyed to match the desired state. What if Kubernetes allows ingress traffic directly to a pod, and suddenly that pod disappears? Now Kubernetes doesn't know where to route the traffic.

Service in Kubernetes is an entry point that sits at the head of a pool of pods to route traffic. If a pod needs to be in a service pool, then it will be decided based on the 'selector' field.

## Service types

Service types are used when the pool of pods needs access from outside of your cluster.

- ClusterIP
- NodePort
- LoadBalancer
- ExternalName (Left this service type as it is not useful when it comes to exposing pods outside the cluster.)

Except for ClusterIP, all other service types are used to expose a service to an external IP address, so your pods are accessible from the Internet.

### ClusterIP

ClusterIP is the default service type in Kubernetes. It exposes the service within the cluster. The pods cannot be accessed outside the cluster.

### NodePort

- Exposes service to a specific port on all nodes in the cluster.
- NodePort is not preferable in production environments for multiple reasons. One of the reasons is that Kubernetes routes the incoming traffic to all nodes via a specific port, though your application is not running on the other cluster, which is a potential security risk.

### LoadBalancer

- As you might be aware, a load balancer does. People usually opt for a cloud load balancer, as load balancing will be taken care of by the cloud provider.
- Traffic will be routed to your cloud provider, and then it will reach your cluster. And no cloud provider will give access to these load balancers for free.
- You can deploy the load balancer locally using [MetalLB](https://metallb.universe.tf/).

## Ingress

By default, Kubernetes will map one service to a service type, be it NodePort or LoadBalancer. This means one load balancer will be mapped to a service, which increases costs, as if you have multiple services and then multiple load balancers.

What if one load balancer maps to multiple services with routing rules? By routing rules, I mean the load balancer should route `example.com\abc` to the `abc` service and `example.com\xyz` to the `xyz` service. Those applications can be implemented through Ingress.

The load balancer component is called an ingress controller, and to specify routing rules, we’ll create an ingress resource. As we saw in the service type of LoadBalancer, the controller is not part of the cluster. The only difference between the traditional load balancers and the ingress controller is that the ingress controller is designed to support Kubernetes workload and ingress resources.

## Gateway API

If you take a look at Kubernetes docs on Ingress, it is mentioned that new features are added to the Gateway API, which means the Gateway API is the successor to service types and Ingress. Before seeing what the Gateway API is capable of, we need to be clear about the main limitations of Ingress:

- Though rate limiting can be done at L7 (application layer), Ingress doesn't support it.
- Ingress supports only L7 protocols (HTTP and HTTPS). It won’t support other protocols, for example, L4 protocols (TCP and UDP).

Gateway API not only solves the above limitations but also supports role-based access control for ingress traffic rules and policies. We'll take a deep look at the Gateway API in the future write-up.

## References

- [Understanding Kubernetes services & ingress networking](https://www.cortex.io/post/understanding-kubernetes-services-ingress-networking)
- [Introducing ingress2gateway; Simplifying Upgrades to Gateway API](https://kubernetes.io/blog/2023/10/25/introducing-ingress2gateway/)
