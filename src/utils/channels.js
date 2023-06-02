import { ivsClient } from "./clients";
import {
  CreateChannelCommand,
  GetChannelCommand,
  GetStreamCommand,
  GetStreamKeyCommand,
  ListChannelsCommand,
  ListStreamKeysCommand,
} from "@aws-sdk/client-ivs";

export const createChannel = async ({ name }) => {
  const input = {
    name: name,
    latencyMode: "NORMAL",
    type: "STANDARD",
  };

  try {
    const command = new CreateChannelCommand(input);
    const response = await ivsClient.send(command);

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const listChannels = async (filterByName) => {
  const input = {};
  if (filterByName) {
    input.filterByName = filterByName;
  }
  try {
    const command = new ListChannelsCommand(input);
    const response = await ivsClient.send(command);

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getChannel = async ({ name }) => {
  const list = await listChannels(name);

  if (!list.channels.length) {
    console.log(`Channel with name doesn't exist ${name}`);
    return;
  }
  const input = {
    arn: list.channels[0].arn,
  };
  try {
    const command = new GetChannelCommand(input);
    const response = await ivsClient.send(command);

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getStreamKey = async ({ arn }) => {
  const input = {
    channelArn: arn,
  };
  const listStreamCommand = new ListStreamKeysCommand(input);

  const list = await ivsClient.send(listStreamCommand);

  const command = new GetStreamKeyCommand({ arn: list.streamKeys[0].arn });
  const response = await ivsClient.send(command);

  return response.streamKey
};
