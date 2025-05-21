import HomeBanner from "./components/banner";
import FeaturedProjects from "./components/featured-projects";
import Footer from "@/components/layout/footer";

function UserHome() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <HomeBanner />
        <FeaturedProjects />
      </main>
      <Footer />
    </div>
  );
}

export default UserHome;
