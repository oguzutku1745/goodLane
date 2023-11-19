import {
  LightNode,
  createDecoder,
  createEncoder,
  createLightNode,
  waitForRemotePeer,
} from "@waku/sdk";
import protobuf from "protobufjs";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

//interface IWakuConnection {}

const contentTopic = "/light-guide/1/message/proto";

// Create a message encoder and decoder
const encoder = createEncoder({ contentTopic });
//const decoder = createDecoder(contentTopic);

const messageType = new protobuf.Type("ChatMessage")
  .add(new protobuf.Field("timestamp", 1, "uint64"))
  .add(new protobuf.Field("sender", 2, "string"))
  .add(new protobuf.Field("message", 3, "string"));

const WakuConnection: React.FC = ({}) => {
  //   const [messageStructure, setMessageStructure] = useState<protobuf.Type>();
  const [wakuNode, setWakuNode] = useState<LightNode | null>(null);
  const [text, setText] = useState("");

  const { address } = useAccount();
  console.log("🚀 ~ file: WakuConnection.tsx:13 ~ address:", address);

  const createWakuConnection = async () => {
    const node = await createLightNode({ defaultBootstrap: true });
    console.log(
      "🚀 ~ file: WakuConnection.tsx:35 ~ createWakuConnection ~ node:",
      node
    );
    await node.start();
    await waitForRemotePeer(node);
    setWakuNode(node);
  };

  const sendMessage = async () => {
    const protoMessage = messageType!.create({
      timestamp: Date.now(),
      sender: "Alice",
      message: "Hello, World!",
    });

    const serialisedMessage = messageType!.encode(protoMessage).finish();

    await wakuNode!.lightPush.send(encoder, {
      payload: serialisedMessage,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  useEffect(() => {
    const initializeWaku = async () => {
      await createWakuConnection();
    };
    initializeWaku();
  }, []);

  return (
    <div className="flex gap-5">
      <input onChange={(e) => handleChange(e)} type="text" value={text} />
      <button
        onClick={sendMessage}
        className="px-4 py-2 border rounded-md"
        type="submit"
      >
        Send
      </button>
    </div>
  );
};
export default WakuConnection;
