import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Target, 
  CheckSquare, 
  ArrowRight, 
  BarChart3, 
  Zap,
  ChevronRight
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-white">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-6 animate-fade-in">
                <Zap size={16} className="mr-2" />
                <span>Next-Gen CRM for modern teams</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Close more deals with <span className="text-indigo-600">less effort</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
                The CRM that works for you. Manage contacts, track deals, and organize tasks in one beautiful, integrated workspace.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/signup"
                  className="flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all"
                >
                  Start Scaling Now <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link
                  to="/login"
                  className="flex items-center justify-center px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-200 transition-all"
                >
                  Live Demo
                </Link>
              </div>
              <div className="mt-10 flex items-center text-sm text-gray-500">
                <div className="flex -space-x-2 mr-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                    </div>
                  ))}
                </div>
                <span>Trusted by 2,000+ sales professionals</span>
              </div>
            </div>
            
            <div className="lg:w-1/2 lg:pl-12">
              <div className="relative">
                <div className="absolute -inset-4 bg-indigo-500/10 rounded-3xl blur-2xl"></div>
                <div className="relative bg-white border border-gray-100 rounded-3xl shadow-2xl overflow-hidden animate-float">
                  <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="text-xs text-gray-400 font-medium tracking-tight">CRM DASHBOARD</div>
                  </div>
                  <div className="p-8">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="h-24 bg-indigo-50 rounded-2xl flex flex-col justify-center px-6">
                        <div className="text-indigo-600 font-bold text-2xl">$42,900</div>
                        <div className="text-indigo-400 text-xs uppercase tracking-wider font-semibold">Active Pipeline</div>
                      </div>
                      <div className="h-24 bg-emerald-50 rounded-2xl flex flex-col justify-center px-6">
                        <div className="text-emerald-600 font-bold text-2xl">24</div>
                        <div className="text-emerald-400 text-xs uppercase tracking-wider font-semibold">New Leads</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center p-4 border border-gray-50 rounded-xl">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${i === 1 ? 'bg-blue-100 text-blue-600' : i === 2 ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                            {i === 1 ? <Target size={20} /> : i === 2 ? <Users size={20} /> : <CheckSquare size={20} />}
                          </div>
                          <div className="flex-1">
                            <div className="h-2.5 w-24 bg-gray-200 rounded-full mb-2"></div>
                            <div className="h-2 w-16 bg-gray-100 rounded-full"></div>
                          </div>
                          <ChevronRight size={16} className="text-gray-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need in one place</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Focus on what matters—building relationships and closing deals.
          </p>
        </div>

        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Users className="text-blue-600" />,
              title: "Contact Management",
              desc: "Store detailed information about every client and prospect in a centralized, searchable database."
            },
            {
              icon: <Target className="text-emerald-600" />,
              title: "Deal Tracking",
              desc: "Visualize your entire sales funnel. Keep deals moving through stages from lead to closed-won."
            },
            {
              icon: <CheckSquare className="text-orange-600" />,
              title: "Task Automation",
              desc: "Never miss a follow-up. Create tasks, set due dates, and track your to-do lists effortlessly."
            }
          ].map((feature, idx) => (
            <div key={idx} className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center text-indigo-50">
            <div>
              <div className="text-4xl font-bold text-white mb-2">99%</div>
              <p>Customer Satisfaction</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24h</div>
              <p>Avg. Support Response</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">350k</div>
              <p>Deals Managed</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">12M+</div>
              <p>Revenue Tracked</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 text-center">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center mb-6">
            <BarChart3 className="text-indigo-600 mr-2" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">ModernCRM</span>
          </div>
          <p className="text-gray-500 text-sm mb-4">© 2026 ModernCRM Inc. Built for productivity.</p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
