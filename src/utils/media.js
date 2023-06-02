import IVSBroadcastClient from "amazon-ivs-web-broadcast";

export const getAvailableDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((d) => d.kind === "videoinput");
    const audioDevices = devices.filter((d) => d.kind === "audioinput");
    return { videoDevices, audioDevices };
  } catch (error) {
    console.log(error);
  }
};

export const getStreamFromDevice = async ({ videoDeviceId, audioDeviceId }) => {
  const streamConfig = IVSBroadcastClient.STANDARD_LANDSCAPE;
  try {
    const cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: videoDeviceId,
        width: {
          ideal: streamConfig.maxResolution.width,
          max: streamConfig.maxResolution.width,
        },
        height: {
          ideal: streamConfig.maxResolution.height,
          max: streamConfig.maxResolution.height,
        },
      },
    });
    const microphoneStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: audioDeviceId },
    });

    return { cameraStream, microphoneStream };
  } catch (error) {
    console.log(error);
  }
};

export const handlePermissions = async () => {
  let permissions = {
    audio: false,
    video: false,
  };
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    for (const track of stream.getTracks()) {
      track.stop();
    }

    permissions = { video: true, audio: true };
  } catch (err) {
    permissions = { video: false, audio: false };
    alert("No permissions");
    console.error(err.message);
  }
  // If we still don't have permissions after requesting them display the error message
  if (!permissions.video) {
    console.error("Failed to get video permissions.");
  } else if (!permissions.audio) {
    console.error("Failed to get audio permissions.");
  }
};
