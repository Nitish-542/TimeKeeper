import React from "react";

const GeneralForm = ({
  handleSubmit,
  value,
  setValue,
  size,
  setSize,
  placeholder,
  sizePlaceholder,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className='mb-3'>
        <input
          type='text'
          className='form-control'
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className='mb-3'>
        <input
          type='text'
          className='form-control'
          placeholder={sizePlaceholder}
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
      </div>
      <button type='submit' className='btn btn-primary'>
        Submit
      </button>
    </form>
  );
};

export default GeneralForm;
