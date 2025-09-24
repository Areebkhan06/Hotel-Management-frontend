import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="relative bg-gray-50 py-16 px-6 lg:px-20">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600">
          We’d love to hear from you. Reach out with any questions, bookings, or feedback!
        </p>
      </div>

      {/* Contact Section */}
      <div className="grid md:grid-cols-2 gap-10 items-start max-w-6xl mx-auto">
        {/* Contact Details */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <MapPin className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Our Location</h3>
              <p className="text-gray-600">123 Paradise Street, Goa, India</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Phone className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Phone</h3>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Mail className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Email</h3>
              <p className="text-gray-600">info@yourhotel.com</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Map Embed */}
      {/* <div className="mt-16">
        <iframe
          title="Hotel Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12089.000000!2d73.8567!3d15.2993"
          width="100%"
          height="400"
          allowFullScreen=""
          loading="lazy"
          className="rounded-2xl shadow-lg"
        ></iframe>
      </div> */}
    </div>
  );
};

export default Contact;
