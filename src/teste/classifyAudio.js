import * as tf from '@tensorflow/tfjs';

// Função para classificar o áudio usando o modelo TensorFlow Lite
export async function classifyAudio(audioData, model) {
  // Pré-processamento do áudio
  const audioTensor = preprocessAudio(audioData);

  // Executar a classificação no modelo TensorFlow Lite
  const predictions = model.predict(audioTensor);

  // Decodificar as previsões
  const decodedPredictions = decodePredictions(predictions);

  return decodedPredictions;
}

// Função de pré-processamento de áudio
function preprocessAudio(audioData) {
  // Converta o áudio para um tensor de ponto flutuante normalizado entre 0 e 1
  const audioTensor = tf.tensor(audioData, [1, audioData.length, 1]);
  const normalizedTensor = audioTensor.div(255);

  // Redimensione o tensor para o tamanho esperado pelo modelo
  const resizedTensor = normalizedTensor.resize([1, expectedInputLength, 1]);

  return resizedTensor;
}

// Função para decodificar as previsões do modelo
function decodePredictions(predictions) {
  // Processar as previsões para obter as classes
  const classes = ['Parar', 'Página inicial', 'Voltar', 'Gravar', 'Selecionar apiário', 'Selecionar colmeia', 'Fim Gravação']; // Substitua pelas suas classes

  // Obter os índices das previsões mais prováveis
  const topIndices = tf.argMax(predictions, 1).dataSync();
  
  // Obter os valores das previsões mais prováveis
  const topValues = tf.max(predictions, 1).dataSync();

  // Decodificar as previsões em formato legível
  const decodedPredictions = topIndices.map((index, i) => ({
    class: classes[index],
    score: topValues[i],
  }));

  return decodedPredictions;
}