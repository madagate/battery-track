
import { Customer } from "@/data/customersData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Language = 'ar' | 'en';

interface CustomerPurchaseHistoryProps {
  customer: Customer;
  language: Language;
}

const CustomerPurchaseHistory = ({ customer, language }: CustomerPurchaseHistoryProps) => {
  const translations = {
    ar: {
      date: "التاريخ",
      batteryType: "نوع البطارية",
      quantity: "الكمية",
      price: "السعر",
      total: "الإجمالي",
      discount: "الخصم",
      finalTotal: "الإجمالي النهائي",
      noPurchases: "لا توجد مشتريات مسجلة",
      kg: "كيلو",
      sar: "ريال",
      totalPurchases: "إجمالي المشتريات",
      totalAmount: "إجمالي المبلغ",
      totalQuantity: "إجمالي الكمية",
      averagePrice: "متوسط السعر"
    },
    en: {
      date: "Date",
      batteryType: "Battery Type",
      quantity: "Quantity",
      price: "Price",
      total: "Total",
      discount: "Discount",
      finalTotal: "Final Total",
      noPurchases: "No purchases recorded",
      kg: "kg",
      sar: "SAR",
      totalPurchases: "Total Purchases",
      totalAmount: "Total Amount",
      totalQuantity: "Total Quantity",
      averagePrice: "Average Price"
    }
  };

  const t = translations[language];

  if (customer.purchases.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{t.noPurchases}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">{t.date}</TableHead>
            <TableHead className="text-right">{t.batteryType}</TableHead>
            <TableHead className="text-right">{t.quantity}</TableHead>
            <TableHead className="text-right">{t.price}</TableHead>
            <TableHead className="text-right">{t.total}</TableHead>
            <TableHead className="text-right">{t.discount}</TableHead>
            <TableHead className="text-right">{t.finalTotal}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customer.purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell className="text-right">
                {new Date(purchase.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
              </TableCell>
              <TableCell className="text-right">{purchase.batteryType}</TableCell>
              <TableCell className="text-right">{purchase.quantity} {t.kg}</TableCell>
              <TableCell className="text-right">{purchase.price} {t.sar}</TableCell>
              <TableCell className="text-right">{purchase.total.toLocaleString()} {t.sar}</TableCell>
              <TableCell className="text-right">{purchase.discount} {t.sar}</TableCell>
              <TableCell className="text-right font-bold text-primary">
                {purchase.finalTotal.toLocaleString()} {t.sar}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">{t.totalPurchases}</p>
            <p className="text-lg font-bold text-blue-600">{customer.purchases.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t.totalAmount}</p>
            <p className="text-lg font-bold text-green-600">
              {customer.purchases.reduce((sum, p) => sum + p.finalTotal, 0).toLocaleString()} {t.sar}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t.totalQuantity}</p>
            <p className="text-lg font-bold text-purple-600">
              {customer.purchases.reduce((sum, p) => sum + p.quantity, 0)} {t.kg}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t.averagePrice}</p>
            <p className="text-lg font-bold text-orange-600">
              {customer.purchases.length > 0 
                ? Math.round(customer.purchases.reduce((sum, p) => sum + p.price, 0) / customer.purchases.length) 
                : 0} {t.sar}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPurchaseHistory;
