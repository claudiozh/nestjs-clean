
## Autenticação usando algoritmo RS256

![plot](./assets/auth-with-rs-256.png)

### Comando para gerar chave privada
openssl genpkey -algorithm RSA -out private_key.pem

### Comando para gerar chave pública
openssl rsa -pubout -in private_key.pem -out public_key.pem

### Site para converter as chaves em BASE64
https://emn178.github.io/online-tools/base64_encode.html


# Dependências
- [x] npm i vitest unplugin-swc @swc/core @vitest/coverage-v8 -D - para usar o vite com typescript
- [x] npm i vite-tsconfig-paths -D - para resolver os caminhos dos imports
- [x] npm i supertest -D - para fazer os testes de integração
- [x] npm i @types/supertest -D - para o typescript reconhecer o supertest

# Configurações
- [x] Criar arquivo vite.config.ts
- [x] Criar arquivo vite.config.e2e.ts
- [x] Configurar o arquivo vite.config.ts para usar o pacote vite-tsconfig-paths
- [x] Configurar o arquivo vite.config.e2e.ts para usar o pacote vite-tsconfig-paths
- [x] Configurar o arquivo tsconfig.json com 
```json
{
  "compilerOptions": {
    // ... outras configurações
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "strict": true,
    "strictNullChecks": true,
    "target": "es2022",
    "types": [
      "vitest/globals"
    ]
  }
}
```
Essa configuração é para o typescript reconhecer os caminhos dos imports e para o vite reconhecer os tipos do vitest de forma global