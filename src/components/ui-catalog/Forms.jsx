import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const Forms = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form validation logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">Forms</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <Input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="relative mt-1">
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <Select name="gender" value={formData.gender} onChange={handleChange} className="mt-1">
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Birthdate</label>
          <Input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} className="mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <Input type="text" name="country" value={formData.country} onChange={handleChange} className="mt-1" />
        </div>
        <div className="flex items-center">
          <Checkbox
            id="terms"
            name="terms"
            checked={formData.terms}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, terms: checked }))}
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            I agree to the terms and conditions
          </label>
        </div>
        <div className="flex space-x-4">
          <Button type="submit" className="flex items-center">
            <Check className="mr-2" size={20} /> Submit
          </Button>
          <Button type="button" variant="outline" className="flex items-center">
            <X className="mr-2" size={20} /> Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Forms;