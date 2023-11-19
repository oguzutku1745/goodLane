import { exportCallDataGroth16 } from "./snarkjsZkproof";

export async function depositCallData(
  secret,
  root,
  pathElements,
  pathIndices,
  recipient
) {
  const input = {
    secret,
    root,
    pathElements,
    pathIndices,
    recipient,
  };

  let dataResult;

  try {
    dataResult = await exportCallDataGroth16(
      input,
      "/zkproof/withdraw.wasm",
      "/zkproof/withdraw.zkey"
    );

    console.log("dataresult", dataResult);
  } catch (error) {
    console.log(error);
  }

  return dataResult;
}
