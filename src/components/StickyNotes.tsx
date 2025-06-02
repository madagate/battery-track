
import { useState } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Language = 'ar' | 'en';

interface Note {
  id: string;
  content: string;
  createdAt: string;
  color: string;
}

interface StickyNotesProps {
  language: Language;
}

const StickyNotes = ({ language }: StickyNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: 'تذكير: فحص البطاريات القديمة يوم الخميس',
      createdAt: new Date().toISOString(),
      color: 'bg-yellow-100'
    },
    {
      id: '2', 
      content: 'عميل جديد: محمد السلمي - رقم الهاتف: 0501234567',
      createdAt: new Date().toISOString(),
      color: 'bg-blue-100'
    }
  ]);
  
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');

  const noteColors = [
    'bg-yellow-100',
    'bg-blue-100', 
    'bg-green-100',
    'bg-pink-100',
    'bg-purple-100',
    'bg-orange-100'
  ];

  const translations = {
    ar: {
      stickyNotes: "الملاحظات",
      addNote: "إضافة ملاحظة",
      editNote: "تعديل الملاحظة",
      deleteNote: "حذف الملاحظة", 
      save: "حفظ",
      cancel: "إلغاء",
      newNotePlaceholder: "اكتب ملاحظتك هنا...",
      noNotes: "لا توجد ملاحظات بعد",
      createdAt: "تم الإنشاء"
    },
    en: {
      stickyNotes: "Sticky Notes",
      addNote: "Add Note",
      editNote: "Edit Note",
      deleteNote: "Delete Note",
      save: "Save", 
      cancel: "Cancel",
      newNotePlaceholder: "Write your note here...",
      noNotes: "No notes yet",
      createdAt: "Created"
    }
  };

  const t = translations[language];

  const addNote = () => {
    if (newNoteContent.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        content: newNoteContent.trim(),
        createdAt: new Date().toISOString(),
        color: noteColors[Math.floor(Math.random() * noteColors.length)]
      };
      
      setNotes([newNote, ...notes]);
      setNewNoteContent('');
      setIsAddingNote(false);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const startEditing = (note: Note) => {
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  const saveEdit = () => {
    if (editingNote && editContent.trim()) {
      setNotes(notes.map(note => 
        note.id === editingNote 
          ? { ...note, content: editContent.trim() }
          : note
      ));
      setEditingNote(null);
      setEditContent('');
    }
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setEditContent('');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t.stickyNotes}</h2>
        <Button 
          onClick={() => setIsAddingNote(true)}
          className="flex items-center space-x-2 rtl:space-x-reverse"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addNote}</span>
        </Button>
      </div>

      {/* Add New Note */}
      {isAddingNote && (
        <Card className="border-2 border-dashed border-primary/30">
          <CardContent className="p-4 space-y-4">
            <Textarea
              placeholder={t.newNotePlaceholder}
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="min-h-[100px] resize-none"
              autoFocus
            />
            <div className="flex space-x-2 rtl:space-x-reverse">
              <Button onClick={addNote} size="sm">
                <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {t.save}
              </Button>
              <Button 
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNoteContent('');
                }}
                variant="outline" 
                size="sm"
              >
                <X className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {t.cancel}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes Grid */}
      {notes.length === 0 && !isAddingNote ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t.noNotes}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <Card key={note.id} className={`${note.color} border-none shadow-md hover:shadow-lg transition-shadow`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-gray-600">
                    {t.createdAt}: {new Date(note.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                  </span>
                  <div className="flex space-x-1 rtl:space-x-reverse">
                    <Button
                      onClick={() => startEditing(note)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => deleteNote(note.id)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {editingNote === note.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[80px] resize-none bg-white/50"
                      autoFocus
                    />
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button onClick={saveEdit} size="sm">
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button onClick={cancelEdit} variant="outline" size="sm">
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StickyNotes;
