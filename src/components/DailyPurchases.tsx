
import { useState, useEffect, useCallback } from "react";
import { Plus, Minus, Save, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

type Language = 'ar' | 'en';

interface Purchase {
  id: string;
  customerName: string;
  batteryType: string;
  quantity: number;
  price: number;
  total: number;
  discount: number;
  finalTotal: number;
}

interface DailyPurchasesProps {
  language: Language;
  selectedDate: Date;
}

const DailyPurchases = ({ language, selectedDate }: DailyPurchasesProps) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [customers] = useState<string[]>(['أحمد محمد', 'فهد العتيبي', 'سالم الرشيد', 'خالد النصر']);
  const [batteryTypes] = useState<string[]>(['بطارية سيارة', 'بطارية شاحنة', 'بطارية دراجة نارية', 'بطارية UPS']);
  const [activeCell, setActiveCell] = useState<{ row: number; col: string } | null>(null);
  const [history, setHistory] = useState<Purchase[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const isRTL = language === 'ar';

  const translations = {
    ar: {
      customerName: "اسم العميل",
      batteryType: "نوع البطارية", 
      quantity: "الكمية",
      price: "السعر",
      total: "الإجمالي",
      discount: "الخصم",
      finalTotal: "الإجمالي النهائي",
      addRow: "إضافة سطر",
      removeRow: "حذف سطر",
      save: "حفظ",
      totalForDay: "إجمالي اليوم",
      searchCustomer: "بحث عن العميل..."
    },
    en: {
      customerName: "Customer Name",
      batteryType: "Battery Type",
      quantity: "Quantity", 
      price: "Price",
      total: "Total",
      discount: "Discount",
      finalTotal: "Final Total",
      addRow: "Add Row",
      removeRow: "Remove Row", 
      save: "Save",
      totalForDay: "Total for Day",
      searchCustomer: "Search customer..."
    }
  };

  const t = translations[language];

  // Initialize with one empty row
  useEffect(() => {
    if (purchases.length === 0) {
      addNewPurchase();
    }
  }, []);

  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...purchases]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [purchases, history, historyIndex]);

  const addNewPurchase = () => {
    const newPurchase: Purchase = {
      id: Date.now().toString(),
      customerName: '',
      batteryType: '',
      quantity: 0,
      price: 0,
      total: 0,
      discount: 0,
      finalTotal: 0
    };
    
    saveToHistory();
    setPurchases([...purchases, newPurchase]);
  };

  const removePurchase = (id: string) => {
    if (purchases.length > 1) {
      saveToHistory();
      setPurchases(purchases.filter(p => p.id !== id));
    }
  };

  const updatePurchase = (id: string, field: keyof Purchase, value: any) => {
    setPurchases(purchases.map(purchase => {
      if (purchase.id === id) {
        const updated = { ...purchase, [field]: value };
        
        // Recalculate totals
        if (field === 'quantity' || field === 'price') {
          updated.total = Math.round(updated.quantity * updated.price);
          updated.finalTotal = updated.total - updated.discount;
        } else if (field === 'discount') {
          updated.finalTotal = updated.total - updated.discount;
        }
        
        return updated;
      }
      return purchase;
    }));
  };

  const calculateDayTotal = () => {
    return purchases.reduce((sum, purchase) => sum + purchase.finalTotal, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, field: string) => {
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      undo();
    } else if (e.ctrlKey && e.key === 'y') {
      e.preventDefault();
      redo();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      // Move to next row, same column
      if (rowIndex < purchases.length - 1) {
        setActiveCell({ row: rowIndex + 1, col: field });
      } else {
        addNewPurchase();
        setTimeout(() => setActiveCell({ row: purchases.length, col: field }), 100);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (rowIndex < purchases.length - 1) {
        setActiveCell({ row: rowIndex + 1, col: field });
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (rowIndex > 0) {
        setActiveCell({ row: rowIndex - 1, col: field });
      }
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPurchases([...history[historyIndex - 1]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPurchases([...history[historyIndex + 1]]);
    }
  };

  const savePurchases = () => {
    // Here you would save to your database
    toast({
      title: language === 'ar' ? "تم الحفظ" : "Saved",
      description: language === 'ar' ? "تم حفظ البيانات بنجاح" : "Data saved successfully",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t.totalForDay}: {calculateDayTotal().toLocaleString()} ريال</h2>
        <div className="flex space-x-2 rtl:space-x-reverse">
          <Button onClick={addNewPurchase} size="sm" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Plus className="w-4 h-4" />
            <span>{t.addRow}</span>
          </Button>
          <Button onClick={savePurchases} size="sm" variant="secondary" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Save className="w-4 h-4" />
            <span>{t.save}</span>
          </Button>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-3 text-right font-semibold">{t.customerName}</th>
              <th className="p-3 text-right font-semibold">{t.batteryType}</th>
              <th className="p-3 text-right font-semibold">{t.quantity}</th>
              <th className="p-3 text-right font-semibold">{t.price}</th>
              <th className="p-3 text-right font-semibold">{t.total}</th>
              <th className="p-3 text-right font-semibold">{t.discount}</th>
              <th className="p-3 text-right font-semibold">{t.finalTotal}</th>
              <th className="p-3 text-center font-semibold">عمليات</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase, index) => (
              <tr key={purchase.id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <Select 
                    value={purchase.customerName} 
                    onValueChange={(value) => updatePurchase(purchase.id, 'customerName', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t.searchCustomer} />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer} value={customer}>
                          {customer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Select 
                    value={purchase.batteryType} 
                    onValueChange={(value) => updatePurchase(purchase.id, 'batteryType', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      {batteryTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={purchase.quantity || ''}
                    onChange={(e) => updatePurchase(purchase.id, 'quantity', parseFloat(e.target.value) || 0)}
                    onKeyDown={(e) => handleKeyDown(e, index, 'quantity')}
                    className="w-full text-center"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={purchase.price || ''}
                    onChange={(e) => updatePurchase(purchase.id, 'price', parseFloat(e.target.value) || 0)}
                    onKeyDown={(e) => handleKeyDown(e, index, 'price')}
                    className="w-full text-center"
                  />
                </td>
                <td className="p-2">
                  <div className="bg-gray-100 p-2 rounded text-center font-semibold">
                    {purchase.total.toLocaleString()}
                  </div>
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={purchase.discount || ''}
                    onChange={(e) => updatePurchase(purchase.id, 'discount', parseFloat(e.target.value) || 0)}
                    onKeyDown={(e) => handleKeyDown(e, index, 'discount')}
                    className="w-full text-center"
                  />
                </td>
                <td className="p-2">
                  <div className="bg-primary/10 p-2 rounded text-center font-bold text-primary">
                    {purchase.finalTotal.toLocaleString()}
                  </div>
                </td>
                <td className="p-2 text-center">
                  <Button
                    onClick={() => removePurchase(purchase.id)}
                    size="sm"
                    variant="destructive"
                    disabled={purchases.length === 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Day Total */}
      <div className="bg-primary/5 p-4 rounded-lg border-2 border-primary/20">
        <div className="text-xl font-bold text-center">
          {t.totalForDay}: <span className="text-primary">{calculateDayTotal().toLocaleString()} ريال</span>
        </div>
      </div>
    </div>
  );
};

export default DailyPurchases;
