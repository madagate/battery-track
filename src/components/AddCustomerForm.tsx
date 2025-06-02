
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Customer } from "@/data/customersData";

type Language = 'ar' | 'en';

interface AddCustomerFormProps {
  onAdd: (customer: Omit<Customer, 'id' | 'totalPurchases' | 'totalAmount' | 'averagePrice' | 'purchases'>) => void;
  language: Language;
}

const AddCustomerForm = ({ onAdd, language }: AddCustomerFormProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<'ar' | 'en' | 'hi' | 'bn'>('ar');

  const translations = {
    ar: {
      name: "الاسم",
      phone: "رقم الهاتف",
      language: "اللغة المفضلة",
      add: "إضافة",
      cancel: "إلغاء",
      nameRequired: "الاسم مطلوب",
      phoneRequired: "رقم الهاتف مطلوب"
    },
    en: {
      name: "Name",
      phone: "Phone Number",
      language: "Preferred Language",
      add: "Add",
      cancel: "Cancel",
      nameRequired: "Name is required",
      phoneRequired: "Phone is required"
    }
  };

  const t = translations[language];

  const languageOptions = {
    ar: 'العربية',
    en: 'English',
    hi: 'हिन्दी',
    bn: 'বাংলা'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      return;
    }

    onAdd({
      name: name.trim(),
      phone: phone.trim(),
      lastPurchase: new Date().toISOString().split('T')[0],
      preferredLanguage
    });

    setName('');
    setPhone('');
    setPreferredLanguage('ar');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">{t.name}</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.name}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t.phone}</label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+966xxxxxxxxx"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t.language}</label>
        <Select value={preferredLanguage} onValueChange={(value: any) => setPreferredLanguage(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(languageOptions).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex space-x-2 rtl:space-x-reverse">
        <Button type="submit">{t.add}</Button>
      </div>
    </form>
  );
};

export default AddCustomerForm;
