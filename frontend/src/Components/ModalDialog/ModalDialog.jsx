const ModalDialog = ({ onClose, modalTitle, renderBody, func}) => {
        return (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg w-1/3">
                    {/* Header */}
                    <div className="flex justify-between items-center border-b p-4">
                        <h3 className="text-lg font-semibold">{modalTitle}</h3>
                        <button onClick={() => onClose()} 
                                className="text-gray-500 hover:text-gray-700 size-3 flex items-center justify-center bg-gray-200">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
    
                    {/* Content */}
                    <div className="p-4">
                        {renderBody()}
                    </div>
    
                    {/* Footer */}
                    <div className="flex justify-end border-t p-4">
                        <button onClick={() => onClose()} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                            Close
                        </button>
                        {func && (
                            <button type="submit" onClick={() => {func(); onClose()}} className="text-white px-4 py-2 rounded mr-2">
                                Confirm
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
};

export default ModalDialog;
