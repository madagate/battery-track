
import { useState } from "react";
import { CalendarIcon, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, subDays } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";

type Language = 'ar' | 'en';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const Header = ({ language, setLanguage, selectedDate, setSelectedDate }: HeaderProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const isRTL = language === 'ar';
  const locale = language === 'ar' ? ar : enUS;

  const translations = {
    ar: {
      title: "مؤسسة بوابة المدى التجارية",
      subtitle: "نظام إدارة البطاريات التالفة",
      selectDate: "اختر التاريخ",
      previousDay: "اليوم السابق",
      nextDay: "اليوم التالي"
    },
    en: {
      title: "Mada Gate Trading Est.",
      subtitle: "Battery Management System", 
      selectDate: "Select Date",
      previousDay: "Previous Day",
      nextDay: "Next Day"
    }
  };

  const t = translations[language];

  const handlePreviousDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  return (
    <header className="bg-white shadow-lg border-b-4 border-primary sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <img 
                src="/lovable-uploads/9006f5b3-c20d-4348-8a97-f237aa2ad30e.png" 
                alt="Mada Gate Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">{t.title}</h1>
              <p className="text-sm text-gray-600 font-medium">{t.subtitle}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Date Navigation */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousDay}
                title={t.previousDay}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {/* Date Picker */}
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[200px] justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                    {selectedDate ? (
                      format(selectedDate, "PPP", { locale })
                    ) : (
                      <span>{t.selectDate}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setCalendarOpen(false);
                      }
                    }}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextDay}
                title={t.nextDay}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'ar' ? 'EN' : 'العربية'}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
