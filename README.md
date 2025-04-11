# API Arduino

API para receber dados do Arduino IDE via WiFi.

> 🚀 Este projeto foi desenvolvido com a prática "Vibe Coding".

## 📋 Requisitos

- Node.js (versão 14 ou superior)
- Arduino IDE
- Módulo WiFi para Arduino (ESP8266 ou ESP32)
- Git

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/arduino-api.git
cd arduino-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env`
   - Ajuste as variáveis conforme necessário

## 🚀 Executando o projeto

Para desenvolvimento:
```bash
npm run dev
```

Para produção:
```bash
npm start
```

## 💻 Código Arduino

Para conectar seu Arduino a esta API, você precisará:

1. Instalar a biblioteca WebSocket no Arduino IDE
2. Configurar seu módulo WiFi
3. Usar o seguinte código básico como exemplo:

```cpp
#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>

const char* ssid = "SUA_REDE_WIFI";
const char* password = "SUA_SENHA_WIFI";
const char* websocket_server = "seu_ip_local";
const int websocket_port = 3000;

WebSocketsClient webSocket;

void setup() {
  Serial.begin(115200);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  webSocket.begin(websocket_server, websocket_port);
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();
  
  // Exemplo de envio de dados
  if (Serial.available()) {
    String data = Serial.readStringUntil('\n');
    webSocket.sendTXT(data);
  }
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("Desconectado!");
      break;
    case WStype_CONNECTED:
      Serial.println("Conectado!");
      break;
  }
}
```

## 🔌 Endpoints

- `GET /`: Verifica se a API está funcionando
- WebSocket: Recebe dados em tempo real do Arduino

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Faça o Commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença ISC. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
