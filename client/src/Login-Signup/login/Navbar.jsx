import React, { useState } from "react";
import { Switch } from '@headlessui/react';
import { motion } from 'framer-motion';

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <nav className="flex justify-between items-center h-16 px-4 navbar bg-blue-700 dark:bg-gray-900 shadow-lg">
      <motion.div whileHover={{ scale: 1.05 }} className="font-bold text-white dark:text-gray-200 text-3xl">
        LOGO
      </motion.div>
      <div className="flex text-white dark:text-gray-200 font-semibold gap-6">
        <motion.div whileHover={{ scale: 1.1 }} className="hover:underline hover:cursor-pointer">Home</motion.div>
        <motion.div whileHover={{ scale: 1.1 }} className="hover:underline hover:cursor-pointer">Process</motion.div>
        <motion.div whileHover={{ scale: 1.1 }} className="hover:underline hover:cursor-pointer">Login</motion.div>
      </div>
      <div className="ml-4">
        <Switch
          checked={darkMode}
          onChange={setDarkMode}
          className={`${darkMode ? 'bg-blue-600' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
        >
          <span className="sr-only">Toggle dark mode</span>
          <span
            className={`${darkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>
    </nav>
  );
}

export default Navbar;
