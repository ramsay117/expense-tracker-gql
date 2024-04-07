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
        console.log('Error in transactions query:', error);
        throw new Error(error.message || 'Internal Server Error');
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
        console.log('Error in transaction query:', error);
        throw new Error(error.message || 'Internal Server Error');
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
          if (categoryAmountMap[transaction.category]) {
            categoryAmountMap[transaction.category] += transaction.amount;
          } else {
            categoryAmountMap[transaction.category] = transaction.amount;
          }
        });
        return Object.entries(categoryAmountMap).map(
          ([category, totalAmount]) => ({
            category,
            totalAmount,
          })
        );
      } catch (error) {
        console.log('Error in categoryStats query:', error);
        throw new Error(error.message || 'Internal Server Error');
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
        console.log('Error in createTransaction:', error);
        throw new Error(error.message || 'Internal Server Error');
      }
    },
    updateTransaction: async (_, { input }, context) => {
      try {
        const { transactionId, ...rest } = input;
        const transaction = await Transaction.findById(input.transactionId);
        if (!transaction) {
          throw new Error('Transaction not found');
        }
        if (
          transaction.userId.toString() !== context.getUser()._id.toString()
        ) {
          throw new Error('Unauthorized');
        }
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          transactionId,
          rest,
          {
            new: true,
          }
        );
        return updatedTransaction;
      } catch (error) {
        console.log('Error in updateTransaction:', error);
        throw new Error(error.message || 'Internal Server Error');
      }
    },
    deleteTransaction: async (_, { transactionId }, context) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
          throw new Error('Transaction not found');
        }
        if (
          transaction.userId.toString() !== context.getUser()._id.toString()
        ) {
          throw new Error('Unauthorized');
        }
        await Transaction.findByIdAndDelete(transactionId);
        return transaction;
      } catch (error) {
        console.log('Error in deleteTransaction:', error);
        throw new Error(error.message || 'Internal Server Error');
      }
    },
  },
};

export default transactionResolver;
