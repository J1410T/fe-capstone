import { motion } from "framer-motion";
import { Users, Target, Award, BookOpen } from "lucide-react";

const aboutFeatures = [
  {
    icon: <Target className="text-emerald-700 text-2xl" />,
    title: "Our Mission",
    description: "Empowering FPTU researchers and faculty with advanced tools to streamline university-level research project management."
  },
  {
    icon: <Users className="text-emerald-700 text-2xl" />,
    title: "FPTU Community",
    description: "Connecting researchers, faculty, and departments within FPT University to foster collaboration and innovation."
  },
  {
    icon: <Award className="text-emerald-700 text-2xl" />,
    title: "Academic Excellence",
    description: "Supporting FPTU's commitment to high-quality research and maintaining academic standards across all projects."
  },
  {
    icon: <BookOpen className="text-emerald-700 text-2xl" />,
    title: "Knowledge Advancement",
    description: "Facilitating university-level research that contributes to FPTU's academic reputation and student learning."
  }
];

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

function AboutUs() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            className="text-3xl font-bold text-gray-900 mb-4"
            variants={fadeInUp}
            custom={0}
          >
            About FPTU Research Platform
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            variants={fadeInUp}
            custom={1}
          >
            Our comprehensive platform is designed specifically for FPT University's 
            research community, streamlining project management and fostering academic 
            collaboration across all departments and faculties.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {aboutFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-6"
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
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          custom={4}
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join FPTU Research Community
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Whether you're a researcher, principal investigator, department representative, 
              or part of the university's appraisal council, our platform provides the tools 
              you need to manage and advance research projects at FPT University.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-emerald-700 font-medium">
              <span className="bg-white px-4 py-2 rounded-full shadow-sm">
                🔬 FPTU Researchers
              </span>
              <span className="bg-white px-4 py-2 rounded-full shadow-sm">
                👨‍🏫 Principal Investigators
              </span>
              <span className="bg-white px-4 py-2 rounded-full shadow-sm">
                🏛️ Host Institutions
              </span>
              <span className="bg-white px-4 py-2 rounded-full shadow-sm">
                ⚖️ Appraisal Councils
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutUs;
