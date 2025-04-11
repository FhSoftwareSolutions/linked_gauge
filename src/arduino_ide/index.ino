#include "Wire.h"
#include "WiFi.h"
#include "HTTPClient.h"

const char* ssid = "WFSN";
const char* password = "fatec@259";
const int REED = 4;

const char* serverName = "http://189.90.97.245:3000/arduinoData";
 
// Variáveis:
int val = 0;
int old_val = 0;
int REEDCOUNT = 0;
 
void setup() {
   // Initializa a comunicaçao serial:
  Serial.begin(9600);
  // Initializa o pino do switch como entrada
  pinMode (REED, INPUT_PULLUP); //This activates the internal pull up resistor

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando ao WiFi...");
  }
  Serial.println("Conectado ao WiFi");
}
 
void loop() {
  val = digitalRead(REED);      // Lê o Status do Reed Switch
 
  if ((val == LOW) && (old_val == HIGH)) {   // Verefica se o Status mudou
    delay(10);                   // Atraso colocado para lidar com qualquer "salto" no switch.
    REEDCOUNT = REEDCOUNT + 1;   // Adiciona 1 à cntagem de pulsos
    old_val = val;              //Iguala o valor antigo com o atual
 
    // Imprime no Monitor Serial
    Serial.print("Medida de chuva (contagem): ");
    Serial.print(REEDCOUNT);
    Serial.println(" pulso");
    Serial.print("Medida de chuva (calculado): ");
    Serial.print(REEDCOUNT * 0.25);
    Serial.println(" mm");

    if(WiFi.status() == WL_CONNECTED){
      HTTPClient http;
      http.begin(serverName);
      http.addHeader("Content-Type", "application/json");

      // Monta o JSON
      float mm = REEDCOUNT * 0.25;
      String json = "{\"pulsos\": " + String(REEDCOUNT) + ", \"mm_de_chuva\": " + String(mm, 2) + "}";

      int responseCode = http.POST(json);
      Serial.print("Código de resposta HTTP: ");
      Serial.println(responseCode);

      if (responseCode > 0) {
        String resposta = http.getString();
        Serial.println("Resposta da API:");
        Serial.println(resposta);
      } else {
        Serial.println("Erro ao enviar dados.");
      }

      http.end();
    }
    }
  
 
  else {
    old_val = val;              //If the status hasn't changed then do nothing
  }
}

