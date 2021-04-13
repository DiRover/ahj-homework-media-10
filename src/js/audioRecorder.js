export default async function audioRecorder(api) {
  console.log('audio record started');
  api.stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
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
