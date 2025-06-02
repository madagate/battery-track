
import { useState, useEffect, useCallback } from "react";
import { Plus, Minus, Save, Check, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { customersData, batteryTypes } from "@/data/customersData";

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
  saved: boolean;
}

interface DailyPurchasesProps {
  language: Language;
  selectedDate: Date;
}

const DailyPurchases = ({ language, selectedDate }: DailyPurchasesProps) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [activeCell, setActiveCell] = useState<{ row: number; col: string } | null>(null);
  const [history, setHistory] = useState<Purchase[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const isRTL = language === 'ar';
  const customerNames = customersData.map(customer => customer.name);

  const translations = {
    ar: {
      customerName: "اسم العميل",
      batteryType: "نوع البطارية", 
      quantity: "الكمية",
      price: "السعر",
      total: "الإجمالي",
      discount: "الخصم",
      finalTotal: "الإجمالي النهائي",
      actions: "عمليات",
      addRow: "إضافة سطر",
      removeRow: "حذف سطر",
      save: "حفظ",
      totalForDay: "إجمالي اليوم",
      searchCustomer: "بحث عن العميل...",
      previousDay: "اليوم السابق",
      nextDay: "اليوم التالي",
      newMonth: "شهر جديد",
      confirmNewMonth: "هل أنت متأكد من مسح بيانات الشهر؟",
      saved: "تم الحفظ",
      dataSaved: "تم حفظ البيانات بنجاح",
      monthCleared: "تم مسح بيانات الشهر"
    },
    en: {
      customerName: "Customer Name",
      batteryType: "Battery Type",
      quantity: "Quantity", 
      price: "Price",
      total: "Total",
      discount: "Discount",
      finalTotal: "Final Total",
      actions: "Actions",
      addRow: "Add Row",
      removeRow: "Remove Row", 
      save: "Save",
      totalForDay: "Total for Day",
      searchCustomer: "Search customer...",
      previousDay: "Previous Day",
      nextDay: "Next Day",
      newMonth: "New Month",
      confirmNewMonth: "Are you sure you want to clear month data?",
      saved: "Saved",
      dataSaved: "Data saved successfully",
      monthCleared: "Month data cleared"
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
      finalTotal: 0,
      saved: false
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
        const updated = { ...purchase, [field]: value, saved: false };
        
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

  const savePurchase = (id: string) => {
    setPurchases(purchases.map(purchase => 
      purchase.id === id ? { ...purchase, saved: true } : purchase
    ));
    
    toast({
      title: t.saved,
      description: t.dataSaved,
    });

    // Add new row after saving
    addNewPurchase();
  };

  const calculateDayTotal = () => {
    return purchases.reduce((sum, purchase) => sum + purchase.finalTotal, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, field: string) => {
    const purchaseId = purchases[rowIndex]?.id;
    
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      undo();
    } else if (e.ctrlKey && e.key === 'y') {
      e.preventDefault();
      redo();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      
      if (field === 'discount') {
        // Move to save button
        setActiveCell({ row: rowIndex, col: 'save' });
      } else if (field === 'save') {
        // Save and move to next row
        savePurchase(purchaseId);
        setTimeout(() => setActiveCell({ row: purchases.length, col: 'customerName' }), 100);
      } else {
        // Move to next column or next row
        const fields = ['customerName', 'batteryType', 'quantity', 'price', 'discount'];
        const currentIndex = fields.indexOf(field);
        if (currentIndex < fields.length - 1) {
          setActiveCell({ row: rowIndex, col: fields[currentIndex + 1] });
        } else {
          setActiveCell({ row: rowIndex, col: 'save' });
        }
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
    } else if (e.key === 'ArrowRight' && !isRTL) {
      e.preventDefault();
      const fields = ['customerName', 'batteryType', 'quantity', 'price', 'discount', 'save'];
      const currentIndex = fields.indexOf(field);
      if (currentIndex < fields.length - 1) {
        setActiveCell({ row: rowIndex, col: fields[currentIndex + 1] });
      }
    } else if (e.key === 'ArrowLeft' && !isRTL) {
      e.preventDefault();
      const fields = ['customerName', 'batteryType', 'quantity', 'price', 'discount', 'save'];
      const currentIndex = fields.indexOf(field);
      if (currentIndex > 0) {
        setActiveCell({ row: rowIndex, col: fields[currentIndex - 1] });
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

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    // This should trigger parent component to update selectedDate
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    // This should trigger parent component to update selectedDate
  };

  const handleNewMonth = () => {
    if (confirm(t.confirmNewMonth)) {
      setPurchases([]);
      setHistory([]);
      setHistoryIndex(-1);
      addNewPurchase();
      toast({
        title: t.monthCleared,
        description: t.monthCleared,
      });
    }
  };

  const savePurchases = () => {
    // Here you would save to your database
    toast({
      title: t.saved,
      description: t.dataSaved,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {t.totalForDay}: {calculateDayTotal().toLocaleString()} ريال
        </h2>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={handlePreviousDay} size="sm" variant="outline">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t.previousDay}</span>
          </Button>
          
          <Button onClick={handleNextDay} size="sm" variant="outline">
            <span className="hidden sm:inline">{t.nextDay}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          <Button onClick={addNewPurchase} size="sm" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Plus className="w-4 h-4" />
            <span>{t.addRow}</span>
          </Button>
          
          <Button onClick={savePurchases} size="sm" variant="secondary">
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">{t.save}</span>
          </Button>
          
          <Button onClick={handleNewMonth} size="sm" variant="destructive">
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">{t.newMonth}</span>
          </Button>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-3 text-right font-semibold">{t.customerName}</th>
              <th className="p-3 text-right font-semibold">{t.batteryType}</th>
              <th className="p-3 text-right font-semibold">{t.quantity}</th>
              <th className="p-3 text-right font-semibold">{t.price}</th>
              <th className="p-3 text-right font-semibold">{t.total}</th>
              <th className="p-3 text-right font-semibold">{t.discount}</th>
              <th className="p-3 text-right font-semibold">{t.finalTotal}</th>
              <th className="p-3 text-center font-semibold">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase, index) => (
              <tr key={purchase.id} className={`border-b hover:bg-gray-50 ${purchase.saved ? 'bg-green-50' : ''}`}>
                <td className="p-2">
                  <Select 
                    value={purchase.customerName} 
                    onValueChange={(value) => updatePurchase(purchase.id, 'customerName', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t.searchCustomer} />
                    </SelectTrigger>
                    <SelectContent>
                      {customerNames.map((customer) => (
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
                    autoFocus={activeCell?.row === index && activeCell?.col === 'quantity'}
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={purchase.price || ''}
                    onChange={(e) => updatePurchase(purchase.id, 'price', parseFloat(e.target.value) || 0)}
                    onKeyDown={(e) => handleKeyDown(e, index, 'price')}
                    className="w-full text-center"
                    autoFocus={activeCell?.row === index && activeCell?.col === 'price'}
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
                    autoFocus={activeCell?.row === index && activeCell?.col === 'discount'}
                  />
                </td>
                <td className="p-2">
                  <div className="bg-primary/10 p-2 rounded text-center font-bold text-primary">
                    {purchase.finalTotal.toLocaleString()}
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      onClick={() => savePurchase(purchase.id)}
                      size="sm"
                      variant={purchase.saved ? "default" : "outline"}
                      className="p-1"
                      disabled={purchase.saved}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => removePurchase(purchase.id)}
                      size="sm"
                      variant="destructive"
                      disabled={purchases.length === 1}
                      className="p-1"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
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
