from flask import Flask, render_template, request, redirect, jsonify
import speech_recognition as sr
import os 

app = Flask(__name__)

#Members API Route

@app.route("/", methods=["GET", "POST"])
def voice_command():
    #data = {"key1": "value1", "key2": "value2"}
    #return jsonify({"Hello":"World"})
    comando=ouvir_microfone()
    return(comando)



#função para ouvir e reconhecer a fala
def ouvir_microfone():
    #Habilita o microfone do usuario 
    microfone= sr.Recognizer()
 
    #usando o microfone
    with sr.Microphone() as source:

        #chama um algoritmo de redução de ruidos de som 
        microfone.adjust_for_ambient_noise(source)

        #Frase para o ususario dizer algo
        print("Diga alguma coisa: ")

        #Armazena o que foi dito numa variavel
        audio=microfone.listen(source)

    try:
        #Passa a variavel para o algoritmo reconhecedor de padroes
        frase= microfone.recognize_google(audio,language='pt-PT')

        #Retorna a frase pronunciada
        print("Voce disse: " + frase)
        return frase
    
    
    #Se não reconheceu o padrão de fala, exiba a mensagem
    except sr.UnknownValueError:
        print("Não entendi o seu comando")

if __name__ == "__main__":
    app.run(host='192.168.1.72',port=5000,debug=True)

#mac -> 192.168.1.106
#windows -> 192.168.1.72