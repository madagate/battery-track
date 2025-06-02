
import { useState } from "react";
import { Search, Phone, MessageCircle, Calendar, TrendingUp, UserPlus, Filter, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { customersData, Customer } from "@/data/customersData";
import CustomerPurchaseHistory from "./CustomerPurchaseHistory";
import AddCustomerForm from "./AddCustomerForm";

type Language = 'ar' | 'en';

interface CustomerManagementProps {
  language: Language;
}

const CustomerManagement = ({ language }: CustomerManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>(customersData);
  const [dayFilter, setDayFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPurchaseHistory, setShowPurchaseHistory] = useState(false);
  
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
      addCustomer: "إضافة عميل",
      filterByDays: "فلتر بالأيام",
      allCustomers: "جميع العملاء",
      last7Days: "آخر 7 أيام",
      last15Days: "آخر 15 يوماً",
      last30Days: "آخر 30 يوماً",
      moreThan30Days: "أكثر من 30 يوماً",
      daysAgo: "يوم مضى",
      purchases: "مشتريات",
      sar: "ريال",
      noCustomerSelected: "لم يتم اختيار عميل",
      purchaseHistory: "سجل المشتريات"
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
      addCustomer: "Add Customer",
      filterByDays: "Filter by Days",
      allCustomers: "All Customers",
      last7Days: "Last 7 Days",
      last15Days: "Last 15 Days", 
      last30Days: "Last 30 Days",
      moreThan30Days: "More than 30 Days",
      daysAgo: "days ago",
      purchases: "purchases",
      sar: "SAR",
      noCustomerSelected: "No customer selected",
      purchaseHistory: "Purchase History"
    }
  };

  const t = translations[language];

  const languageLabels = {
    ar: 'العربية',
    en: 'English', 
    hi: 'हिन्दी',
    bn: 'বাংলা'
  };

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filterCustomersByDays = (customers: Customer[]) => {
    if (dayFilter === 'all') return customers;
    
    return customers.filter(customer => {
      const daysAgo = getDaysAgo(customer.lastPurchase);
      switch (dayFilter) {
        case '7': return daysAgo <= 7;
        case '15': return daysAgo <= 15;
        case '30': return daysAgo <= 30;
        case '30+': return daysAgo > 30;
        default: return true;
      }
    });
  };

  const filteredCustomers = filterCustomersByDays(
    customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    )
  );

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

  const addNewCustomer = (customerData: Omit<Customer, 'id' | 'totalPurchases' | 'totalAmount' | 'averagePrice' | 'purchases'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      totalPurchases: 0,
      totalAmount: 0,
      averagePrice: 0,
      purchases: []
    };
    setCustomers([...customers, newCustomer]);
    setShowAddForm(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">{t.customerManagement}</h2>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2 rtl:space-x-reverse">
              <UserPlus className="w-4 h-4" />
              <span>{t.addCustomer}</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.addCustomer}</DialogTitle>
            </DialogHeader>
            <AddCustomerForm onAdd={addNewCustomer} language={language} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List with Filters */}
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
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Filter className="w-4 h-4" />
                <Select value={dayFilter} onValueChange={setDayFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t.filterByDays} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allCustomers}</SelectItem>
                    <SelectItem value="7">{t.last7Days}</SelectItem>
                    <SelectItem value="15">{t.last15Days}</SelectItem>
                    <SelectItem value="30">{t.last30Days}</SelectItem>
                    <SelectItem value="30+">{t.moreThan30Days}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCustomers.map((customer) => {
                  const daysAgo = getDaysAgo(customer.lastPurchase);
                  return (
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
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          {daysAgo} {t.daysAgo}
                        </div>
                        <Badge variant={daysAgo > 30 ? "destructive" : daysAgo > 15 ? "secondary" : "default"}>
                          {languageLabels[customer.preferredLanguage]}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={() => sendWhatsAppMessage(selectedCustomer)}
                    className="flex items-center space-x-2 rtl:space-x-reverse"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t.sendWhatsApp}</span>
                  </Button>
                  
                  <Dialog open={showPurchaseHistory} onOpenChange={setShowPurchaseHistory}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Eye className="w-4 h-4" />
                        <span>{t.purchaseHistory}</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{t.purchaseHistory} - {selectedCustomer.name}</DialogTitle>
                      </DialogHeader>
                      <CustomerPurchaseHistory customer={selectedCustomer} language={language} />
                    </DialogContent>
                  </Dialog>
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
