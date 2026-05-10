---
title: The BGP and WireGuard Experiment
createdAt: 2025-09-20
updatedAt: 2026-05-10
category: bgp, wireguard
summary: This byte discusses about BGP and WireGuard.
tags: bgp, wireguard
author: Roopesh Saravanan
image: none
---

It's a random thought: how can I create a BGP peering between my laptop and my friend's laptop where both the machines are behind CG-NAT? My broadband connection is from Airtel, and I am not sure what my friend's is using—never mind. 

In CG-NAT, a public IP address like 223.123.12.23 is shared by many broadband users. Because of this, unsolicited inbound connections usually fail unless the CG-NAT device already has a mapping for that connection.

For example, assume two users, A and B, want to communicate, and their shared public IPs are X and Y. A sends a TCP SYN packet to Y:1234. When the packet reaches B’s ISP CG-NAT router, the router does not know which customer behind Y should receive the packet, because many users share the same public IP.

To make this work, B must first create an outbound connection (or send some traffic) using port 1234. This causes B’s CG-NAT router to create a temporary mapping for Y:1234 to B’s internal private IP and port. Once this mapping exists, packets arriving for Y:1234 can be forwarded correctly to B.

This is why peer-to-peer communication behind CG-NAT is tricky and often requires techniques like hole punching, keepalives, or relay servers. 

Coming to the next part, our machines, Linux/macOS, won't have a BGP process by default. We can run the BGP daemon on our machines. Some of the popular ones that come with the BGP daemon are FRRouting, BIRD, and others. I ran FRRouting on top of a VM (created using Multipass) on my Mac. This is sorted.

In the BGP daemon configuration we need two configurations for the neighborship to form.
- Neighbor IP address with ASN
- Changing the default TTL, which is 1, so that the packet can be forwarded on the Internet routers

As said before, one peer should communicate the CG-NAT port number to the other peer in order for the neighborship to be successful. To mitigate this, we are forming VPN tunnels from the clients to the cloud VPS using WireGuard.

<!-- Answer the questions:
1. The problem of CG-NAT. Answered
2. Why we need cloud VPS? Answered
3. Why we need Wireguard Tunnels? Linked with question 1. -->

I used to think about and compare WireGuard with VXLAN. Wireguard and VXLAN are known as overlay encapsulation protocols, where the original frame will be encapsulated with another frame. The intermediate routers can only see the outer frame, not the inner frame. The tunnel endpoints (VTEPs in VXLAN terminology) can decapsulate the inner frame and bridge/route it.

## Setup

Setup in a nutshell
1. Setting up a cloud VPS
2. Setting up WireGuard on the clients and cloud VPS
3. Setting up FRRouting on Clients

### Cloud VPS

We can spin up a VPS with minimum available resources on any cloud VPS provider. There are good reviews on Linode and Vultr. I am using Linode for setting up a VPS. On Linode we can use the "Nanode 1 GB" plan from the "Shared CPU" category. Below is the summary of the resources that come with the Nanode plan.

```
Plan	Monthly	Hourly	RAM	CPUs	Storage	Transfer	Network In / Out
Nanode 1 GB	Nanode 1 GB  	$5	$0.0075	1 GB	1	25 GB	1 TB	40 Gbps / 1 Gbps
```

## Setting up WireGuard on the Clients and the VPS

1. Create a public and private key.

```
wg genkey | tee privatekey | wg pubkey > publickey
```

2. Create `wg0.conf` file to create the tunnel interface. The path is `/etc/wireguard/wg0.conf` meaning we need to create the `wg0.conf` file in the `/etc/wireguard` directory.

```
[Interface]
PrivateKey = yE790xX8JMFobo9EafDYu4ZQ+q0eADATLl1du8a9yWM=
Address = 10.0.0.10/24
ListenPort = 51820

[Peer]
PublicKey = LlKC4xwOJHlOetI7BLL+O4PUyEpYUHcFJA74RMzQpU8=
AllowedIPs = 10.0.0.1/32
```

In `AllowedIPs` field, we need to give the peer's tunnel interface address. If you are setting up in clients, the peer is the vps and vice versa. As other fields are self explanatory, I leave them to you.

To bring the tunnel interfaces up we can use the wg-quick utility tool. Refer the below commands,

```
sudo wg-quick down wg0
sudo wg-quick up wg0
```

Confirm the status of the tunnel interfaces using the command `wg` or `sudo wg`

<!-- We can also run the command `` to see the egress interface and next hop IP address. -->

## Setting up FRRouting

As I use Mac, I decided to install FRRouting on top of an Ubuntu VM. Spin up a VM using Multipass.

Install FRRouting by refering here: https://deb.frrouting.org/

Once FRRouting is installed, login to it using the command `vtysh`

Below are the required BGP configuration on the clients,

```
route-map ACCEPT-ALL permit 10
exit
!
router bgp <ASN>
 bgp router-id <ID>
 neighbor <NEIGHBOR_IP_ADDRESS> remote-as <NEIGHBOR_ASN>
 neighbor <NEIGHBOR_IP_ADDRESS> ebgp-multihop <TTL>
 !
 address-family ipv4 unicast
  neighbor <NEIGHBOR_IP_ADDRESS> route-map ACCEPT-ALL in
 exit-address-family
exit
```

```
root@localhost:~# ip route show
default via 172.232.112.1 dev eth0 proto static
10.0.0.0/24 dev wg0 proto kernel scope link src 10.0.0.10
100.100.100.1 dev wg0 scope link
172.232.112.0/24 dev eth0 proto kernel scope link src 172.232.112.230
```

```
root@localhost:~# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host noprefixroute
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether 22:00:e9:c9:72:04 brd ff:ff:ff:ff:ff:ff
    inet 172.232.112.230/24 brd 172.232.112.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 2600:3c08::2000:e9ff:fec9:7204/64 scope global dynamic mngtmpaddr noprefixroute
       valid_lft 5397sec preferred_lft 1797sec
    inet6 fe80::2000:e9ff:fec9:7204/64 scope link
       valid_lft forever preferred_lft forever
9: wg0: <POINTOPOINT,NOARP,UP,LOWER_UP> mtu 1420 qdisc noqueue state UNKNOWN group default qlen 1000
    link/none
    inet 10.0.0.10/24 scope global wg0
       valid_lft forever preferred_lft forever
```

Uncomment "net.ipv4.ip_forward=1" in "/etc/sysctl.conf"