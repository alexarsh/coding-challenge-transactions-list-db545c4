import { PayloadAction } from "@reduxjs/toolkit";
import { takeEvery } from "redux-saga/effects";
import { navigate } from "../components/NaiveRouter";
import {
  JsonRpcProvider,
  Transaction,
  TransactionResponse,
  TransactionReceipt,
  Signer,
} from "ethers";

import apolloClient from "../apollo/client";
import { Actions } from "../types";
import { SaveTransaction } from "../queries";

function* sendTransaction(action: PayloadAction<any>) {

  const provider = new JsonRpcProvider("http://localhost:8545");

  // I had some probelms to connect MetaMask with my local ganache, so just using it's provider here directly
  // const walletProvider = new BrowserProvider(window.web3.currentProvider);

  const signer: Signer = yield provider.getSigner();

  // Just using all the fields from the form instead of picking random Account
  const transaction = {
    from: action.payload.from,
    to: action.payload.to,
    value: action.payload.amount,
  };

  try {
    const txResponse: TransactionResponse =
      yield signer.sendTransaction(transaction);
    const response: TransactionReceipt = yield txResponse.wait();

    const receipt: Transaction = yield response.getTransaction();

    const variables = {
      transaction: {
        gasLimit: (receipt.gasLimit && receipt.gasLimit.toString()) || "0",
        gasPrice: (receipt.gasPrice && receipt.gasPrice.toString()) || "0",
        to: receipt.to,
        from: receipt.from,
        value: (receipt.value && receipt.value.toString()) || "",
        data: receipt.data || null,
        chainId: (receipt.chainId && receipt.chainId.toString()) || "123456",
        hash: receipt.hash,
      },
    };

    yield apolloClient.mutate({
      mutation: SaveTransaction,
      variables,
    });
    yield navigate(`/transaction/${receipt.hash}`)
  } catch (error) {
    //
  }
}

export function* rootSaga() {
  yield takeEvery(Actions.SendTransaction, sendTransaction);
}
