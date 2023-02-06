from flask import Flask, render_template, request, redirect, jsonify
import speech_recognition as sr
from comandos import ouvir_microfone

app = Flask(__name__)

#Members API Route

@app.route("/", methods=["GET", "POST"])
def voice_command():
    data = {"key1": "value1", "key2": "value2"}
    return jsonify({"Hello":"World"})
    #comando=ouvir_microfone()
    #return(comando)


if __name__ == "__main__":
    app.run(host='192.168.1.72', port=3000,debug=True)

