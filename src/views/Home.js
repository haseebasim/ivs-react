import React, { useEffect, useState } from "react";
import { createChannel, listChannels } from "../utils/channels";
import { Link } from "react-router-dom";

const Home = () => {
  const [channelList, setChannelList] = useState([]);

  useEffect(() => {
    (async () => await getChannelList())();
  }, []);

  const getChannelList = async () => {
    const list = await listChannels();
    setChannelList(list.channels);
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await createChannel({ name: data.get("channel-name") });
    getChannelList();
  };

  return (
    <div>
      <div>
        <form onSubmit={handleCreateChannel}>
          <input type="text" name="channel-name" required id="channel-name" />
          <button type="submit">Create a channel</button>
        </form>
        <div>
          <p>List of Existing Channels</p>
          <div>
            {channelList.map((channel) => {
              return (
                <p key={channel.name}>
                  <Link to={`/stream/${channel.name}`}>{channel.name}</Link>
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
