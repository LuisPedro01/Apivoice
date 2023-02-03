from flask import Flask, render_template, request, redirect
import speech_recognition as sr
from comandos import ouvir_microfone

app = Flask(__name__)

#Members API Route

@app.route("/data", methods=["GET"])
def voice_command():
    # audio_data=request.data
    # voice_command = ouvir_microfone(audio_data)
    # if voice_command:
    #     return "Voice Command Received: " + voice_command
    # else:
    #     return "Error processing voice command"
    data = {"key1": "value1", "key2": "value2"}
    return (data)
    #return "teste"

if __name__ == "__main__":
    app.run(debug=True)

