import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="text-center py-16 bg-blue-100">
          <h1 className="text-4xl font-bold mb-4">Welcome to My-App</h1>
        </section>

        <section className="py-10 px-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="space-y-2 text-gray-800">
            <li> User Authentication</li>
            <li> Profile Management</li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
