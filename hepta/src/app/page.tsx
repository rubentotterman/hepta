import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <a href="/" className="text-xl font-bold">
          Hepta
        </a>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm hover:text-orange-400">
            Google ads
          </a>
          <a href="#" className="text-sm hover:text-orange-400">
            AI workshop
          </a>
          <a href="#" className="text-sm hover:text-orange-400">
            Innholdsproduksjon
          </a>
          <a href="#" className="text-sm hover:text-orange-400">
            SEO
          </a>
          <Button className="bg-[#E67E22] hover:bg-[#E67E22]/90 text-white">Login</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Vi er Hepta, utviklere, markedsførere og problemløsere
          </h1>
          <p className="text-gray-400 mb-8">
            Vårt team av erfarne utviklere, designere og produktledere hjelper deg å realisere ideene dine. Enten du er
            en startup eller et stort selskap, har vi deg dekket.
          </p>
          <Button className="bg-[#E67E22] hover:bg-[#E67E22]/90 text-white">Start nå</Button>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-4">Hva vi gjør</h2>
        <p className="text-gray-400 mb-12">Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-lg p-6 aspect-[4/3]">
              <h3 className="text-black font-semibold mb-2">Lorem Ipsum</h3>
              <p className="text-[#E67E22]">Lorem Ipsum</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white rounded-lg aspect-video w-full"></div>
          <div>
            <h2 className="text-3xl font-bold mb-8">Hvem er vi</h2>
            <Button className="bg-[#E67E22] hover:bg-[#E67E22]/90 text-white w-full">Mer om oss</Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Klar for å samarbeide med oss?</h2>
        <p className="text-gray-400 mb-8">
          Tell us a bit about your project, and we'll get back to you within 24 hours
        </p>
        <form className="space-y-4">
          <Input type="email" placeholder="Email" className="bg-[#FAF6F1] border-none text-black" />
          <Textarea placeholder="Melding" className="bg-[#FAF6F1] border-none text-black min-h-[120px]" />
          <Button type="submit" className="bg-[#E67E22] hover:bg-[#E67E22]/90 text-white w-full">
            Start nå
          </Button>
        </form>
      </section>
    </div>
  )
}

