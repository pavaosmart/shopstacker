import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

const Forms = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birthdate: '',
    country: '',
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div>
      {/* Form content */}
      <form>
        <div>
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label>Password</label>
          <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        <div>
          <label>Confirm Password</label>
          <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
        </div>
        <div>
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label>Birthdate</label>
          <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
        </div>
        <div>
          <label>Country</label>
          <input type="text" name="country" value={formData.country} onChange={handleChange} />
        </div>
        <div>
          <label>
            <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} />
            Accept Terms
          </label>
        </div>
        <button type="submit">
          <Check /> Submit
        </button>
        <button type="button" onClick={() => setStep(1)}>
          <X /> Cancel
        </button>
      </form>
    </div>
  );
};

export default Forms;
