import { CartDrawer, CartPill } from "@/components/Cart";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import Nav from "@/components/Nav";
import RollScene from "@/components/RollScene";
import Signatures from "@/components/Signatures";
import Story from "@/components/Story";
import Visit from "@/components/Visit";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <RollScene />
        <Story />
        <Signatures />
        <Menu />
        <Visit />
      </main>
      <Footer />
      <CartPill />
      <CartDrawer />
    </>
  );
}
