import React, { useState } from "react";
import { motion } from "framer-motion";

interface LoginFormProps {
  title?: string;
  usernameLabel?: string;
  passwordLabel?: string;
  forgotPasswordText?: string;
  submitText?: string;
  cancelText?: string;
  onSubmit?: (data: { username: string; password: string }) => void;
  onCancel?: () => void;
  onForgotPassword?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  title = "Student Login",
  usernameLabel = "Username:*",
  passwordLabel = "Password:*",
  forgotPasswordText = "Forgot Password?",
  submitText = "Login",
  cancelText = "Cancel",
  onSubmit = () => {},
  onCancel = () => {},
  onForgotPassword = () => {},
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <motion.div
      className="bg-white w-full max-w-md rounded-xl shadow-2xl transform-gpu"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Header */}
      <motion.div 
        className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-t-xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-center text-white">
          {title}
        </h2>
      </motion.div>

      {/* Form Content */}
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.2 }}
          >
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {usernameLabel}
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                name="username"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ease-in-out bg-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.2 }}
          >
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {passwordLabel}
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ease-in-out bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.2 }}
            className="text-sm text-teal-600 hover:text-teal-700 text-center cursor-pointer font-medium transition-colors duration-200"
            onClick={onForgotPassword}
          >
            {forgotPasswordText}
          </motion.div>

          <motion.div
            className="flex gap-4"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.2 }}
          >
            <button
              type="submit"
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform-gpu transition-all duration-200 ease-in-out hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              {submitText}
            </button>
            <button
              type="button"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform-gpu transition-all duration-200 ease-in-out hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default LoginForm;