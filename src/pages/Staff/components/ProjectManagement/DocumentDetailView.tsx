import React from "react";

interface SelectedDocument {
  id: string;
  name: string;
  type: string;
}

interface DocumentDetailViewProps {
  selectedDocument: SelectedDocument | null;
}

export const DocumentDetailView: React.FC<DocumentDetailViewProps> = ({
  selectedDocument,
}) => {
  if (!selectedDocument) return null;

  return (
    <div className="space-y-6 p-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {selectedDocument.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Document Information</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Type:</span>{" "}
                {selectedDocument.type}
              </div>
              <div>
                <span className="font-medium">ID:</span> {selectedDocument.id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailView;
