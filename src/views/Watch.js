import React, { useCallback, useRef } from "react"
import { getChannel } from "../utils/channels"
import { useLoaderData } from "react-router-dom"

export async function loader({ params }) {
  const response = await getChannel({ name: params.channel_name })
  console.log(response)
  if (response) return response.channel
}

function Watch(props) {
  const videoStreamRef = useRef()
  const channel = useLoaderData()

  const connectStream = useCallback(() => {
    if (window.IVSPlayer.isPlayerSupported) {
      const player = window.IVSPlayer.create()
      player.attachHTMLVideoElement(videoStreamRef.current)
      player.load(channel.playbackUrl)
      player.play()
    }
  }, [videoStreamRef, channel.playbackUrl])

  return (
    <div>
      <button type="button" onClick={connectStream}>
        Connect to stream
      </button>

      <div>
        <video ref={videoStreamRef}></video>
      </div>
    </div>
  )
}

export default Watch
