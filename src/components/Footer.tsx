import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold mb-4">About</h3>
            <p className="text-sm text-gray-600">
              A comprehensive platform for choristers and worship leaders
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/songs" className="text-gray-600 hover:text-purple-600">
                  Songs
                </Link>
              </li>
              <li>
                <Link href="/hymns" className="text-gray-600 hover:text-purple-600">
                  Hymns
                </Link>
              </li>
              <li>
                <Link href="/metronome" className="text-gray-600 hover:text-purple-600">
                  Metronome
                </Link>
              </li>
              <li>
                <Link href="/drummer" className="text-gray-600 hover:text-purple-600">
                  Drummer
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-purple-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-purple-600">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/extras" className="text-gray-600 hover:text-purple-600">
                  Extras
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <p className="text-sm text-gray-600">contact@choristercorner.com</p>
            <p className="text-sm text-gray-600 mt-2">Within 24-48 hours</p>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2025 ChoristerCorner. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
