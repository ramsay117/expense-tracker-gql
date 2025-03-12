const InputField = ({ label, id, name, type = 'text', onChange, value }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        className="mt-1 p-2 w-full border rounded-md text-black focus:outline-none focus:ring-2"
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputField;
