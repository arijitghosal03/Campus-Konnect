import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onOpenChange, title, description, children }) => (
  <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
    <DialogPrimitive.Overlay
      className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out"
    />
    <DialogPrimitive.Content
      className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg"
    >
      <DialogPrimitive.Close
        className="absolute top-4 right-4 focus:outline-none"
      >
        <X className="h-4 w-4" />
      </DialogPrimitive.Close>
      <DialogPrimitive.Title className="text-lg font-semibold">
        {title}
      </DialogPrimitive.Title>
      <DialogPrimitive.Description className="mt-2 text-sm text-muted-foreground">
        {description}
      </DialogPrimitive.Description>
      <div className="mt-4">{children}</div>
    </DialogPrimitive.Content>
  </DialogPrimitive.Root>
);

export default Modal;

