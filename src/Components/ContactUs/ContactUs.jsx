import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Lottie from "lottie-react";
import ContactLottie from "../../assets/lottie/Contact Us.json";

const ContactUs = () => {
  return (
    <div className="bg-teal-50 py-16 px-6 lg:px-20">
      {/* Header Section */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-teal-700 mb-4">
          Contact Us
        </h2>
        <p className="text-gray-600">
          Have questions about our medical camps? Reach out to us and we’ll be
          happy to help.
        </p>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-teal-700 mb-6">
            Get in Touch
          </h3>
          <ul className="space-y-6">
            <li className="flex items-center gap-4">
              <div className="bg-teal-100 text-teal-700 p-3 rounded-full">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-800 font-medium">Email</p>
                <p className="text-gray-600">support@medicamp.com</p>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <div className="bg-teal-100 text-teal-700 p-3 rounded-full">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-800 font-medium">Phone</p>
                <p className="text-gray-600">+880 1234 567 890</p>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <div className="bg-teal-100 text-teal-700 p-3 rounded-full">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-800 font-medium">Location</p>
                <p className="text-gray-600">Dhaka, Bangladesh</p>
              </div>
            </li>
          </ul>
        </div>

        <Lottie
          animationData={ContactLottie}
          loop={true}
          className="w-96 mx-auto mb-6"
        />
      </div>
    </div>
  );
};

export default ContactUs;
