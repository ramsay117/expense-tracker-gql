import Transaction from '../models/transaction.model.js';

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        const authUser = context.getUser();
        if (!authUser) {
          throw new Error('Unauthorized');
        }
        const userId = authUser._id;
        const transactions = await Transaction.find({ userId });
        return transactions;
      } catch (error) {
        throw error;
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
          throw new Error('Transaction not found');
        }
        return transaction;
      } catch (error) {
        throw error;
      }
    },
    categoryStats: async (_, __, context) => {
      try {
        const authUser = context.getUser();
        if (!authUser) {
          throw new Error('Unauthorized');
        }
        const userId = authUser._id;
        const transactions = await Transaction.find({ userId });
        const categoryAmountMap = {};
        transactions.forEach((transaction) => {
          categoryAmountMap[transaction.category] = (categoryAmountMap[transaction.category] ?? 0) + transaction.amount;
        });
        return Object.entries(categoryAmountMap).map(([category, totalAmount]) => ({
          category,
          totalAmount,
        }));
      } catch (error) {
        throw error;
      }
    },
  },

  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transaction({
          ...input,
          userId: context.getUser()._id,
        });
        await newTransaction.save();
        return newTransaction;
      } catch (error) {
        throw error;
      }
    },
    updateTransaction: async (_, { input }, context) => {
      try {
        const { transactionId, ...rest } = input;
        const transaction = await Transaction.findById(input.transactionId);
        if (!transaction) {
          throw new Error('Transaction not found');
        }
        if (transaction.userId.toString() !== context.getUser()._id.toString()) {
          throw new Error('Unauthorized');
        }
        const updatedTransaction = await Transaction.findByIdAndUpdate(transactionId, rest, {
          new: true,
        });
        return updatedTransaction;
      } catch (error) {
        throw error;
      }
    },
    deleteTransaction: async (_, { transactionId }, context) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
          throw new Error('Transaction not found');
        }
        if (transaction.userId.toString() !== context.getUser()._id.toString()) {
          throw new Error('Unauthorized');
        }
        await Transaction.findByIdAndDelete(transactionId);
        return transaction;
      } catch (error) {
        throw error;
      }
    },
  },
};

export default transactionResolver;
