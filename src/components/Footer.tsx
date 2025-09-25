export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-5xl mx-auto px-6 flex justify-between">
         {/* Logo and Copyright */}
         <div>
            <h3 className="text-2xl font-bold mb-4">Lembra</h3>
            <p className="text-gray-400 text-sm">
              © 2024 Lembra. All rights reserved.
            </p>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* First Column - Terms and Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/support" className="text-gray-400 hover:text-white transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>
          
          {/* Second Column - Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  X
                </a>
              </li>
            </ul>
          </div>
          
          {/* Third Column - Business Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Business</h4>
            <ul className="space-y-2">
              <li>
                <a href="/sponsor" className="text-gray-400 hover:text-white transition-colors">
                  Be a Sponsored Provider
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
