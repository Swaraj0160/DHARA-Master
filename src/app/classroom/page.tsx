"use client";

import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Users, GraduationCap, TrendingUp, AlertCircle, BarChart3, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

export default function ClassroomMode() {
  const stats = [
    { label: "Total Students", value: "32", icon: <Users /> },
    { label: "Quest Completion", value: "84%", icon: <GraduationCap /> },
    { label: "Avg Heritage Score", value: "78%", icon: <TrendingUp /> },
  ];

  return (
    <div className="min-h-screen bg-parchment-200 flex flex-col">
      <Navigation />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-earth-900 mb-3 flex items-center gap-4 drop-shadow-sm">
              <BarChart3 className="text-gold-600 w-10 h-10" /> Educator Dashboard
            </h1>
            <p className="text-earth-600 text-xl">Class: History Grade 8 (Section A)</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="lg" className="bg-white border-parchment-300 text-earth-800">Generate Join Code</Button>
            <Button size="lg" className="shadow-md hover:shadow-lg">Assign New Quest</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className="bg-parchment-100 p-8 flex items-center gap-6 shadow-md border-gold-500/20 hover:-translate-y-1 transition-transform">
                <div className="bg-gold-500/20 p-5 rounded-2xl text-gold-600 border border-gold-500/30">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-earth-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-4xl font-serif text-earth-900">{stat.value}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-parchment-100 p-8 h-full shadow-md">
              <h2 className="font-serif text-3xl text-earth-900 mb-6 border-b border-parchment-300 pb-4">Knowledge Mastery</h2>
              
              <div className="space-y-8 mt-8">
                <div>
                  <div className="flex justify-between text-sm font-bold text-earth-900 mb-3">
                    <span className="flex items-center gap-2 text-green-700 uppercase tracking-wide"><TrendingUp size={18}/> Strongest Topic: Ancient Education</span>
                    <span className="text-lg">92%</span>
                  </div>
                  <div className="w-full bg-parchment-300 rounded-full h-3 shadow-inner">
                    <div className="bg-green-500 h-3 rounded-full shadow-sm" style={{ width: '92%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm font-bold text-earth-900 mb-3 uppercase tracking-wide">
                    <span>Cultural Awareness</span>
                    <span className="text-lg">85%</span>
                  </div>
                  <div className="w-full bg-parchment-300 rounded-full h-3 shadow-inner">
                    <div className="bg-gold-500 h-3 rounded-full shadow-sm" style={{ width: '85%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-bold text-earth-900 mb-3">
                    <span className="flex items-center gap-2 text-red-700 uppercase tracking-wide"><AlertCircle size={18}/> Needs Improvement: Ancient Geography</span>
                    <span className="text-lg">62%</span>
                  </div>
                  <div className="w-full bg-parchment-300 rounded-full h-3 shadow-inner">
                    <div className="bg-red-500 h-3 rounded-full shadow-sm" style={{ width: '62%' }} />
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-parchment-300 bg-blue-50/50 p-4 rounded-xl border border-blue-200/50">
                <p className="text-sm text-blue-900 font-medium flex gap-3">
                  <BrainCircuit className="w-5 h-5 flex-shrink-0 text-blue-600" />
                  <span>AI Recommendation: Assign the &ldquo;Map of Janapadas&rdquo; quest to improve geographical understanding across the class.</span>
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-parchment-100 p-8 h-full shadow-md">
              <h2 className="font-serif text-3xl text-earth-900 mb-6 border-b border-parchment-300 pb-4">Recent Student Activity</h2>
              <div className="space-y-4">
                {[
                  { name: "Rahul S.", action: "Completed Nalanda Quest", score: "95/100", time: "10 mins ago" },
                  { name: "Priya M.", action: "Unlocked Ajanta Caves", score: "-", time: "1 hour ago" },
                  { name: "Arjun K.", action: "Struggling with Scholar Challenge", score: "Attempt 3", time: "2 hours ago", alert: true },
                  { name: "Sneha R.", action: "Completed Nalanda Quest", score: "88/100", time: "Yesterday" },
                ].map((activity, idx) => (
                  <div key={idx} className={`p-5 rounded-xl flex items-center justify-between border ${activity.alert ? 'bg-red-50 border-red-200' : 'bg-parchment-200 border-parchment-300 hover:border-gold-500/50 transition-colors'}`}>
                    <div>
                      <p className="font-bold text-earth-900 text-lg mb-1">{activity.name}</p>
                      <p className="text-sm text-earth-600">{activity.action}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${activity.alert ? 'text-red-700' : 'text-earth-900'}`}>{activity.score}</p>
                      <p className="text-xs text-earth-500 uppercase tracking-widest font-semibold mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-6 py-6" variant="outline">View Full Student Roster</Button>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
