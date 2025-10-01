import { FaEnvelope, FaFacebook, FaGithub, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaTwitter } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="relative footer text-white">
      {/* Gradient/Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80 dark:from-gray-900/70 dark:via-gray-900/80 dark:to-gray-900/90" />

      {/* Top divider to separate from content above */}
      <div className="absolute top-0 left-0 right-0 border-t border-gray-200/20 dark:border-gray-700/40" />

      {/* Content container */}
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left: Brand */}
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Escape The Matrix!
            </h2>
            <p className="mt-2 text-gray-200/90">
              Live, Enjoy & Explore
            </p>
            {/* Social icons - visible on mobile here */}
            <div className="flex items-center gap-3 mt-6 md:hidden">
              <a href="https://facebook.com/niiazmorshed" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-105">
                <FaFacebook className="text-white text-lg" />
              </a>
              <a href="https://instagram.com/niiazmorshed" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-105">
                <FaInstagram className="text-white text-lg" />
              </a>
              <a href="https://twitter.com/niiazmorshed" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-105">
                <FaTwitter className="text-white text-lg" />
              </a>
              <a href="https://github.com/niiazmorshed" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-105">
                <FaGithub className="text-white text-lg" />
              </a>
            </div>
          </div>

          {/* Center: Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-gray-200/90">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-blue-300" />
                <span>
                  Merul Badda DIT Project,
                  <br /> Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-blue-300" />
                <a href="tel:+8801734804733" className="hover:text-white transition-colors">+880 1734-804733</a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-blue-300" />
                <a href="mailto:niazmorshedrafi@gmail.com" className="hover:text-white transition-colors">niazmorshedrafi@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Right: Newsletter + Social */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="relative group">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
                <button className="mt-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </form>

            {/* Social icons - desktop */}
            <div className="hidden md:flex items-center gap-3 mt-6">
              <a href="https://facebook.com/niiazmorshed" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-105">
                <FaFacebook className="text-white text-lg" />
              </a>
              <a href="https://instagram.com/niiazmorshed" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-105">
                <FaInstagram className="text-white text-lg" />
              </a>
              <a href="https://twitter.com/niiazmorshed" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-105">
                <FaTwitter className="text-white text-lg" />
              </a>
              <a href="https://github.com/niiazmorshed" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-105">
                <FaGithub className="text-white text-lg" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-gray-300">
          <p>© {new Date().getFullYear()} Escape The Matrix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;