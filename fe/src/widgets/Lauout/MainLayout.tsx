import { Header } from 'widgets/Header';
import { Footer } from 'widgets/Footer';

export const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-gray-100">
    <Header />
    <main className="flex-1 w-full max-w-2xl mx-auto p-8">{children}</main>
    <Footer />
  </div>
);
