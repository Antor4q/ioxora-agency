
import Loader from "@/components/Loader";
import FooterN from "@/components/shared/FooterN";

import Navbar from "@/components/shared/NavbarN";
import SmoothScroll from "@/components/shared/SmoothScroll";



interface WebsiteLayoutProps {
  children: React.ReactNode;
}

export default function WebsiteLayout({
  children,
}: WebsiteLayoutProps) {
  return (
    <>
     <SmoothScroll>
 <Loader/>
     <Navbar/>
      <main>{children}</main>
      <FooterN/>
     {/* <Footer/> */}
     </SmoothScroll>
    </>
  );
}