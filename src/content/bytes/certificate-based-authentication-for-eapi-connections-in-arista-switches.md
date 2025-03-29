---
title: Certificate based Authentication for eAPI Connections in Arista Switches
createdAt: 2025-03-29
updatedAt: 2025-03-29
category: certificates, arista
summary: This byte discusses certificate-based authentication for eAPI connections in Arista switches.
tags: certificates, openssl, linux, arista, eapi
author: Roopesh Saravanan
image: none
---

To authenticate against EAPI, Certificates can be used in a TLS handshake instead of username and password. Before diving into the configuration, let’s visualize how the client and server verify each other.

In this model, the client and server trust a third-party organization known as the Certificate Authority (CA). The CA signs the certificates of both the client and server.

What is a Certificate? Think of it as an Identity card. A certificate contains a public key, Identifiers (name, country, etc.), and a digital signature from the Issuing CA.

Let’s break down a few terms,
- In this model, each entity, such as the Client, Server, and CA, will generate its own public and private keys.
- The CA’s private key is used to sign the Client and Server Certificates. Why? Because they both trust the CA. This is known as a Certificate Signing Request (CSR).
- The server public key, embedded in the certificate (x509), will be used by the Client to encrypt the information that is going to be sent. Likewise, the server will use the Client’s public key to encrypt the information in the case of Mutual TLS (MTLS).
- Client and Server private keys are used to decrypt the information received.

Now let’s visualize the flow of a Certificate-based TLS handshake,
- The client expresses its interest in establishing communication with the server using Certs. This is known as Client Hello. 
- The Switch responds with its Certificate.
- The Client verifies the server’s certificate by matching the digital signature with the CA’s public key, which it trusts. Note this is sometimes optional too.
- The client will share its certificate with the switch as it’s the only way to know which user is trying to authenticate because the certificate has the user’s identity.
- Upon verification, Switch will share a symmetric key with the Client which is used to encrypt the messages, and also this key is valid on a session basis.

The above pointers can also be verified using the Wireshark capture.

![Wireshark Capture](/images/cert-based-auth-arista/capture.png)

Note: The private and public keys we discuss are used only in the handshake process. Once communication is established, they use a symmetric key to encrypt and decrypt the information they will send and receive. 

Let’s see how to generate keys and certificates. For testing purposes let’s consider the Switch itself as a CA too.

Actually, we have two ways to create keys and certificates in the Switch: through EOS and bash. We’re going with the bash of doing things.

We use OpenSSL, an open-source cryptographic library and CLI tool, to create keys and certificates. 

The below command creates the CA private key and certificate. As said before, we’re going to create the CA stuff on the switch itself.
```
openssl req -new -nodes -x509 -days 100 -subj "/CN=CA" -keyout ca.key -out ca.cert
```

The resulting files from the above command are PEM encoded. Not only from the above command, the keys and certificates we’re creating will be PEM encoded. Note the created filenames that end with “.key”/”.cert” are not extensions but for identification purposes.

The below command will create a private key and a certificate, which we named “switch.csr” because the CA will sign this certificate.
```
openssl req -new -nodes -subj "/CN=switch" -out switch.csr -keyout switch.key
```

As said, the below command will create a CA-signed certificate for the switch,
```
openssl x509 -req -sha256 -days 100 -in switch.csr -CA ca.cert -CAkey ca.key -set_serial 123 -out switch.cert
```

Now, let’s look at the client side of things. The below command is used to create the same things as we did in the switch,
```
openssl req -new -nodes -subj '/CN=roopesh' -out roopesh.csr -keyout roopesh.key
```

The following command is used to create a CA-signed certificate for the Client,
```
openssl x509 -req -sha256 -days 100 -in roopesh.csr -CA ca.cert -CAkey ca.key -set_serial 1234 -out roopesh.cert
```

Note: We'll pass the client certificate and the private key for every request to the Switch.

We have a few configurations left in the Switch to take care of. The CA and Client certificates should be configured to trust on the Switch. As we generated the CA certificate in the Switch, it’s already in the flash. Let’s copy the client’s certificate to the switch’s flash.
```
roopesh:~/ $ scp /Users/roopesh/roopesh.cert root@10.85.128.123:/mnt/flash
```

EOS has a directory to hold certificates. Let’s move the Switch’s, CA, and client’s certificates to that directory,
```
Switch#copy flash:switch.cert certificate:switch.cert
Switch#copy flash:ca.cert certificate:ca.cert
Switch#copy flash:roopesh.cert certificate:roopesh.cert
```

Similarly to hold keys, EOS has “sslkey” directory,
```
Switch#copy flash:switch.cert sslkey:switch.key
```

Create a SSL profile and trust the certificates,
```
Switch(config)#management security
Switch(config-mgmt-security)#ssl profile eapi
Switch(config-mgmt-sec-ssl-profile-eapi)#certificate switch.cert key switch.key
Switch(config-mgmt-sec-ssl-profile-eapi)#trust ca.cert
Switch(config-mgmt-sec-ssl-profile-eapi)#trust roopesh.cert
```

To verify,
```
Switch(config)#show management security ssl profile eapi
   Profile       State
------------- -----------
   eapi          valid
```

Configure the “eapi” profile as the SSL profile,
```
management api http-commands
  protocol https ssl profile eapi
```

To verify,
```
Switch#show management api http-commands
Enabled:            Yes
HTTPS server:       running, set to use port 443
HTTP server:        running, set to use port 80
...
SSL Profile:        eapi, valid
...
```

We left with a step which is creating the user in the switch. When the switch receives an authentication request with a certificate with a user’s name, the same user should also be present in the switch so that the switch can compare against it.
```
Switch#username bob privilege 15 secret *
```

Testing using CURL,
The request to the Switch,
```
roopesh:tls/ $ curl -X POST --cacert ca.cert --cert bob.cert --key bob.key https://ok271/command-api -d '{"jsonrpc":"2.0","method":"runCmds","params":{"version": 1,"cmds":["enable", "show version"],"format":"json"},"id":"1"}'
```

And the response we got back from the Switch,
```
{"jsonrpc": "2.0", "id": "1", "result": [{}, {"mfgName": "Arista", "modelName": "DCS-7060SX2-48YC6-F", "hardwareRevision": "11.50", "serialNumber": "JPE18311397", "systemMacAddress": "74:83:ef:cb:3c:bb", "hwMacAddress": "74:83:ef:cb:3c:bb", "configMacAddress": "00:00:00:00:00:00", "version": "4.30.7M", "architecture": "i686", "internalVersion": "4.30.7M-37690889.4307M", "internalBuildId": "c3dbd0ba-9ff1-4529-98dc-787018b2492f", "imageFormatVersion": "3.0", "imageOptimization": "Strata-4GB", "bootupTimestamp": 1739447713.6891668, "uptime": 3281264.89, "memTotal": 8059840, "memFree": 6297212, "isIntlVersion": false}]}%
```

Certificate-based authentication is also supported in [goeapi](https://github.com/aristanetworks/goeapi) or [pyeapi](https://github.com/arista-eosplus/pyeapi) client libraries, which interact with the switch via eAPI.

References:<br>
[Working with Certificates](https://arista.my.site.com/AristaCommunity/s/article/working-with-certificates)<br>
[EOS Control Plane Security](https://www.arista.com/en/um-eos/eos-control-plane-security)