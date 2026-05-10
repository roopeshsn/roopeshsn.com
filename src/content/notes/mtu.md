---
title: MTU
createdAt: 2025-12-24
updatedAt: 2026-05-10
category: time, ptp
summary: This note discusses about MTU
tags: mtu
author: Roopesh Saravanan
image: none
---

MTU is a sum of both Header and Payload

## L2 Interface MTU - Switchport (either trunk or access):

Default Ethernet MTU will be 9236 bytes

9236 = SMAC (6) + DMAC (6) + VLAN Tag (4) + Ethertype (2) + CRC (4)
9236 - (6 + 6 + 4 + 2 + 4) = 9236 - 22 = 9214 bytes

**So Ethernet Header is 22 bytes and payload is 9214 bytes.**

## L3 Interface MTU:

The default L3 MTU  is 1500 bytes but varies between 68 to 9214 bytes.

L3 header ranges between 20 bytes to 60 bytes depending upon IPv4 and IPv6

For IPv4:
1500 = SIP (4) + DIP (4) + Checksum (2) + Version (1/2) + IHL (1/2) + ToS/DSCP (1) + Total Length (2) + Identification (2) + Flags (3 bits) + TTL (1) + Fragment offset (13 bits) + Protocol (1) + Options (variable up to 40 bytes) | Padding (variable)

For IPv6:
Will be updated.

**So the IPv4 header will be 20 bytes and payload will be 1480 bytes.**

L3 MTU cannot be higher than L2 MTU.

Say if a L2 MTU is 9236 bytes and L3 MTU is 1500 bytes and the L3 packet is higher than 1500 say 2000 bytes then the packet will be fragmented as 1480 and 520 bytes. Note I did not include headers.

And if the L3 packet is wrapped with L2 headers (considering without VLAN tag, 18 bytes), then the total frame or L2 packet size will be 1518 bytes.

On the wire the actual bytes will be 1538.

1538 = Preamble (7) + Start delimiter (1) + Ethernet frame (1518) + Inter-frame gap (12)
