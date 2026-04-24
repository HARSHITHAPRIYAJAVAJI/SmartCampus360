import React from 'react';
import PublicSearch from '@/components/public/PublicSearch';
import Layout from '@/components/common/Layout';
import { motion } from 'framer-motion';
import { MapPin, Users, Building2, Navigation } from 'lucide-react';

const CampusLocator = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/30">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-3xl" />
        </div>

        <section className="relative pt-24 pb-12">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight"
              >
                Campus <span className="text-primary italic">Locator</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
              >
                Quickly find laboratories, administrative offices, and check the real-time location of faculty members across our smart campus.
              </motion.p>
            </div>

            <div className="relative z-20">
              <PublicSearch />
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Block-wise Tracking</h3>
                <p className="text-sm text-slate-500">Every room is mapped to its specific block and floor for easy navigation.</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Faculty Finder</h3>
                <p className="text-sm text-slate-500">Locate staff members based on their current academic timetable slots.</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Instant Facilities</h3>
                <p className="text-sm text-slate-500">Find the Library, Placement Cell, or Admin Office in just one click.</p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default CampusLocator;
