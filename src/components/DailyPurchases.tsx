
import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Minus, Save, Check, RotateCcw, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { customersData, batteryTypes, Customer } from "@/data/customersData";
import { notes } from "@/data/notesData";
import AddCustomerForm from "./AddCustomerForm";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [customers, setCustomers] = useState<Customer[]>(customersData);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

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
      actions: "عمليات",
      addRow: "إضافة سطر",
      removeRow: "حذف سطر",
      save: "حفظ",
      totalForDay: "إجمالي اليوم",
      searchCustomer: "بحث عن العميل...",
      addNewCustomer: "إضافة عميل جديد",
      newMonth: "شهر جديد",
      confirmNewMonth: "هل أنت متأكد من مسح بيانات الشهر؟",
      saved: "تم الحفظ",
      dataSaved: "تم حفظ البيانات بنجاح",
      monthCleared: "تم مسح بيانات الشهر",
      noResults: "لا توجد نتائج",
      quickNotes: "الملاحظات السريعة",
      addNote: "إضافة ملاحظة",
      notePlaceholder: "اكتب ملاحظة جديدة..."
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
      addNewCustomer: "Add New Customer",
      newMonth: "New Month",
      confirmNewMonth: "Are you sure you want to clear month data?",
      saved: "Saved",
      dataSaved: "Data saved successfully",
      monthCleared: "Month data cleared",
      noResults: "No results found",
      quickNotes: "Quick Notes",
      addNote: "Add Note",
      notePlaceholder: "Write a new note..."
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
      batteryType: 'بطاريات عادية',
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

    addNewPurchase();
  };

  const calculateDayTotal = () => {
    return purchases.reduce((sum, purchase) => sum + purchase.finalTotal, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, field: string) => {
    const purchaseId = purchases[rowIndex]?.id;
    
    if (e.key === 'Enter') {
      e.preventDefault();
      
      const fields = ['customerName', 'batteryType', 'quantity', 'price', 'discount'];
      const currentIndex = fields.indexOf(field);
      
      if (currentIndex < fields.length - 1) {
        // Move to next field in same row
        const nextField = fields[currentIndex + 1];
        setActiveCell({ row: rowIndex, col: nextField });
        setTimeout(() => {
          const nextInput = inputRefs.current[`${rowIndex}-${nextField}`];
          if (nextInput) {
            nextInput.focus();
          }
        }, 100);
      } else {
        // Save and move to first field of next row
        savePurchase(purchaseId);
        setTimeout(() => {
          setActiveCell({ row: purchases.length, col: 'customerName' });
          const nextInput = inputRefs.current[`${purchases.length}-customerName`];
          if (nextInput) {
            nextInput.focus();
          }
        }, 100);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (rowIndex < purchases.length - 1) {
        setActiveCell({ row: rowIndex + 1, col: field });
        setTimeout(() => {
          const nextInput = inputRefs.current[`${rowIndex + 1}-${field}`];
          if (nextInput) {
            nextInput.focus();
          }
        }, 100);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (rowIndex > 0) {
        setActiveCell({ row: rowIndex - 1, col: field });
        setTimeout(() => {
          const nextInput = inputRefs.current[`${rowIndex - 1}-${field}`];
          if (nextInput) {
            nextInput.focus();
          }
        }, 100);
      }
    }
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

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

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
    setShowAddCustomer(false);
    toast({
      title: t.saved,
      description: "تم إضافة العميل بنجاح",
    });
  };

  const activeNotes = notes.filter(note => !note.completed);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6 space-y-6">
        {/* Quick Notes Section */}
        {activeNotes.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center">
              <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
              {t.quickNotes}
            </h3>
            <div className="space-y-2">
              {activeNotes.slice(0, 3).map((note) => (
                <div key={note.id} className="flex items-center space-x-2 rtl:space-x-reverse text-amber-700">
                  <Checkbox
                    checked={note.completed}
                    onCheckedChange={(checked) => {
                      // This would update the note in the notes data
                      console.log(`Toggle note ${note.id}:`, checked);
                    }}
                    className="text-amber-600"
                  />
                  <span className="text-sm">{note.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {t.totalForDay}: <span className="text-primary">{calculateDayTotal().toLocaleString()} ريال</span>
          </h2>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={addNewPurchase} size="sm" className="flex items-center space-x-2 rtl:space-x-reverse">
              <Plus className="w-4 h-4" />
              <span>{t.addRow}</span>
            </Button>
            
            <Button onClick={handleNewMonth} size="sm" variant="destructive">
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">{t.newMonth}</span>
            </Button>
          </div>
        </div>

        {/* Enhanced Purchases Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-gradient-to-r from-primary/5 to-primary/10 border-b-2 border-primary/20">
                  <th className="p-4 text-right font-bold text-gray-700 w-1/5">{t.customerName}</th>
                  <th className="p-4 text-right font-bold text-gray-700 w-1/6">{t.batteryType}</th>
                  <th className="p-4 text-center font-bold text-gray-700 w-20">{t.quantity}</th>
                  <th className="p-4 text-center font-bold text-gray-700 w-24">{t.price}</th>
                  <th className="p-4 text-center font-bold text-gray-700 w-24">{t.total}</th>
                  <th className="p-4 text-center font-bold text-gray-700 w-20">{t.discount}</th>
                  <th className="p-4 text-center font-bold text-gray-700 w-28">{t.finalTotal}</th>
                  <th className="p-4 text-center font-bold text-gray-700 w-20">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase, index) => (
                  <tr key={purchase.id} className={`border-b transition-colors ${purchase.saved ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                    <td className="p-3">
                      <div className="relative">
                        <Input
                          ref={(el) => inputRefs.current[`${index}-customerName`] = el}
                          placeholder={t.searchCustomer}
                          value={purchase.customerName}
                          onChange={(e) => {
                            updatePurchase(purchase.id, 'customerName', e.target.value);
                            setSearchTerm(e.target.value);
                          }}
                          onKeyDown={(e) => handleKeyDown(e, index, 'customerName')}
                          className="w-full"
                          autoFocus={activeCell?.row === index && activeCell?.col === 'customerName'}
                        />
                        {searchTerm && !purchase.saved && (
                          <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-b-md shadow-lg max-h-40 overflow-y-auto">
                            {filteredCustomers.length > 0 ? (
                              filteredCustomers.map((customer) => (
                                <div
                                  key={customer.id}
                                  onClick={() => {
                                    updatePurchase(purchase.id, 'customerName', customer.name);
                                    setSearchTerm('');
                                  }}
                                  className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                >
                                  <div className="font-medium">{customer.name}</div>
                                  <div className="text-sm text-gray-500">{customer.phone}</div>
                                </div>
                              ))
                            ) : (
                              <div className="p-3 text-center">
                                <p className="text-gray-500 mb-2">{t.noResults}</p>
                                <Button
                                  onClick={() => setShowAddCustomer(true)}
                                  size="sm"
                                  className="flex items-center space-x-1 rtl:space-x-reverse mx-auto"
                                >
                                  <UserPlus className="w-3 h-3" />
                                  <span>{t.addNewCustomer}</span>
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <Select 
                        value={purchase.batteryType} 
                        onValueChange={(value) => updatePurchase(purchase.id, 'batteryType', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
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
                    <td className="p-3">
                      <Input
                        ref={(el) => inputRefs.current[`${index}-quantity`] = el}
                        type="number"
                        value={purchase.quantity || ''}
                        onChange={(e) => updatePurchase(purchase.id, 'quantity', parseFloat(e.target.value) || 0)}
                        onKeyDown={(e) => handleKeyDown(e, index, 'quantity')}
                        className="w-full text-center"
                        autoFocus={activeCell?.row === index && activeCell?.col === 'quantity'}
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        ref={(el) => inputRefs.current[`${index}-price`] = el}
                        type="number"
                        value={purchase.price || ''}
                        onChange={(e) => updatePurchase(purchase.id, 'price', parseFloat(e.target.value) || 0)}
                        onKeyDown={(e) => handleKeyDown(e, index, 'price')}
                        className="w-full text-center"
                        autoFocus={activeCell?.row === index && activeCell?.col === 'price'}
                      />
                    </td>
                    <td className="p-3">
                      <div className="bg-gray-50 p-2 rounded-lg text-center font-semibold text-gray-700 border">
                        {purchase.total.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-3">
                      <Input
                        ref={(el) => inputRefs.current[`${index}-discount`] = el}
                        type="number"
                        value={purchase.discount || ''}
                        onChange={(e) => updatePurchase(purchase.id, 'discount', parseFloat(e.target.value) || 0)}
                        onKeyDown={(e) => handleKeyDown(e, index, 'discount')}
                        className="w-full text-center"
                        autoFocus={activeCell?.row === index && activeCell?.col === 'discount'}
                      />
                    </td>
                    <td className="p-3">
                      <div className="bg-gradient-to-r from-primary/10 to-primary/20 p-2 rounded-lg text-center font-bold text-primary border border-primary/30">
                        {purchase.finalTotal.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-3">
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
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 border-t-2 border-primary/20">
            <div className="text-xl font-bold text-center">
              {t.totalForDay}: <span className="text-primary">{calculateDayTotal().toLocaleString()} ريال</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Customer Dialog */}
      <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.addNewCustomer}</DialogTitle>
          </DialogHeader>
          <AddCustomerForm onAdd={addNewCustomer} language={language} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DailyPurchases;
