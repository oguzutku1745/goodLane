import {
  LightNode,
  createDecoder,
  createEncoder,
  createLightNode,
  waitForRemotePeer,
} from "@waku/sdk";
// import { createEncoder } from "@waku/message-encryption/symmetric";
import protobuf from "protobufjs";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

interface IWakuConnection {}

const contentTopic = "/light-guide/1/message/proto";

// Create a message encoder and decoder
// const encoder = createEncoder({
//   contentTopic,
//   symKey: new Uint8Array(),
//   ephemeral: true,
// });
const encoder = createEncoder({ contentTopic });
const decoder = createDecoder(contentTopic);

const messageType = new protobuf.Type("ChatMessage")
  .add(new protobuf.Field("timestamp", 1, "uint64"))
  .add(new protobuf.Field("sender", 2, "string"))
  .add(new protobuf.Field("message", 3, "string"));

const WakuConnection: React.FC<IWakuConnection> = ({}) => {
  //   const [messageStructure, setMessageStructure] = useState<protobuf.Type>();
  const [wakuNode, setWakuNode] = useState<LightNode | null>(null);
  const [text, setText] = useState("");
  const [receivedMessage, setReceivedMessage] = useState([]);

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
    const localPeerId = node.libp2p.peerId.toString();

    // const unsubscribeFromMessages = await node.filter.subscribe(
    //   [decoder],
    //   (wakuMessage) => {
    //     const messageObj = messageType.decode(wakuMessage.payload);
    //     onMessageReceived({
    //       ...messageObj,
    //       text: bytesToUtf8(messageObj.text),
    //     });
    //   }
    // );

    setWakuNode(node);
  };

  const sendMessage = async () => {
    const protoMessage = messageType!.create({
      timestamp: Date.now(),
      sender: "Alice",
      message: text,
    });

    const serialisedMessage = messageType!.encode(protoMessage).finish();

    await wakuNode?.lightPush.send(encoder, {
      payload: serialisedMessage,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const callback = async (wakuMessage: any) => {
    // Check if there is a payload on the message
    if (!wakuMessage.payload) return;
    // Render the messageObj as desired in your application
    const messageObj = messageType.decode(wakuMessage.payload);
    console.log("message", messageObj);

    // Create a filter subscription
    const subscription = await wakuNode!.filter.createSubscription();

    // Subscribe to content topics and process new messages
    await subscription.subscribe([decoder], callback);
  };

  useEffect(() => {
    const initializeWaku = async () => {
      await createWakuConnection();
      if (wakuNode) {
        // await callback();
      }
      // Create the callback function
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
      {receivedMessage.length > 0 &&
        receivedMessage.map((message) => {
          return <h2 className="text-xl">{message}</h2>;
        })}
    </div>
  );
};
export default WakuConnection;
