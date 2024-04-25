import { gql } from "@apollo/client";

export const GetAllTransactions = gql`
  query GetAllTransactions {
    getAllTransactions {
      gasLimit
      gasPrice
      to
      from
      value
      data
      chainId
      hash
    }
  }
`;

export const GetSingleTransaction = gql`
  query GetSingleTransaction($hash: String!) {
    getTransaction(hash: $hash) {
      gasLimit
      gasPrice
      to
      from
      value
      data
      chainId
      hash
    }
  }
`;

// Added all the relevant fields, so the transaction will be saved correctly in the DB
export const SaveTransaction = gql`
  mutation SaveTransaction($transaction: TransactionInput!) {
    addTransaction(transaction: $transaction) {
      gasLimit
      gasPrice
      to
      from
      value
      data
      chainId
      hash
    }
  }
`;
