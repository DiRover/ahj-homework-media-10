/* eslint-disable no-param-reassign */
export default async function videoRecorderDouble(api, video) {
  api.streamDouble = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  video.srcObject = api.streamDouble;
  video.play();
}
