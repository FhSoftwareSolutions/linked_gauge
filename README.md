# API Arduino

Este projeto consiste em uma API desenvolvida *(Vibe Coded)* para receber dados de um Arduino via WiFi. A API é capaz de processar dados enviados por um sensor conectado ao Arduino, como um pluviômetro, e armazená-los para posterior análise.

## Requisitos

- Node.js (versão 14 ou superior)
- Arduino com módulo WiFi (ESP8266 ou ESP32)
- Arduino IDE
- Bibliotecas Arduino: `WiFi`, `HTTPClient`

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/arduino-api.git
   cd arduino-api
   ```

2. Instale as dependências do Node.js:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env`
   - Ajuste as variáveis conforme necessário

## Execução

1. Inicie o servidor Node.js:
   ```bash
   npm start
   ```

2. Programe o Arduino com o código fornecido em `src/arduino_ide/index.ino`.

3. Verifique a saída no console para garantir que os dados estão sendo recebidos corretamente.

## Funcionamento

- O Arduino lê dados de um sensor e os envia para a API via HTTP POST.
- A API recebe os dados e os armazena em um array para posterior análise.
- Um script de simulação (`src/arduino_ide/simulation.js`) também está disponível para testar a API sem o hardware.

## Licença

Este projeto está sob a licença FTH. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 