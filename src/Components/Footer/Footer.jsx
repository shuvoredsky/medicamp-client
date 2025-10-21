import React from "react";
import { FaFacebook, FaInstagramSquare, FaTwitter } from "react-icons/fa";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col items-center text-center space-y-10">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          <div className="lg:ml-40">
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:underline  hover:text-secondary">
                  Home
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">
              About MediCamp Connect
            </h3>
            <p className="text-sm leading-relaxed mb-3">
              WhereIsIt helps you reunite with lost items and connect with
              honest finders. A community built on trust and kindness. ❤️
            </p>
            <p className="text-sm hover:text-secondary cursor-pointer">
              📧 support@medicampconnect.com
            </p>
            <p className="text-sm">📞 +880 1234 567890</p>
          </div>

          <div className="lg:ml-20">
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Follow Us
            </h3>
            <div className="flex justify-center md:justify-start space-x-5 text-2xl">
              <a href="#" aria-label="Facebook" className="hover:text-info">
                <FaFacebook />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-info">
                <FaTwitter />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-accent">
                <FaInstagramSquare />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-base-content/20 w-full pt-6 text-sm text-neutral">
          © {new Date().getFullYear()} MediCamp Connect Community. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
