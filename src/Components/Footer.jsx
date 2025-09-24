import React from "react";
import { assets } from "../assets/assests";

const Footer = () => {
  return (
    <footer className="px-6 pt-8 w-full text-gray-500">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
        <div className="md:max-w-96">
          <div className="flex items-center gap-2">
            <img src={assets.logo} className="w-20" alt="" />
            <p className="uppercase text-[#8C7329] font-semibold">The Trans luxury hotel</p>
          </div>
          <p className="mt-6 text-sm">
            Welcome to The Trans Hotel, your perfect getaway destination for
            luxury, comfort, and personalized hospitality. Located in the heart
            of India, we offer premium rooms, top-notch amenities, and
            unforgettable experiences.
          </p>
        </div>
        <div className="flex-1 flex items-start md:justify-end gap-20">
          <div>
            <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About us</a>
              </li>
              <li>
                <a href="#">Contact us</a>
              </li>
              <li>
                <a href="#">Privacy policy</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-5 text-gray-800">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+1-212-456-7890</p>
              <p>contact@example.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="pt-4 text-center text-xs md:text-sm pb-5">
        Copyright 2025 © . All
        Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
