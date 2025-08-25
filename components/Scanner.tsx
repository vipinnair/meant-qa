'use client';

export default function Scanner({ onCode }: { onCode: (code: string) => void }) {
  // return (
  //   <div className="max-w-lg">
  //     <QrScanner
  //       onDecode={(result) => onCode(String(result))}
  //       onError={(err) => console.error(err)}
  //       constraints={{ facingMode: 'environment' }}
  //       containerStyle={{ width: '100%' }}
  //       videoStyle={{ width: '100%' }}
  //     />
  //   </div>
  // );

  return null;
}
