import { getCachedSportsData } from "@/lib/sports-cache";

export default async function Footer() {
  const { mensSports, womensSports, coedSports } = await getCachedSportsData();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company & Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Press
                </a>
              </li>
            </ul>

            <h3 className="text-white font-semibold mb-4 mt-6">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>

            <h3 className="text-white font-semibold mb-4 mt-6">Follow Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  YouTube
                </a>
              </li>
            </ul>
          </div>

          {/* Men's Sports & Coed */}
          <div>
            <h3 className="text-white font-semibold mb-4">Men&apos;s Sports</h3>
            <ul className="space-y-2 text-sm">
              {mensSports.map((sport) => (
                <li key={sport.id}>
                  <a
                    href={`/sports/${sport.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {sport.name}
                  </a>
                </li>
              ))}
            </ul>

            {coedSports.length > 0 && (
              <>
                <h3 className="text-white font-semibold mb-4 mt-6">Coed Sports</h3>
                <ul className="space-y-2 text-sm">
                  {coedSports.map((sport) => (
                    <li key={sport.id}>
                      <a
                        href={`/sports/${sport.slug}`}
                        className="hover:text-white transition-colors"
                      >
                        {sport.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Women's Sports */}
          <div>
            <h3 className="text-white font-semibold mb-4">Women&apos;s Sports</h3>
            <ul className="space-y-2 text-sm">
              {womensSports.map((sport) => (
                <li key={sport.id}>
                  <a
                    href={`/sports/${sport.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {sport.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; 2024 Athletix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
