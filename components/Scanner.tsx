'use client';

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

const BarcodeScannerComponent = dynamic(() => import("react-qr-barcode-scanner"), { ssr: false });

export default function Scanner({ onCode }: { onCode: (code: string) => void }) {
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = useCallback((err: any, result: any) => {
    if (err) {
      setError(err.message || "Camera error");
      return;
    }
    if (result) {
      onCode(result.text);
    }
  }, [onCode]);

  return (
    <div>
      <BarcodeScannerComponent width={500} height={400} onUpdate={handleUpdate} />
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
}
