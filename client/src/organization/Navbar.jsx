import React, { useState } from "react";
import { FaHouseUser, FaSms, FaUserFriends, FaBars } from "react-icons/fa";
import { Switch } from '@headlessui/react';
import { motion } from 'framer-motion';

function Navbar(props) {
  const { setItr, Itr } = props;
  const [darkMode, setDarkMode] = useState(false);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <nav className="flex flex-col items-center bg-white dark:bg-gray-900 p-3 h-full shadow-lg min-h-screen">
      <div className="flex flex-col items-center w-full">
        <motion.div whileHover={{ scale: 1.1 }} className="mb-8 mt-4">
          <FaBars className="text-3xl text-gray-500 dark:text-gray-200 hover:cursor-pointer" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} className="mb-8">
          <FaHouseUser
            className="text-3xl text-gray-500 dark:text-gray-200 hover:cursor-pointer m-2"
            onClick={() => setItr(!Itr)}
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} className="mb-8">
          <FaUserFriends className="text-3xl text-gray-500 dark:text-gray-200 hover:cursor-pointer m-2" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} className="mb-8">
          <FaSms className="text-3xl text-gray-500 dark:text-gray-200 hover:cursor-pointer m-2" />
        </motion.div>
      </div>
      <div className="mt-auto mb-4">
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
