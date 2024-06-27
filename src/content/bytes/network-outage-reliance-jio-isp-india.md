---
title: Network Outage at Reliance Jio ISP on June 18, 2024
createdAt: 2024-06-27
updatedAt: 2024-06-27
category: networking
summary: A short write-up on the recent network outage at Reliance Jio
tags: networking
author: Roopesh Saravanan
image: images/network-outage-jio/jio-bgp-data.png
---

Last week, on June 18, 2024, there was a network outage on Reliance Jio ISP. People who work from home rely heavily on uninterrupted internet service for business operations and are likely to be the most affected by this disruption.

From the data, the outage happened at 7:30 AM UTC, which is 1 PM IST, and the outage persists till 7 PM IST.

![AS55836 Dependencies Chart](/images/network-outage-jio/jio-bgp-data.png)

In the above image, the first plot is the AS Dependency chart. This chart is plotted with selected peers of Jio (AS55836), which means Jio is dependent on them for the routing of packets. In the AS dependency chart, 100% means a network is 100% dependent on the other peer all the time for routing. In our case, the Jio is dependent on AS64609 (the red line) 100% of the time. There is a drop in the percentage of the peer AS64609. Also, there is an increase in dependency on other peers (blue: AS4637; green: AS1299; grey: AS55410). The dependency will change under the following conditions:

- When the peer withdraws its advertised prefixes for a route or advertises new prefixes
- When the advertised routes of peers are down
- When there is a change in routing policies

In the above conditions, the BGP will recalculate the best path, which in turn changes the dependencies between peers.

To confirm what caused the outage, we need to look at another chart.

![AS55836 IODA Chart](/images/network-outage-jio/jio-ioda-data.png)

In the above chart, the orange line indicates the BGP prefixes advertised by Jio (AS55836), and the green line indicates a ping made to those advertised prefixes to confirm that they’re alive. This initiative is possible because of the Internet Intelligence Research Lab at Georgia Institute of Technology’s School of Computer Science's project, Internet Outage Detection and Analysis (IODA). As you can see, there is no change in advertised prefixes by Jio (orange line), but some of the advertised prefixes are not responding to the pings (green line), which is the cause.

If I am not mistaken, the root cause of the issue can’t be determined by outsiders as it requires manual inspection of raw BGP or traceroute data.

Reference: [Internet Health Report](https://ihr.iijlab.net/ihr/en/network/AS55836?af=4&last=3&date=2024-06-18&active=monitoring)
