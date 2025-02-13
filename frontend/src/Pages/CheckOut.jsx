import ShippingDetails from '../Components/CheckOutPage/ShippingDetails/ShippingDetails.jsx'
import PaymentMethod from '../Components/CheckOutPage/PaymentMethod/PaymentMethod.jsx'
import OrderSummary from '../Components/CheckOutPage/OrderSummary/OrderSummary.jsx'
import { CheckoutProvider } from '../Context/CheckOutContext.jsx'
const CheckOut = () => {
    return (
            <CheckoutProvider>
                <main className="container mx-auto py-8 px-8">
                    <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
                    <div className="flex flex-col lg:flex-row lg:space-x-8">
                        <div className="lg:w-2/3">
                            <ShippingDetails/>
                            <PaymentMethod/>
                        </div>
                        <div className="lg:w-1/3">
                            <OrderSummary/>
                        </div>
                    </div>
                </main>
            </CheckoutProvider>
    )
}

export default CheckOut;