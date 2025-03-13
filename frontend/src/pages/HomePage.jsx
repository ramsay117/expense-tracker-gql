import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { MdLogout } from 'react-icons/md';
import toast from 'react-hot-toast';
import Cards from '../components/Cards.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import { LOGOUT } from '../graphql/mutations/user.mutation.js';
import { GET_AUTHENTICATED_USER } from '../graphql/queries/user.query.js';
import { GET_CATEGORY_STATS } from '../graphql/queries/transaction.query.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const { data } = useQuery(GET_CATEGORY_STATS);
  const { data: authData } = useQuery(GET_AUTHENTICATED_USER);
  const [logout, { loading, client }] = useMutation(LOGOUT, {
    update: (cache) => {
      cache.writeQuery({
        query: GET_AUTHENTICATED_USER,
        data: { authUser: null },
      });
    },
  });

  const [chartData, setCharData] = useState({
    labels: [],
    datasets: [
      {
        label: '₹',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        borderRadius: 30,
        spacing: 10,
        cutout: 130,
      },
    ],
  });

  useEffect(() => {
    if (!data?.categoryStats) return;
    const labels = data.categoryStats.map((stat) => stat.category);
    const backgroundColors = labels.map((label) => {
      if (label.toLowerCase() === 'saving') return 'rgba(75, 192, 192)';
      if (label.toLowerCase() === 'expense') return 'rgba(255, 99, 132)';
      if (label.toLowerCase() === 'investment') return 'rgba(54, 162, 235)';
      return 'rgba(201, 203, 207)';
    });
    setCharData((prev) => ({
      labels,
      datasets: [
        {
          ...prev.datasets[0],
          data: data.categoryStats.map((stat) => stat.totalAmount),
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
        },
      ],
    }));
  }, [data]);

  const handleLogout = async () => {
    try {
      await logout();
      client.clearStore();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center">
        <div className="flex items-center">
          <p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
            Spend wisely, track wisely
          </p>
          <img
            src={authData?.authUser.profilePic || ''}
            className="w-11 h-11 rounded-full border cursor-pointer"
            alt="Avatar"
          />
          {!loading && <MdLogout className="mx-2 w-5 h-5 cursor-pointer" onClick={handleLogout} />}
          {loading && <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>}
        </div>
        <div className="flex flex-wrap w-full justify-center items-center gap-6">
          {data?.categoryStats.length > 0 && (
            <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
              <Doughnut data={chartData} />
            </div>
          )}
          <TransactionForm />
        </div>
        <Cards />
      </div>
    </>
  );
};

export default HomePage;
