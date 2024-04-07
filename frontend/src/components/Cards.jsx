import { useQuery } from '@apollo/client';
import { GET_TRANSACTIONS } from '../graphql/queries/transaction.query.js';
import Card from './Card';
import { GET_AUTHENTICATED_USER } from '../graphql/queries/user.query.js';

const Cards = () => {
  const { data, loading } = useQuery(GET_TRANSACTIONS);
  const { data: authUserData } = useQuery(GET_AUTHENTICATED_USER);
  const authUser = authUserData?.authUser;

  return (
    <div className="w-full px-10 min-h-[40vh]">
      <p className="text-5xl font-bold text-center my-10">History</p>
      {loading ? (
        <p className="text-2xl font-bold text-center">Loading...</p>
      ) : data?.transactions.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20">
          {data.transactions.map((transaction) => (
            <Card
              key={transaction._id}
              transaction={transaction}
              authUser={authUser}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center w-full h-full">
          <p className="text-2xl font-bold text-center">No transactions yet</p>
        </div>
      )}
    </div>
  );
};

export default Cards;
