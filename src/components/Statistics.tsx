
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Battery, DollarSign } from "lucide-react";

type Language = 'ar' | 'en';

interface StatisticsProps {
  language: Language;
}

const Statistics = ({ language }: StatisticsProps) => {
  const translations = {
    ar: {
      statistics: "الإحصائيات",
      monthlyRevenue: "الإيرادات الشهرية",
      topCustomers: "أفضل العملاء",
      batteryTypes: "أنواع البطاريات",
      dailyTrends: "الاتجاهات اليومية",
      totalRevenue: "إجمالي الإيرادات",
      totalCustomers: "إجمالي العملاء",
      batteriesPurchased: "البطاريات المشتراة",
      averagePrice: "متوسط السعر",
      thisMonth: "هذا الشهر",
      sar: "ريال"
    },
    en: {
      statistics: "Statistics",
      monthlyRevenue: "Monthly Revenue",
      topCustomers: "Top Customers", 
      batteryTypes: "Battery Types",
      dailyTrends: "Daily Trends",
      totalRevenue: "Total Revenue",
      totalCustomers: "Total Customers",
      batteriesPurchased: "Batteries Purchased",
      averagePrice: "Average Price",
      thisMonth: "This Month",
      sar: "SAR"
    }
  };

  const t = translations[language];

  // Sample data
  const monthlyData = [
    { month: language === 'ar' ? 'يناير' : 'Jan', revenue: 15000, purchases: 45 },
    { month: language === 'ar' ? 'فبراير' : 'Feb', revenue: 18000, purchases: 52 },
    { month: language === 'ar' ? 'مارس' : 'Mar', revenue: 22000, purchases: 61 },
    { month: language === 'ar' ? 'أبريل' : 'Apr', revenue: 19000, purchases: 48 },
    { month: language === 'ar' ? 'مايو' : 'May', revenue: 25000, purchases: 67 },
    { month: language === 'ar' ? 'يونيو' : 'Jun', revenue: 28000, purchases: 72 },
  ];

  const customerData = [
    { name: 'أحمد محمد', amount: 4500 },
    { name: 'فهد العتيبي', amount: 3200 },
    { name: 'سالم الرشيد', amount: 2800 },
    { name: 'خالد النصر', amount: 2400 },
    { name: 'محمد السلمي', amount: 2100 },
  ];

  const batteryTypeData = [
    { name: language === 'ar' ? 'بطارية سيارة' : 'Car Battery', value: 45, color: '#2563eb' },
    { name: language === 'ar' ? 'بطارية شاحنة' : 'Truck Battery', value: 25, color: '#7c3aed' },
    { name: language === 'ar' ? 'بطارية دراجة نارية' : 'Motorcycle Battery', value: 20, color: '#059669' },
    { name: language === 'ar' ? 'بطارية UPS' : 'UPS Battery', value: 10, color: '#dc2626' },
  ];

  const dailyTrendsData = [
    { day: language === 'ar' ? 'السبت' : 'Sat', amount: 2400 },
    { day: language === 'ar' ? 'الأحد' : 'Sun', amount: 1800 },
    { day: language === 'ar' ? 'الاثنين' : 'Mon', amount: 3200 },
    { day: language === 'ar' ? 'الثلاثاء' : 'Tue', amount: 2800 },
    { day: language === 'ar' ? 'الأربعاء' : 'Wed', amount: 3600 },
    { day: language === 'ar' ? 'الخميس' : 'Thu', amount: 4200 },
    { day: language === 'ar' ? 'الجمعة' : 'Fri', amount: 3800 },
  ];

  const kpiData = [
    {
      title: t.totalRevenue,
      value: "142,500",
      suffix: t.sar,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: t.totalCustomers,
      value: "156",
      suffix: "",
      icon: Users,
      color: "text-blue-600", 
      bgColor: "bg-blue-50"
    },
    {
      title: t.batteriesPurchased,
      value: "347",
      suffix: "",
      icon: Battery,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: t.averagePrice,
      value: "285",
      suffix: t.sar,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{t.statistics}</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {kpi.value.toLocaleString()} {kpi.suffix}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                    <Icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t.monthlyRevenue}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Battery Types Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t.batteryTypes}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={batteryTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {batteryTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle>{t.topCustomers}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={customerData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="amount" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Trends */}
        <Card>
          <CardHeader>
            <CardTitle>{t.dailyTrends}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#059669" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
