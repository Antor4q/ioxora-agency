import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";



interface WebsiteLayoutProps {
  children: React.ReactNode;
}

export default function WebsiteLayout({
  children,
}: WebsiteLayoutProps) {
  return (
    <>
     
     <Header/>
      <main>{children}</main>
     <Footer/>
    </>
  );
}