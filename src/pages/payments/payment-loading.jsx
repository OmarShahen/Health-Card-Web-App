import { TailSpin } from "react-loader-spinner"

const PaymentLoadingModal = () => {

    return <div className="payment-loading-modal">
        <div className="payment-loading-container">
            <TailSpin width="40" height="40" color="white" />
        </div>
    </div>
}

export default PaymentLoadingModal