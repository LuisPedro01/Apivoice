#pip install SpeechRecognition -> RECONHECER A VOZ LIDA

#Digite Python 
#pip install pyaudio -> LEITURA DO AUDIO DO MICROFONE
#ver versao do PYTHON e do AMD 64 ou win 32
#https://www.lfd.uci.edu/~gohlke/pythonlibs/#pyaudio
#pip install CaminhoDoArquivo

#https://letscode.com.br/blog/speech-recognition-com-python

import speech_recognition as sr

import os

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

        if "Adicionar apiário" in frase:
            os.system("start Chrome.exe")

        if "Adicionar colmeia" in frase:
            os.system("start Chrome.exe")

        if "Abrir apiário" in frase:
            os.system("start Chrome.exe")

        if "Abrir colmeia" in frase:
            os.system("start Chrome.exe")

        if "Gravar audio" in frase:
            os.system("start Chrome.exe")

        if "Reproduzir ultima gravação" in frase:
            os.system("start Chrome.exe")

        if "Retroceder" in frase:
            os.system("start Chrome.exe")

        #Retorna a frase pronunciada
        print("Voce disse: " + frase)
    
    #Se não reconheceu o padrão de fala, exiba a mensagem
    except sr.UnkownValueError:
        print("Não entendi o seu comando")

    return frase

ouvir_microfone() 