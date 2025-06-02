
import { useState } from "react";
import { Search, Phone, MessageCircle, Calendar, TrendingUp, UserPlus, Filter, Eye, Users, Star, MapPin } from "lucide-react";
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
      totalCustomers: "إجمالي العملاء",
      contactInfo: "معلومات التواصل",
      statistics: "الإحصائيات",
      topCustomer: "عميل مميز",
      recentCustomers: "العملاء الحديثون"
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
      totalCustomers: "Total Customers",
      contactInfo: "Contact Information",
      statistics: "Statistics",
      topCustomer: "Top Customer",
      recentCustomers: "Recent Customers"
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

  const getCustomerPriorityColor = (daysAgo: number) => {
    if (daysAgo <= 7) return 'bg-green-100 border-green-300 text-green-800';
    if (daysAgo <= 15) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    if (daysAgo <= 30) return 'bg-orange-100 border-orange-300 text-orange-800';
    return 'bg-red-100 border-red-300 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{t.customerManagement}</h1>
                <p className="text-gray-600 mt-1">{t.totalCustomers}: <span className="font-semibold text-primary">{customers.length}</span></p>
              </div>
            </div>
            
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogTrigger asChild>
                <Button size="lg" className="flex items-center space-x-2 rtl:space-x-reverse shadow-lg">
                  <UserPlus className="w-5 h-5" />
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
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Customer List */}
          <div className="xl:col-span-5">
            <Card className="h-[calc(100vh-280px)] shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                <CardTitle className="flex items-center space-x-3 rtl:space-x-reverse text-xl">
                  <Search className="w-6 h-6 text-primary" />
                  <span>{t.customerList}</span>
                </CardTitle>
                <div className="space-y-4 mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder={t.searchCustomers}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 rtl:pr-10 rtl:pl-3"
                    />
                  </div>
                  
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
                <div className="space-y-2 max-h-[calc(100vh-480px)] overflow-y-auto p-4">
                  {filteredCustomers.map((customer) => {
                    const daysAgo = getDaysAgo(customer.lastPurchase);
                    const priorityColor = getCustomerPriorityColor(daysAgo);
                    
                    return (
                      <div
                        key={customer.id}
                        onClick={() => setSelectedCustomer(customer)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                          selectedCustomer?.id === customer.id 
                            ? 'bg-primary/10 border-primary shadow-lg scale-105' 
                            : `hover:bg-gray-50 ${priorityColor}`
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="font-bold text-lg text-gray-800">{customer.name}</div>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            {customer.totalAmount > 5000 && (
                              <Star className="w-4 h-4 text-yellow-500" />
                            )}
                            <Badge variant="outline" className="text-xs">
                              {languageLabels[customer.preferredLanguage]}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600 mb-2">
                          <Phone className="w-4 h-4" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{daysAgo} {t.daysAgo}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary text-lg">
                              {customer.totalAmount.toLocaleString()} {t.sar}
                            </div>
                            <div className="text-xs text-gray-500">
                              {customer.totalPurchases} {t.purchases}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Details */}
          <div className="xl:col-span-7">
            {selectedCustomer ? (
              <Card className="h-[calc(100vh-280px)] shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{selectedCustomer.name}</CardTitle>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                          <Badge variant="secondary" className="text-sm">
                            {languageLabels[selectedCustomer.preferredLanguage]}
                          </Badge>
                          {selectedCustomer.totalAmount > 5000 && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                              <Star className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
                              {t.topCustomer}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-4">
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
                <CardContent className="p-6 overflow-y-auto max-h-[calc(100vh-420px)]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                      <h3 className="font-bold text-xl text-gray-800 border-b-2 border-primary/20 pb-2">
                        {t.contactInfo}
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse p-4 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Phone className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">رقم الهاتف</div>
                            <div className="text-lg font-semibold">{selectedCustomer.phone}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 rtl:space-x-reverse p-4 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Calendar className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">آخر زيارة</div>
                            <div className="text-lg font-semibold">
                              {new Date(selectedCustomer.lastPurchase).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                            </div>
                            <div className="text-sm text-gray-500">
                              ({getDaysAgo(selectedCustomer.lastPurchase)} {t.daysAgo})
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Statistics Cards */}
                    <div className="space-y-6">
                      <h3 className="font-bold text-xl text-gray-800 border-b-2 border-primary/20 pb-2">
                        {t.statistics}
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-blue-700">{t.totalPurchases}</p>
                              <p className="text-3xl font-bold text-blue-800">
                                {selectedCustomer.totalPurchases}
                              </p>
                            </div>
                            <TrendingUp className="w-10 h-10 text-blue-600" />
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-green-700">{t.totalAmount}</p>
                              <p className="text-3xl font-bold text-green-800">
                                {selectedCustomer.totalAmount.toLocaleString()}
                              </p>
                              <p className="text-sm text-green-600">{t.sar}</p>
                            </div>
                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-lg">₿</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-purple-700">{t.averagePrice}</p>
                              <p className="text-3xl font-bold text-purple-800">
                                {selectedCustomer.averagePrice}
                              </p>
                              <p className="text-sm text-purple-600">{t.sar}</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-lg">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-[calc(100vh-280px)] shadow-lg">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="p-6 bg-gray-100 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                      <Users className="w-16 h-16 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-600 mb-2">{t.noCustomerSelected}</h3>
                    <p className="text-gray-500">اختر عميلاً من القائمة لعرض تفاصيله</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;
