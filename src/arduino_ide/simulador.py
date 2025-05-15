import requests
import time
import random

# URL da API
url = 'http://localhost:3060/arduinoData'

# Estado inicial de pulsos
pulsos = 0

def simular_medicao():
    global pulsos

    # Simula entre 1 e 5 pulsos por medição
    incremento = random.randint(1, 5)
    pulsos += incremento
    mm_de_chuva = round(pulsos * 0.25, 2)

    dados = {
        'pulsos': pulsos,
        'mm_de_chuva': mm_de_chuva
    }

    print("Enviando dados:", dados)

    try:
        resposta = requests.post(url, json=dados)
        print("Resposta da API:", resposta.status_code, resposta.text)
    except requests.exceptions.RequestException as e:
        print("Erro ao enviar dados:", e)

# Envia uma medição a cada 5 segundos
while True:
    simular_medicao()
    time.sleep(5)
