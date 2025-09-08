'use client'

import { motion } from 'framer-motion';

export default function Landing() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-100 via-white to-slate-200 text-gray-800 px-6">
      <motion.div
        className="max-w-3xl text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-slate-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          AI-Powered Meme Generator
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl mb-4 text-slate-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Quickly create personalized and viral-worthy memes using advanced AI. Just upload your image, write a caption, and let the system generate magic.
        </motion.p>

        <motion.p
          className="text-base md:text-lg text-slate-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Perfect for content creators, marketers, or anyone looking to add a touch of humor and intelligence to their visuals.
        </motion.p>

        <motion.a
          href="#meme-input"
          className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          Get Started
        </motion.a>
      </motion.div>
    </section>
  );
}
