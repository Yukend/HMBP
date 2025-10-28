import { useState, useEffect } from "react";
import { reminders as remindersStorage, auth } from "@/lib/storage";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Bell, Plus, Trash2, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Reminder {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: 'emi' | 'bill' | 'appointment' | 'warranty' | 'other';
  due_date: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  is_active: boolean;
  created_at: string;
}

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<'emi' | 'bill' | 'appointment' | 'warranty' | 'other'>('other');
  const [dueDate, setDueDate] = useState("");
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('once');
  const { toast } = useToast();

  useEffect(() => {
    fetchReminders();
    checkUpcomingReminders();
  }, []);

  const fetchReminders = () => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;

    const allReminders = remindersStorage.getAll();
    const userReminders = allReminders.filter(r => r.user_id === currentUser.id);
    setReminders(userReminders);
  };

  const checkUpcomingReminders = () => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;

    const upcoming = remindersStorage.getUpcoming(currentUser.id, 7);
    if (upcoming.length > 0) {
      toast({
        title: "Upcoming Reminders",
        description: `You have ${upcoming.length} reminder(s) in the next 7 days`,
      });
    }
  };

  const handleCreateReminder = () => {
    if (!title || !dueDate) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }

    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;

    try {
      remindersStorage.create({
        user_id: currentUser.id,
        title,
        description,
        type,
        due_date: dueDate,
        frequency,
        is_active: true,
      });

      toast({ title: "Success", description: "Reminder created successfully" });
      setTitle("");
      setDescription("");
      setDueDate("");
      setIsOpen(false);
      fetchReminders();
    } catch (error) {
      toast({ title: "Error", description: "Failed to create reminder", variant: "destructive" });
    }
  };

  const handleDeleteReminder = (id: string) => {
    try {
      remindersStorage.delete(id);
      toast({ title: "Success", description: "Reminder deleted" });
      fetchReminders();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete reminder", variant: "destructive" });
    }
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    try {
      remindersStorage.update(id, { is_active: !isActive });
      fetchReminders();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update reminder", variant: "destructive" });
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      emi: 'bg-blue-500',
      bill: 'bg-yellow-500',
      appointment: 'bg-green-500',
      warranty: 'bg-purple-500',
      other: 'bg-gray-500',
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getDaysUntil = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bell className="h-8 w-8" />
              Reminders
            </h1>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Reminder</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      placeholder="EMI Payment, Doctor Appointment, etc."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Additional details..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={type} onValueChange={(v: any) => setType(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emi">EMI</SelectItem>
                        <SelectItem value="bill">Bill</SelectItem>
                        <SelectItem value="appointment">Appointment</SelectItem>
                        <SelectItem value="warranty">Warranty</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Due Date *</Label>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select value={frequency} onValueChange={(v: any) => setFrequency(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">Once</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleCreateReminder} className="w-full">
                    Create Reminder
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {reminders.map((reminder) => {
              const daysUntil = getDaysUntil(reminder.due_date);
              return (
                <Card key={reminder.id} className={!reminder.is_active ? 'opacity-50' : ''}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {reminder.title}
                          <Badge className={getTypeColor(reminder.type)}>
                            {reminder.type}
                          </Badge>
                        </CardTitle>
                        {reminder.description && (
                          <p className="text-sm text-muted-foreground">{reminder.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(reminder.id, reminder.is_active)}
                        >
                          {reminder.is_active ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteReminder(reminder.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(reminder.due_date).toLocaleDateString()}</span>
                      </div>
                      <Badge variant="outline">{reminder.frequency}</Badge>
                      {daysUntil >= 0 && (
                        <span className={`font-semibold ${daysUntil <= 3 ? 'text-red-500' : 'text-green-500'}`}>
                          {daysUntil === 0 ? 'Due Today!' : `${daysUntil} days left`}
                        </span>
                      )}
                      {daysUntil < 0 && (
                        <span className="font-semibold text-red-500">Overdue!</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {reminders.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No reminders yet. Click "Add Reminder" to create one.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reminders;
