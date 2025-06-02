
import { useState, useEffect } from "react";
import { Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Note } from "@/data/customersData";

type Language = 'ar' | 'en';

interface QuickNotesProps {
  language: Language;
}

const QuickNotes = ({ language }: QuickNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);

  const translations = {
    ar: {
      quickNotes: "ملاحظات سريعة",
      addNote: "إضافة ملاحظة",
      newNote: "ملاحظة جديدة...",
      showCompleted: "إظهار المكتملة",
      noNotes: "لا توجد ملاحظات"
    },
    en: {
      quickNotes: "Quick Notes",
      addNote: "Add Note",
      newNote: "New note...",
      showCompleted: "Show Completed",
      noNotes: "No notes"
    }
  };

  const t = translations[language];

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        text: newNote.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      setNotes([note, ...notes]);
      setNewNote('');
    }
  };

  const toggleNote = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, completed: !note.completed } : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const filteredNotes = showCompleted ? notes : notes.filter(note => !note.completed);

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{t.quickNotes}</span>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Checkbox
              id="showCompleted"
              checked={showCompleted}
              onCheckedChange={setShowCompleted}
            />
            <label htmlFor="showCompleted" className="text-sm font-normal">
              {t.showCompleted}
            </label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex space-x-2 rtl:space-x-reverse">
          <Input
            placeholder={t.newNote}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addNote();
              }
            }}
            className="flex-1"
          />
          <Button onClick={addNote} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">{t.noNotes}</p>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`flex items-start space-x-2 rtl:space-x-reverse p-2 rounded border ${
                  note.completed ? 'bg-gray-50 opacity-75' : 'bg-white'
                }`}
              >
                <Checkbox
                  checked={note.completed}
                  onCheckedChange={() => toggleNote(note.id)}
                  className="mt-1"
                />
                <span
                  className={`flex-1 text-sm ${
                    note.completed ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {note.text}
                </span>
                <Button
                  onClick={() => deleteNote(note.id)}
                  size="sm"
                  variant="ghost"
                  className="p-1 h-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickNotes;
