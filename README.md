
## Autenticação usando algoritmo RS256

![plot](./assets/auth-with-rs-256.png)

### Comando para gerar chave privada
openssl genpkey -algorithm RSA -out private_key.pem

### Comando para gerar chave pública
openssl rsa -pubout -in private_key.pem -out public_key.pem

### Site para converter as chaves em BASE64
https://emn178.github.io/online-tools/base64_encode.html
