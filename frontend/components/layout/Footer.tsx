import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="container-custom py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-white">el</span>
              <span className="text-2xl font-bold text-accent">Container</span>
            </Link>
            <p className="text-gray-300 text-sm">
              Tu destino para las mejores fragancias. Descubre perfumes de las marcas mas exclusivas.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/productos" className="text-gray-300 hover:text-white transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/productos?gender=masculino" className="text-gray-300 hover:text-white transition-colors">
                  Perfumes Hombre
                </Link>
              </li>
              <li>
                <Link href="/productos?gender=femenino" className="text-gray-300 hover:text-white transition-colors">
                  Perfumes Mujer
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>info@elcontainer.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>Ciudad, Pais</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Siguenos</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-secondary-600 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-secondary-600 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-600 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} elContainer Perfumeria. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
