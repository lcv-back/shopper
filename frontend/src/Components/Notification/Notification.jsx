const Notification = ({onClose, message, status}) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-3 w-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        {status 
                            ? (<i className="fas fa-check-circle text-green-500 text-xl"></i>) 
                            : <i className="fas fa-times-circle text-red-500 text-xl"></i>
                        }   
                    </div>
                    <div className="ml-3">
                        <h3 className="text-md leading-5 font-medium text-gray-900">{message}</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Notification;