'use client';

import {
  Alert,
  AlertDescription,
} from '@repo/design-system/components/ui/alert';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { executeRecaptcha } from '../../../../lib/recaptcha';
import { submitDemoSchedule } from '../../actions/demo-schedule';

interface ScheduleDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  scheduledDate: string;
  scheduledTime: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  general?: string;
}

export const ScheduleDemoModal = ({
  isOpen,
  onClose,
}: ScheduleDemoModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    scheduledDate: '',
    scheduledTime: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Generate available dates (tomorrow onwards for next 30 days)
  const getAvailableDates = () => {
    const dates = [];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    for (let i = 0; i < 30; i++) {
      const date = new Date(tomorrow);
      date.setDate(tomorrow.getDate() + i);

      // Skip weekends for business demos
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        });
      }
    }

    return dates;
  };

  // Generate available time slots (business hours)
  const getAvailableTimeSlots = (): { value: string; label: string }[] => {
    const slots: { value: string; label: string }[] = [];
    const times = [
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:00',
      '11:30',
      '12:00',
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:00',
      '16:30',
      '17:00',
      '17:30',
    ];

    times.forEach((time) => {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(Number.parseInt(hours), Number.parseInt(minutes));

      slots.push({
        value: time,
        label: date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      });
    });

    return slots;
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        email: '',
        scheduledDate: '',
        scheduledTime: '',
      });
      setErrors({});
      setIsSuccess(false);
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.scheduledDate) {
      // Validate date is tomorrow or later
      const selectedDate = new Date(formData.scheduledDate);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      if (selectedDate < tomorrow) {
        newErrors.scheduledDate = 'Please select a date from tomorrow onwards';
      }
    } else {
      newErrors.scheduledDate = 'Please select a date';
    }

    if (!formData.scheduledTime) {
      newErrors.scheduledTime = 'Please select a time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Execute reCAPTCHA
      const recaptchaToken = await executeRecaptcha('demo_schedule_submit');

      // Format the date for display
      const selectedDate = new Date(formData.scheduledDate);
      const formattedDate = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Format the time for display
      const [hours, minutes] = formData.scheduledTime.split(':');
      const timeDate = new Date();
      timeDate.setHours(Number.parseInt(hours), Number.parseInt(minutes));
      const formattedTime = timeDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      // Submit form
      const result = await submitDemoSchedule({
        name: formData.name,
        email: formData.email,
        scheduledDate: formattedDate,
        scheduledTime: formattedTime,
        recaptchaToken,
      });

      if (result.success) {
        setIsSuccess(true);
      } else {
        setErrors({
          general: result.error || 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      setErrors({ general: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center gap-6 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-xl">
                Demo Scheduled Successfully!
              </h3>
              <p className="text-muted-foreground">
                Scheduled successfully, check your inbox for meeting link.
              </p>
            </div>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">
            Schedule a Demo
          </DialogTitle>
          <DialogDescription>
            Book a personalized demo to see how EventDesk can transform your
            event planning process.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-destructive text-sm">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-destructive text-sm">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Preferred Date *</Label>
              <Select
                value={formData.scheduledDate}
                onValueChange={(value) =>
                  handleInputChange('scheduledDate', value)
                }
              >
                <SelectTrigger
                  className={errors.scheduledDate ? 'border-destructive' : ''}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select a date" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableDates().map((date) => (
                    <SelectItem key={date.value} value={date.value}>
                      {date.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.scheduledDate && (
                <p className="text-destructive text-sm">
                  {errors.scheduledDate}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledTime">Preferred Time *</Label>
              <Select
                value={formData.scheduledTime}
                onValueChange={(value) =>
                  handleInputChange('scheduledTime', value)
                }
              >
                <SelectTrigger
                  className={errors.scheduledTime ? 'border-destructive' : ''}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableTimeSlots().map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.scheduledTime && (
                <p className="text-destructive text-sm">
                  {errors.scheduledTime}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                'Schedule Demo'
              )}
            </Button>
          </div>

          <p className="text-center text-muted-foreground text-xs">
            This form is protected by reCAPTCHA and the Google{' '}
            <a
              href="https://policies.google.com/privacy"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>{' '}
            and{' '}
            <a
              href="https://policies.google.com/terms"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>{' '}
            apply.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
