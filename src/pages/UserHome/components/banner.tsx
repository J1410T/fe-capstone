import { FaClipboardList, FaUsers, FaChartBar } from "react-icons/fa";
import { motion } from "framer-motion";
import React from "react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <FaClipboardList className="text-emerald-700 text-2xl" />,
    title: "Project Management",
    description:
      "Create, track, and manage research projects with comprehensive tools for timeline management and milestone tracking.",
  },
  {
    icon: <FaUsers className="text-emerald-700 text-2xl" />,
    title: "Team Collaboration",
    description:
      "Add team members, assign roles, and collaborate effectively with integrated communication tools.",
  },
  {
    icon: <FaChartBar className="text-emerald-700 text-2xl" />,
    title: "Progress Tracking",
    description:
      "Monitor research progress, track results, and generate reports to keep stakeholders informed.",
  },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.2,
      ease: "easeOut",
    },
  }),
};

function HomeBanner() {
  return (
    <motion.div
      className="relative w-full overflow-hidden bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Hero Section - Full Screen */}
      <section className="relative min-h-[calc(100vh-65px)] flex flex-col items-center justify-center">
        {/* Background gradients */}
        <div className="absolute left-[-150px] top-[-150px] z-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-green-300 to-teal-300 opacity-40 blur-[150px]"></div>
        <div className="absolute bottom-[-150px] right-[-150px] z-0 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-teal-300 to-sky-300 opacity-40 blur-[150px]"></div>

        {/* Main content */}
        <div className="container max-w-screen-2xl flex flex-col items-center justify-center space-y-8 py-12 text-center z-10 px-4">
          <div className="space-y-6">
            <motion.h1
              className="bg-gradient-to-br from-emerald-800 from-30% via-emerald-700 to-emerald-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              Manage Your Scientific Research
              <br />
              Projects Efficiently
            </motion.h1>
            <motion.p
              className="mx-auto max-w-[42rem] text-base sm:text-xl leading-normal text-gray-600"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              A comprehensive platform for researchers to collaborate, track
              progress, and manage scientific projects from inception to
              completion.
            </motion.p>
          </div>
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <button className="rounded-md bg-emerald-700 px-6 py-3 font-semibold cursor-pointer text-white transition duration-300 ease-in-out hover:bg-emerald-600 active:scale-95">
              Explore Projects
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-sm text-gray-500 mb-2">Scroll to explore</p>
          <div className="w-6 h-10 border-2 border-emerald-700 rounded-full flex justify-center">
            <motion.div
              className="w-1.5 h-3 bg-emerald-700 rounded-full mt-2"
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features section */}
      <section className="py-16 px-4 bg-white">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          style={{ perspective: "1000px" }} // for 3D effect
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md text-center h-full"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={index}
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

export default HomeBanner;
