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
      className="relative min-h-screen w-full overflow-hidden bg-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Background gradients */}
      <div className="absolute left-[-150px] top-[-150px] z-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-green-300 to-teal-300 opacity-40 blur-[150px]"></div>
      <div className="absolute bottom-[-150px] right-[-150px] z-0 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-teal-300 to-sky-300 opacity-40 blur-[150px]"></div>

      {/* Main content */}
      <div className="relative z-10 flex mt-4 justify-center px-4 pt-24">
        <div className="text-center w-full md:w-[49%]">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            Manage Your Scientific Research Projects Efficiently
          </motion.h1>
          <motion.p
            className="mt-4 max-w-xl text-gray-600 mx-auto"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            A comprehensive platform for researchers to collaborate, track
            progress, and manage scientific projects from inception to
            completion.
          </motion.p>
          <motion.div
            className="mt-6 flex w-full flex-col md:flex-row md:justify-center gap-4"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <button className="w-full md:w-auto rounded-md bg-emerald-700 px-5 py-2 font-semibold cursor-pointer text-white transition duration-300 ease-in-out hover:bg-emerald-500 active:scale-95">
              Browse Projects
            </button>
          </motion.div>
        </div>
      </div>

      {/* Features section */}
      <section className="py-4 pt-16 px-4 bg-white">
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto"
          style={{ perspective: "1000px" }} // for 3D effect
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

export default HomeBanner;
