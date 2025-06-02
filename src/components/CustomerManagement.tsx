
import { useState } from "react";
import { Search, Phone, MessageCircle, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Language = 'ar' | 'en';

interface Customer {
  id: string;
  name: string;
  phone: string;
  lastPurchase: string;
  totalPurchases: number;
  totalAmount: number;
  averagePrice: number;
  preferredLanguage: 'ar' | 'en' | 'hi' | 'bn';
}

interface CustomerManagementProps {
  language: Language;
}

const CustomerManagement = ({ language }: CustomerManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Sample customers data
  const [customers] = useState<Customer[]>([
    {
      id: '1',
      name: 'أحمد محمد',
      phone: '+966501234567',
      lastPurchase: '2024-01-15',
      totalPurchases: 15,
      totalAmount: 4500,
      averagePrice: 300,
      preferredLanguage: 'ar'
    },
    {
      id: '2', 
      name: 'فهد العتيبي',
      phone: '+966507654321',
      lastPurchase: '2024-01-10',
      totalPurchases: 8,
      totalAmount: 2400,
      averagePrice: 300,
      preferredLanguage: 'ar'
    },
    {
      id: '3',
      name: 'John Smith', 
      phone: '+966551234567',
      lastPurchase: '2024-01-05',
      totalPurchases: 12,
      totalAmount: 3600,
      averagePrice: 300,
      preferredLanguage: 'en'
    }
  ]);

  const translations = {
    ar: {
      customerManagement: "إدارة العملاء",
      searchCustomers: "البحث في العملاء...",
      customerList: "قائمة العملاء",
      customerDetails: "تفاصيل العميل",
      name: "الاسم",
      phone: "الهاتف",
      lastPurchase: "آخر شراء",
      totalPurchases: "إجمالي المشتريات",
      totalAmount: "إجمالي المبلغ",
      averagePrice: "متوسط السعر",
      language: "اللغة",
      sendWhatsApp: "إرسال واتساب",
      viewHistory: "عرض التاريخ",
      daysAgo: "يوم مضى",
      purchases: "مشتريات",
      sar: "ريال",
      noCustomerSelected: "لم يتم اختيار عميل"
    },
    en: {
      customerManagement: "Customer Management",
      searchCustomers: "Search customers...",
      customerList: "Customer List", 
      customerDetails: "Customer Details",
      name: "Name",
      phone: "Phone",
      lastPurchase: "Last Purchase",
      totalPurchases: "Total Purchases",
      totalAmount: "Total Amount",
      averagePrice: "Average Price", 
      language: "Language",
      sendWhatsApp: "Send WhatsApp",
      viewHistory: "View History",
      daysAgo: "days ago",
      purchases: "purchases",
      sar: "SAR",
      noCustomerSelected: "No customer selected"
    }
  };

  const t = translations[language];

  const languageLabels = {
    ar: 'العربية',
    en: 'English', 
    hi: 'हिन्दी',
    bn: 'বাংলা'
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const sendWhatsAppMessage = (customer: Customer) => {
    const messages = {
      ar: `مرحباً ${customer.name}، نشتاق لك في محل البطاريات. تعال زورنا قريباً!`,
      en: `Hello ${customer.name}, we miss you at the battery shop. Come visit us soon!`,
      hi: `नमस्ते ${customer.name}, हम आपको बैटरी की दुकान में याद करते हैं। जल्दी आइए!`,
      bn: `হ্যালো ${customer.name}, আমরা ব্যাটারি দোকানে আপনার জন্য অপেক্ষা করছি। শীঘ্রই আসুন!`
    };
    
    const message = messages[customer.preferredLanguage];
    const whatsappUrl = `https://wa.me/${customer.phone.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t.customerManagement}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Search className="w-5 h-5" />
                <span>{t.customerList}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder={t.searchCustomers}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedCustomer?.id === customer.id 
                        ? 'bg-primary/10 border-primary' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold">{customer.name}</div>
                    <div className="text-sm text-gray-600">{customer.phone}</div>
                    <div className="text-xs text-gray-500">
                      {getDaysAgo(customer.lastPurchase)} {t.daysAgo}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Details */}
        <div className="lg:col-span-2">
          {selectedCustomer ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t.customerDetails}</span>
                  <Badge variant="secondary">
                    {languageLabels[selectedCustomer.preferredLanguage]}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="font-semibold text-gray-700">{t.name}</label>
                      <p className="text-lg">{selectedCustomer.name}</p>
                    </div>
                    
                    <div>
                      <label className="font-semibold text-gray-700">{t.phone}</label>
                      <p className="text-lg">{selectedCustomer.phone}</p>
                    </div>
                    
                    <div>
                      <label className="font-semibold text-gray-700">{t.lastPurchase}</label>
                      <p className="text-lg">
                        {new Date(selectedCustomer.lastPurchase).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        <span className="text-sm text-gray-500 ml-2">
                          ({getDaysAgo(selectedCustomer.lastPurchase)} {t.daysAgo})
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-800">{t.totalPurchases}</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedCustomer.totalPurchases} {t.purchases}
                      </p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                        <span className="font-semibold text-green-800">{t.totalAmount}</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedCustomer.totalAmount.toLocaleString()} {t.sar}
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                        <span className="font-semibold text-purple-800">{t.averagePrice}</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">
                        {selectedCustomer.averagePrice} {t.sar}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4 rtl:space-x-reverse">
                  <Button 
                    onClick={() => sendWhatsAppMessage(selectedCustomer)}
                    className="flex items-center space-x-2 rtl:space-x-reverse"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t.sendWhatsApp}</span>
                  </Button>
                  
                  <Button variant="outline" className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Calendar className="w-4 h-4" />
                    <span>{t.viewHistory}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <p className="text-gray-500 text-lg">{t.noCustomerSelected}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;
