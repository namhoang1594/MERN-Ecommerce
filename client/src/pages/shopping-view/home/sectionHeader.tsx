// components/shop-view/SectionHeader.tsx

import { Button } from "@/components/ui/button";

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onActionClick?: () => void;
};

export default function SectionHeader({
  title,
  actionLabel,
  onActionClick,
}: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-2xl font-semibold">{title}</h3>
      {actionLabel && (
        <Button variant="link" className="text-primary" onClick={onActionClick}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
