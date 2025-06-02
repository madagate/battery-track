
export interface Note {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export const notes: Note[] = [
  {
    id: '1',
    text: 'متابعة طلب العميل أحمد محمد للبطاريات الخاصة',
    completed: false,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2', 
    text: 'التحقق من مخزون البطاريات الجافة',
    completed: false,
    createdAt: '2024-01-15T11:30:00Z'
  },
  {
    id: '3',
    text: 'تحديث أسعار البطاريات للعملاء المميزين',
    completed: true,
    createdAt: '2024-01-14T14:20:00Z'
  },
  {
    id: '4',
    text: 'الاتصال بالمورد للاستفسار عن الشحنة الجديدة',
    completed: false,
    createdAt: '2024-01-15T09:15:00Z'
  }
];
