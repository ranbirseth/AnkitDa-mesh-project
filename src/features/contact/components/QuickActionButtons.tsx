'use client';

import * as React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';

export interface QuickActionButtonsProps {
  readonly phone?: string;
  readonly whatsapp?: string;
  readonly className?: string;
}

export function QuickActionButtons({
  phone,
  whatsapp,
  className,
}: QuickActionButtonsProps): React.ReactElement {
  const whatsappLink = React.useMemo(() => {
    if (!whatsapp) return undefined;
    const digitsOnly = whatsapp.replace(/\D/g, '');
    return `https://wa.me/${digitsOnly}?text=Hi%20Ankit%20Da%20Mess%2C%20I%20would%20like%20to%20enquire%20about%20room%20availability%20at%20Fuljhore%2C%20Durgapur`;
  }, [whatsapp]);

  return (
    <div className={cn('flex flex-col sm:flex-row gap-3 w-full', className)}>
      {phone && (
        <Button
          variant="gold"
          size="lg"
          asChild
          className="w-full sm:flex-1"
        >
          <a href={`tel:${phone}`}>
            <Phone className="h-4 w-4" />
            Call Now
          </a>
        </Button>
      )}
      {whatsappLink && (
        <Button
          variant="glass-dark"
          size="lg"
          asChild
          className="w-full sm:flex-1"
        >
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </Button>
      )}
    </div>
  );
}
