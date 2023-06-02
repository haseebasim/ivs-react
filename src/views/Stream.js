import React, { useEffect, useState } from "react";
import { getChannel, getStreamKey } from "../utils/channels";
import { useLoaderData } from "react-router";
import {
  getAvailableDevices,
  getStreamFromDevice,
  handlePermissions,
} from "../utils/media";
import { getIvsBroadcastClient } from "../utils/clients";

export async function loader({ params }) {
  const response = await getChannel({ name: params.channel_name });
  console.log(response);
  if (response) return response.channel;
}

const Stream = () => {
  const [selectedDevices, setSelectedDevices] = useState({
    video_device: undefined,
    audio_device: undefined,
  });
  const [devices, setDevices] = useState({
    video_device: [],
    audio_device: [],
  });

  const [streaming, setStreaming] = useState(false);
  const channel = useLoaderData();

  useEffect(() => {
    (async () => {
      await handlePermissions();
      const { videoDevices, audioDevices } = await getAvailableDevices();
      setDevices({ video_device: videoDevices, audio_device: audioDevices });
    })();
  }, []);

  const handleDevicesInput = (e) => {
    e.preventDefault();

    setSelectedDevices({ ...selectedDevices, [e.target.name]: e.target.value });
  };

  const handleStartStream = async (e) => {
    e.preventDefault();
    console.log(selectedDevices, "selectedDevices");
    if (!selectedDevices.audio_device && !selectedDevices.video_device) {
      alert("Please select an audio and video device to proceed.");
    }
    const { cameraStream, microphoneStream } = await getStreamFromDevice({
      videoDeviceId: selectedDevices.video_device,
      audioDeviceId: selectedDevices.audio_device,
    });

    const client = getIvsBroadcastClient({
      ingestEndpoint: channel.ingestEndpoint,
    });

    client.addVideoInputDevice(cameraStream, "camera1", { index: 0 }); // only 'index' is required for the position parameter
    client.addAudioInputDevice(microphoneStream, "mic1");

    const streamKey = await getStreamKey({ arn: channel.arn });

    await client
      .startBroadcast(streamKey.value)
      .then((result) => {
        console.log(result, "broadcast result");
        setStreaming(true);
        if (window.IVSPlayer.isPlayerSupported) {
          const player = window.IVSPlayer.create();
          player.attachHTMLVideoElement(
            document.getElementById("video-player")
          );
          player.load(channel.playbackUrl);
          player.play();
        }
        console.log("I am successfully broadcasting!");
      })
      .catch((error) => {
        console.error(
          "Something drastically failed while broadcasting!",
          error
        );
      });
  };

  const stopStream = async () => {
    const client = getIvsBroadcastClient({
      ingestEndpoint: channel.ingestEndpoint,
    });

    await client.stopBroadcast();
    setStreaming(false);
  };

  return (
    <div>
      <form onSubmit={handleStartStream}>
        <select
          value={selectedDevices.video_device}
          onChange={handleDevicesInput}
          name="video_device"
          required
        >
          <option value={null}>Please select a video file</option>

          {devices.video_device.length &&
            devices.video_device.map((device) => {
              return (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              );
            })}
        </select>
        <select
          name="audio_device"
          value={selectedDevices.audio_device}
          onChange={handleDevicesInput}
          required
        >
          <option value={null}>Please select an audio file</option>
          {devices.audio_device.length &&
            devices.audio_device.map((device) => {
              return (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              );
            })}
        </select>
        <button
          type="button"
          onClick={() => {
            if (window.IVSPlayer.isPlayerSupported) {
              const player = window.IVSPlayer.create();
              player.attachHTMLVideoElement(
                document.getElementById("video-player")
              );
              player.load(channel.playbackUrl);
              player.play();
            }
          }}
        >
          Connect to stream
        </button>
        <button type="submit">Start a stream</button>
        <button disabled={!streaming} type="button" onClick={stopStream}>
          Stop Streaming
        </button>
      </form>

      <div>
        <video id="video-player"></video>
      </div>
    </div>
  );
};

export default Stream;
