import { Ivs } from "@aws-sdk/client-ivs";
import IVSBroadcastClient from "amazon-ivs-web-broadcast";
export const ivsClient = new Ivs({
  region: process.env.REACT_APP_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  },
});

export const getIvsBroadcastClient = ({ ingestEndpoint }) => {
  return IVSBroadcastClient.create({
    // Enter the desired stream configuration
    streamConfig: IVSBroadcastClient.BASIC_LANDSCAPE,
    // Enter the ingest endpoint from the AWS console or CreateChannel API
    ingestEndpoint: ingestEndpoint,
  });
};
