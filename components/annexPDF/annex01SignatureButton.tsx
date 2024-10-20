"use client";

import { useState, useRef, useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import SignatureCanvas from "react-signature-canvas";
import MyDocument from "@/components/annexPDF/annex01PDF";

export default function SignPDFButton() {
  const [showModal, setShowModal] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 200 });

  useEffect(() => {
    if (showModal) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [showModal]);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        setCanvasSize({
          width: containerRef.current.offsetWidth,
          height: 200,
        });
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  const handleClear = () => {
    signatureRef.current?.clear();
    setSignature(null);
  };

  const handleSave = () => {
    if (signatureRef.current) {
      const dataURL = signatureRef.current.toDataURL();
      setSignature(dataURL);
    }
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        View PDF
      </button>

      <dialog ref={modalRef} className="modal">
        <div className="modal-box w-11/12 max-w-5xl h-[90vh] flex flex-col">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4">Student Organizations Recognition Requirements</h3>
          <div className="flex-grow overflow-hidden">
            <PDFViewer width="100%" height="100%">
              <MyDocument/>
            </PDFViewer>
          </div>
          <div className="mt-4">
            <h4 className="font-bold mb-2">Sign here:</h4>
            <div ref={containerRef} className="border border-gray-300 rounded">
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  width: canvasSize.width,
                  height: canvasSize.height,
                  className: "signature-canvas",
                }}
              />
            </div>
            <div className="mt-2 flex justify-end space-x-2">
              <button className="btn btn-secondary" onClick={handleClear}>
                Clear
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save Signature
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
