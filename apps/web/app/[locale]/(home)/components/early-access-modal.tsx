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
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { executeRecaptcha } from '../../../../lib/recaptcha';
import { submitEarlyAccess } from '../../actions/early-access';

interface EarlyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  companyType: string;
  eventPlanningProblem: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  companyType?: string;
  eventPlanningProblem?: string;
  general?: string;
}

export const EarlyAccessModal = ({
  isOpen,
  onClose,
}: EarlyAccessModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    companyType: '',
    eventPlanningProblem: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        email: '',
        company: '',
        companyType: '',
        eventPlanningProblem: '',
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

    if (!formData.company.trim() || formData.company.length < 2) {
      newErrors.company = 'Company name must be at least 2 characters';
    }

    if (!formData.companyType) {
      newErrors.companyType = 'Please select a company type';
    }

    if (
      !formData.eventPlanningProblem.trim() ||
      formData.eventPlanningProblem.length < 10
    ) {
      newErrors.eventPlanningProblem =
        'Please describe your problem in at least 10 characters';
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
      const recaptchaToken = await executeRecaptcha('early_access_submit');

      // Submit form
      const result = await submitEarlyAccess({
        ...formData,
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
                Thank you for your interest!
              </h3>
              <p className="text-muted-foreground">
                We've received your early access request. We'll be in touch soon
                with next steps.
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
            Get Early Access
          </DialogTitle>
          <DialogDescription>
            Join the waitlist for EventDesk and be among the first to experience
            professional event management made simple.
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
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                type="text"
                placeholder="Enter your company name"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className={errors.company ? 'border-destructive' : ''}
              />
              {errors.company && (
                <p className="text-destructive text-sm">{errors.company}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyType">Company Type *</Label>
              <Select
                value={formData.companyType}
                onValueChange={(value) =>
                  handleInputChange('companyType', value)
                }
              >
                <SelectTrigger
                  className={errors.companyType ? 'border-destructive' : ''}
                >
                  <SelectValue placeholder="Select your company type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="freelancer">Freelancer</SelectItem>
                  <SelectItem value="sme">Small/Medium Enterprise</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="agency">Event Agency</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.companyType && (
                <p className="text-destructive text-sm">{errors.companyType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventPlanningProblem">
                What's your biggest event planning challenge? *
              </Label>
              <Textarea
                id="eventPlanningProblem"
                placeholder="Tell us about the challenges you face with event planning and management..."
                value={formData.eventPlanningProblem}
                onChange={(e) =>
                  handleInputChange('eventPlanningProblem', e.target.value)
                }
                className={`min-h-[100px] ${errors.eventPlanningProblem ? 'border-destructive' : ''}`}
              />
              {errors.eventPlanningProblem && (
                <p className="text-destructive text-sm">
                  {errors.eventPlanningProblem}
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Request Early Access'
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
