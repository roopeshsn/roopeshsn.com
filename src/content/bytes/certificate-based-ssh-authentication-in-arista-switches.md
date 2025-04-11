---
title: Certificate based SSH Authentication in Arista Switches
createdAt: 2025-04-11
updatedAt: 2025-04-11
category: ssh, certificates, arista
summary: This byte discusses certificate-based ssh authentication in Arista switches.
tags: ssh, certificates, openssl, linux, arista
author: Roopesh Saravanan
image: none
---

In the last byte, we discussed certificate-based authentication for EAPI connections. In this byte, we're going to do the same, but this time for SSH. Think how cool it would be if we pass a certificate instead of entering a username and password. This is what we're exactly going to do today.

In certificate-based authentication, there are three entities involved: the Client, the Server, a.k.a. the switch, and the Certificate Authority (CA). To learn more about them, refer to my [last byte](https://roopeshsn.com/bytes/certificate-based-authentication-for-eapi-connections-in-arista-switches).

Before moving forward, here's the author information about "ssh" client application that we use for remote login:

> OpenSSH is a derivative of the original and free ssh 1.2.12 release by Tatu Ylonen. Aaron Campbell, Bob Beck, Markus Friedl, Niels Provos, Theo de Raadt and Dug Song removed many bugs, re-added newer features and created OpenSSH. Markus Friedl contributed the support for SSH protocol versions 1.5 and 2.0.

Ref: https://man.openbsd.org/ssh#AUTHORS

What are we going to configure (in short)?
- Create a CA key pair
- Create Keys in Switch (already have one under management ssh hostkey)
- Sign the Switch’s public key with CA’s private key - Certificate Signing Request (CSR)
- Create a key pair in the Client
- Sign the Client's public key with CA’s private key - CSR

Let’s see how to generate keys and certificates. For testing purposes, let’s consider the Switch itself a CA, too, meaning we'll create a CA key pair in the Switch.

## Switch Configuration

The below command will create a CA public and private key pair,

```
Switch#bash ssh-keygen -f /etc/ssh/ca
Generating public/private rsa key pair.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /etc/ssh/ca.
Your public key has been saved in /etc/ssh/ca.pub.
The key fingerprint is:
SHA256:bqZM/Y2ac2y8HlDg3UtBo4oi0givcmWJTLdx0bNaVIE root@Switch
The key's randomart image is:
+---[RSA 2048]----+
|      ...ooo+    |
|       oEo o o   |
|. . o ...o+ o    |
|.* o = .oo . .   |
|o * * .oS   .    |
| o + ..o .       |
|o .   . =o.      |
|..   o +.o=+     |
|      o o*=..    |
+----[SHA256]-----+
```

If you're not the root user, remember to use the word "sudo" after the word "bash."

Get the host key and store it in a file. The host is typically referred to as the server, a.k.a switch. By default switch has a public key, which we can view using the command `show management ssh hostkey rsa public`,

```
Switch#show management ssh hostkey rsa public
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDjdKqe71fla8W30gT+gpJluAg+9BfrcCUKpnpM71CaMDCG1Gv3cvxzMWfxUpdkoXJiTBMwKm7/2xMKIf3ZadSLeHSQIdl0CGW8rAwFzzWtvCAEBUitg+BeyfurCS9nBtC71oq5ebFHSwtanirHGS67LGylsT3vKANla2lrhgQHwDwpN/XIVY0/8iXRqqRVoM+IL2m4ky+/hxK0dkLZW5+G+9bVHQxawG627ThApOIYmdlQjc0X2nsOTp9Md2xSQnF/QRidrm7PIRFXUI1mjYarjlH9lt5+9lbr0dYOtIhGO/+dEq/sAahngom6/NGssJFtSkCjClFYN9qjDg5zLjHT chassisAddr=74:83:ef:cb:3c:bb
```

```
Switch#show management ssh hostkey rsa public > flash:hostkey.pub
```

Sign the Switch’s public key with CA’s private key:

```
Switch#bash ssh-keygen -s /etc/ssh/ca -I Switch -n Switch -V +365d -h /mnt/flash/hostkey.pub
Signed host key /mnt/flash/hostkey-cert.pub: id "Switch" serial 0 for Switch valid from 2025-04-11T12:16:00 to 2026-04-11T12:17:54
```

To learn more about the flags used in the above command, kindly visit the Man page for the ["ssh-keygen"](https://man7.org/linux/man-pages/man1/ssh-keygen.1.html) command.

EOS maintains directories for the host certificate and CA's key. Let's move them to the respective directories,

```
Switch#copy file:etc/ssh/ca.pub ssh-ca-key:
Copy completed successfully.

Switch#copy flash:hostkey-cert.pub ssh-host-cert:
Copy completed successfully.
```

Configure the switch to present it's certificate when it receive a SSH request,

```
Switch(config)#management ssh
Switch(config-mgmt-ssh)#hostkey server cert hostkey-cert.pub
```

Also, configure the switch to trust the CA public key,

```                      
Switch(config-mgmt-ssh)#trusted-ca key public ca.pub
```

<!-- Note: "roopesh" is one of the usernames created in switch to login. -->

Configure the username in the switch so that when the client sends its certicate, switch has a username to compare with and authenticate,

```
Switch(config)#username root ssh principal rootGlobal
Switch(config)#username roopesh secret *
Switch(config)#username roopesh ssh principal rootGlobal roopesh
```

Let's see what a principal is. If I am a user, depending on the network or the Switch, I have multiple roles. For example, I can be a root user for one switch and an admin user (with fewer privileges) for another switch. A user certificate can also have this information. Principals can be thought of as tags.

In our case, we created a principal named "rootGlobal" and for the username "roopesh" we linked "rootGlobal" principal. This means, the user "roopesh" can access the switch as a root user if his certificate is also tagged with "rootGlobal" principal.

Copy the CA's private key to the client's device for futher steps,

```
bash# scp root@Switch:/etc/ssh/ca /Users/roopesh/Documents/certs
```

## Client Configuration

Now let's create private and public key pair in the client,

```
roopesh$ssh-keygen                                                                                                                                                           
Generating public/private ed25519 key pair.
Enter file in which to save the key (/Users/roopesh/.ssh/id_ed25519): /Users/roopesh/.ssh/id_switch
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /Users/roopesh/.ssh/id_switch
Your public key has been saved in /Users/roopesh/.ssh/id_switch.pub
The key fingerprint is:
SHA256:YzSFePWt0fi827XpsJUtwdvaPUkCfEIfZpWn7uE1DBM roopesh@Roopeshs-MacBook-Pro.local
The key's randomart image is:
+--[ED25519 256]--+
|       . oo   ...|
|      . o. o E ..|
|       .o o B =..|
|       . . + @.  |
|        S   =.O  |
|       . .   .oO+|
|             +*=*|
|              *O=|
|             .++=|
+----[SHA256]-----+
```

Enter "ssh-keygen" command, enter the file path to be saved or press enter if the default path (in my case, /Users/roopesh/.ssh/id_ed25519) is ok for you; passphrase is optional. 

Sign the Client's public key with CA’s private key,

```
roopesh#ssh-keygen -s /Users/roopesh/Documents/certs/ca -I roopesh -n roopesh,rootGlobal -V +30d /Users/roopesh/.ssh/id_switch.pub
Signed user key /Users/roopesh/.ssh/id_switch-cert.pub: id "roopesh" serial 0 for roopesh,rootGlobal valid from 2025-04-11T18:13:00 to 2025-05-11T18:14:07
```

## Testing

```
ssh -i /Users/roopesh/.ssh/id_ok270 roopesh@10.85.128.124
```

We are pointing the private key file in the above command using the flag "i". I hear you! We should point to the certificate file, but instead, we pointed to the private key file. 

"-i" in OpenSSH is used to specify private key files. (Ref: https://man.openbsd.org/ssh#i)
We did not need to pass in a certificate file because openSSH, by default, will look for the corresponding certificate file depending on which private key file we passed in. Since "/Users/roopesh/.ssh/id_ok270" was passed in, OpenSSH will automatically try using "/Users/roopesh/.ssh/id_ik270-cert.pub" as the certificate file. But if we want to be explicit, we can use the "-oCertificateFile" option, like "-oCertificateFile=/Users/roopesh/.ssh/id_ok270-cert.pub" instead.

The private key doesn't get passed to the server - it just gets inputted in on the client side for OpenSSH's own checks.

References:<br>
[SSH loging without password](https://arista.my.site.com/AristaCommunity/s/article/ssh-login-without-password)
