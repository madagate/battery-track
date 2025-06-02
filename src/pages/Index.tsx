
import { useState } from "react";
import { Calendar, Users, StickyNote, TrendingUp, Globe } from "lucide-react";
import Header from "@/components/Header";
import DailyPurchases from "@/components/DailyPurchases";
import CustomerManagement from "@/components/CustomerManagement";
import StickyNotes from "@/components/StickyNotes";
import Statistics from "@/components/Statistics";

type Language = 'ar' | 'en';
type ActiveTab = 'purchases' | 'customers' | 'notes' | 'stats';

const Index = () => {
  const [language, setLanguage] = useState<Language>('ar');
  const [activeTab, setActiveTab] = useState<ActiveTab>('purchases');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const isRTL = language === 'ar';

  const translations = {
    ar: {
      dailyPurchases: "المشتريات اليومية",
      customerManagement: "إدارة العملاء", 
      notes: "الملاحظات",
      statistics: "الإحصائيات"
    },
    en: {
      dailyPurchases: "Daily Purchases",
      customerManagement: "Customer Management",
      notes: "Notes", 
      statistics: "Statistics"
    }
  };

  const t = translations[language];

  const tabs = [
    { id: 'purchases' as ActiveTab, label: t.dailyPurchases, icon: Calendar },
    { id: 'customers' as ActiveTab, label: t.customerManagement, icon: Users },
    { id: 'notes' as ActiveTab, label: t.notes, icon: StickyNote },
    { id: 'stats' as ActiveTab, label: t.statistics, icon: TrendingUp },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-tajawal ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Header 
        language={language} 
        setLanguage={setLanguage}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      
      <div className="container mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-2">
          <div className="flex space-x-1 rtl:space-x-reverse">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-3 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {activeTab === 'purchases' && <DailyPurchases language={language} selectedDate={selectedDate} />}
          {activeTab === 'customers' && <CustomerManagement language={language} />}
          {activeTab === 'notes' && <StickyNotes language={language} />}
          {activeTab === 'stats' && <Statistics language={language} />}
        </div>
      </div>
    </div>
  );
};

export default Index;
