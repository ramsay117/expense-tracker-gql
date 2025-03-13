import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useMutation } from '@apollo/client';
import { BackgroundGradient } from '../components/ui/background-gradient.jsx';
import InputField from '../components/InputField.jsx';
import RadioButton from '../components/RadioButton.jsx';
import { SIGNUP } from '../graphql/mutations/user.mutation.js';
import { GET_AUTHENTICATED_USER } from '../graphql/queries/user.query.js';

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: '',
    username: '',
    password: '',
    gender: '',
  });

  const [signup, { loading }] = useMutation(SIGNUP, {
    refetchQueries: [GET_AUTHENTICATED_USER],
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'radio') {
      setSignupData((prevData) => ({
        ...prevData,
        gender: value,
      }));
    } else {
      setSignupData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({
        variables: {
          input: signupData,
        },
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex rounded-lg overflow-hidden z-50 bg-gray-300">
        <BackgroundGradient>
          <div className="w-full bg-gray-100 min-w-80 sm:min-w-96 flex items-center justify-center rounded">
            <div className="max-w-md w-full p-6">
              <h1 className="text-3xl font-semibold mb-6 text-black text-center">Sign Up</h1>
              <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
                Join to keep track of your expenses
              </h1>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <InputField
                  label="Full Name"
                  id="fullName"
                  name="fullName"
                  value={signupData.fullName}
                  onChange={handleChange}
                />
                <InputField
                  label="Username"
                  id="username"
                  name="username"
                  value={signupData.username}
                  onChange={handleChange}
                />

                <InputField
                  label="Password"
                  id="password"
                  name="password"
                  type="password"
                  value={signupData.password}
                  onChange={handleChange}
                />
                <div className="flex gap-10">
                  <RadioButton
                    id="male"
                    label="Male"
                    name="gender"
                    value="male"
                    onChange={handleChange}
                    checked={signupData.gender === 'male'}
                  />
                  <RadioButton
                    id="female"
                    label="Female"
                    name="gender"
                    value="female"
                    onChange={handleChange}
                    checked={signupData.gender === 'female'}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black  focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Sign Up'}
                  </button>
                </div>
              </form>
              <div className="mt-4 text-sm text-gray-600 text-center">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="text-black hover:underline">
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </BackgroundGradient>
      </div>
    </div>
  );
};

export default SignupPage;
