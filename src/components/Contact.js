import React, { useState } from "react";
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:9000/api/contact", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Network response was not ok');
      setStatus("Message sent successfully!");
    } catch (error) {
      setStatus("Failed to send message. Try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-16">
      {/* Enhanced Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl mb-16 bg-gradient-to-r from-teal-600 to-blue-600 p-8 sm:p-16">
          <div className="relative z-10 text-center">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 animate-fade-in">
              Contact Us
            </h1>

            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              We'd love to hear from you. Send us a message, and we'll get back to you as soon as possible.
            </p>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10"></div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-6xl mx-auto mb-16 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* CEO Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden col-span-full md:col-span-1 transform transition duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="flex justify-center mt-6">
              <div className="relative w-36 h-36 rounded-full bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 p-1 shadow-lg">
                <div className="w-full h-full bg-white rounded-full overflow-hidden">
                  <img
                    src="/sfr.jpeg"
                    alt="Sunil F Rodd"
                    className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 text-center">
              <div className="uppercase tracking-wider text-sm text-teal-600 font-bold mb-2">Leadership</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sunil F Rodd</h2>
              <p className="text-gray-600 font-semibold text-lg">CEO & Founder</p>
              <p>jFork Technology Services Pvt.Ltd</p>
              <h2>sfroddjforkts@gmail.com</h2>
            </div>
          </div>

          {/* Developer Cards */}
          {/* <div className="bg-white rounded-2xl shadow-xl overflow-hidden md:col-span-1 transform transition duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="flex justify-center mt-7">
              <div className="relative w-36 h-36 rounded-full bg-gradient-to-r from-pink-400 via-yellow-500 to-orange-600 p-1 shadow-lg">
                <div className="w-full h-full bg-white rounded-full overflow-hidden">
                  <img
                    src="/shrey.jpg"
                    alt="Shreyash M Kulkarni"
                    className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
                  />
                </div>
              </div>
            </div>
            <div className="p-8 text-center">
              <div className="uppercase tracking-wider text-sm text-teal-600 font-bold mb-2">Development Team</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Shreyash M Kulkarni</h2>
              <p className="text-gray-600 font-semibold text-lg">Full Stack Web Dev</p>
              <h2>shreyashkulkarni03@gmail.com</h2>
            </div>
          </div> */}

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden md:col-span-1 transform transition duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="flex justify-center mt-6">
              <div className="relative w-36 h-36 rounded-full bg-gradient-to-r from-green-400 via-cyan-500 to-blue-600 p-1 shadow-lg">
                <div className="w-full h-full bg-white rounded-full overflow-hidden">
                  <img
                    src="/ani.jpg"
                    alt="Anirudh S More"
                    className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
                  />
                </div>
              </div>
            </div>
            <div className="p-8 text-center">
              <div className="uppercase tracking-wider text-sm text-teal-600 font-bold mb-2">Development Team</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Anirudh S More</h2>
              <p className="text-gray-600 font-semibold text-lg">Full Stack Web Dev</p>
              <h2>anirudhmore43@gmail.com</h2>
            </div>
          </div>
        </div>

        {/* Enhanced Contact Information */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-2xl shadow-xl transform transition duration-300 hover:shadow-2xl hover:-translate-y-1">
            <Mail className="h-8 w-8 text-teal-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600 text-lg">sfroddjforkts@gmail.com</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl transform transition duration-300 hover:shadow-2xl hover:-translate-y-1">
            <Phone className="h-8 w-8 text-teal-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 text-lg">+91 948 027 5919</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl transform transition duration-300 hover:shadow-2xl hover:-translate-y-1">
            <MapPin className="h-8 w-8 text-teal-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
            <p className="text-gray-600 text-lg">CIN: U80902KA2022PTC164766</p>
          </div>
        </div>

        {/* Enhanced Office Addresses */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white p-8 rounded-2xl shadow-xl transform transition duration-300 hover:shadow-2xl hover:-translate-y-1">
            <Building2 className="h-8 w-8 text-teal-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Head Office</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              jFork Technology Services<br />
              CTS 549, A1. Sonar galli,<br />
              M. Vadagaon, Belgaum - 590005<br />
              Karnataka
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl transform transition duration-300 hover:shadow-2xl hover:-translate-y-1">
            <Building2 className="h-8 w-8 text-teal-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Branch Office</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Flat No.103, Amar Elite Apartment<br />
              3rd Cross, Bhagyanagar<br />
              Belagavi - 590006
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;