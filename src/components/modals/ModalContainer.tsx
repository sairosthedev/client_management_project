import React from 'react';

interface ModalContainerProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  zIndex?: number;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({
  children,
  isOpen,
  onClose,
  zIndex = 10,
}) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[${zIndex}] overflow-hidden`}>
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg shadow-xl transform transition-all">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}; 