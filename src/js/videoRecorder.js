/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
export default async function videoRecorder(api) {
  console.log('video record started');
  api.stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  api.recorder = new MediaRecorder(api.stream);
  const chunks = [];
  api.recorder.addEventListener('start', (evt) => {
    console.log('recording started');
  });
  api.recorder.addEventListener('dataavailable', (evt) => {
    console.log('data available');
    chunks.push(evt.data);
  });
  api.recorder.addEventListener('stop', (evt) => {
    console.log('recording stopped');
    const blob = new Blob(chunks);
    api.src = URL.createObjectURL(blob);
  });
  api.recorder.start();
}
