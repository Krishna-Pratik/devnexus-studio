import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

type CalendlyModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url?: string;
  heading?: string;
  description?: string;
};

const DEFAULT_CALENDLY_URL = 'https://calendly.com/contact-devnexus/30min';

export default function CalendlyModal({
  open,
  onOpenChange,
  url = DEFAULT_CALENDLY_URL,
  heading = 'Book a Call',
  description = 'Pick a convenient time and we will connect with you.',
}: CalendlyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-h-[90vh] w-[97vw] max-w-5xl flex-col overflow-hidden border border-white/15 bg-black/95 p-0 shadow-2xl sm:rounded-2xl xl:max-w-6xl">
        <div className="border-b border-white/10 px-4 py-2.5 sm:px-5 sm:py-3">
          <h2 className="text-base font-semibold leading-tight text-white">{heading}</h2>
          <p className="text-xs text-slate-400 sm:text-[13px]">{description}</p>
        </div>

        <div className="flex-1 overflow-hidden bg-white">
          <iframe
            src={url}
            title="Book a Call"
            className="-mt-6 h-[calc(100%+1.5rem)] w-full border-0 sm:-mt-8 sm:h-[calc(100%+2rem)]"
            loading="lazy"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
