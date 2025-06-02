
import { useState } from "react";
import { Search, Phone, MessageCircle, Calendar, TrendingUp, UserPlus, Filter, Eye, Users } from "lucide-react";
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
      noCustomerSelected: "اختر عميلاً لعرض التفاصيل",
      purchaseHistory: "سجل المشتريات",
      totalCustomers: "إجمالي العملاء"
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
      noCustomerSelected: "Select a customer to view details",
      purchaseHistory: "Purchase History",
      totalCustomers: "Total Customers"
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
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{t.customerManagement}</h2>
            <p className="text-gray-600">{t.totalCustomers}: {customers.length}</p>
          </div>
        </div>
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="xl:col-span-1">
          <Card className="h-[calc(100vh-200px)]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse text-lg">
                <Search className="w-5 h-5" />
                <span>{t.customerList}</span>
              </CardTitle>
              <div className="space-y-3">
                <Input
                  placeholder={t.searchCustomers}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <Select value={dayFilter} onValueChange={setDayFilter}>
                  <SelectTrigger>
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
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-[calc(100vh-380px)] overflow-y-auto px-6 pb-6">
                {filteredCustomers.map((customer) => {
                  const daysAgo = getDaysAgo(customer.lastPurchase);
                  return (
                    <div
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedCustomer?.id === customer.id 
                          ? 'bg-primary/10 border-primary shadow-md' 
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold text-gray-800">{customer.name}</div>
                        <Badge 
                          variant={daysAgo > 30 ? "destructive" : daysAgo > 15 ? "secondary" : "default"}
                          className="text-xs"
                        >
                          {languageLabels[customer.preferredLanguage]}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">{customer.phone}</div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">
                          {daysAgo} {t.daysAgo}
                        </span>
                        <span className="font-medium text-primary">
                          {customer.totalAmount.toLocaleString()} {t.sar}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Details */}
        <div className="xl:col-span-2">
          {selectedCustomer ? (
            <Card className="h-[calc(100vh-200px)]">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{selectedCustomer.name}</CardTitle>
                  <Badge variant="secondary" className="text-sm">
                    {languageLabels[selectedCustomer.preferredLanguage]}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button 
                    onClick={() => sendWhatsAppMessage(selectedCustomer)}
                    className="flex items-center space-x-2 rtl:space-x-reverse"
                    size="sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t.sendWhatsApp}</span>
                  </Button>
                  
                  <Dialog open={showPurchaseHistory} onOpenChange={setShowPurchaseHistory}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Eye className="w-4 h-4" />
                        <span>{t.purchaseHistory}</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl max-h-[80vh] overflow-auto">
                      <DialogHeader>
                        <DialogTitle>{t.purchaseHistory} - {selectedCustomer.name}</DialogTitle>
                      </DialogHeader>
                      <CustomerPurchaseHistory customer={selectedCustomer} language={language} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-6 overflow-y-auto max-h-[calc(100vh-320px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">معلومات التواصل</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <span className="text-lg">{selectedCustomer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <div>
                          <span className="text-lg">
                            {new Date(selectedCustomer.lastPurchase).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                          </span>
                          <span className="text-sm text-gray-500 ml-2 rtl:mr-2">
                            ({getDaysAgo(selectedCustomer.lastPurchase)} {t.daysAgo})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-700">{t.totalPurchases}</p>
                          <p className="text-2xl font-bold text-blue-800">
                            {selectedCustomer.totalPurchases}
                          </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-700">{t.totalAmount}</p>
                          <p className="text-2xl font-bold text-green-800">
                            {selectedCustomer.totalAmount.toLocaleString()} {t.sar}
                          </p>
                        </div>
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">₿</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-700">{t.averagePrice}</p>
                          <p className="text-2xl font-bold text-purple-800">
                            {selectedCustomer.averagePrice} {t.sar}
                          </p>
                        </div>
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[calc(100vh-200px)]">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t.noCustomerSelected}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;
