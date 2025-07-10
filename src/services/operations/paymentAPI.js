import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from '../../assets/Logo/rzp_logo.png'
import { setPaymentLoading } from "../../slices/courseSlice";
import { ResetCart } from "../../slices/cartSlice";

const {
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API
} = studentEndpoints

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = src;

        script.onload = () => {
            resolve(true);
        }

        script.onerror = () => {
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Loading...")
    try {
        //load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
        if(!res) {
            toast.error("Razorpay SDK failed to load");
            return;
        }

        //initiate the order
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API,
                            {courses},
                        {
                            Authorization: `Bearer ${token}`,
                        })

        if(!orderResponse.data.success) {
            throw new Error(orderResponse.data.message)
        }
        console.log("Key",REACT_APP_RAZORPAY_KEY);
        console.log("Order Response...", orderResponse)
        //options
        const options = {
            key: process.env.REACT_RAZORPAY_KEY,
            currency: orderResponse.data.message.currency,
            amount: `${orderResponse.data.message.amount}`,
            order_id: orderResponse.data.message.id,
            name: "StudyNotion",
            description: "Thank you for purchasing this course",
            image: rzpLogo,
            prefill: {
                name: `${userDetails.firstName}`,
                email: userDetails.email
            },
            handler: function(response) {
                //send successfull mail
                sendPaymentSuccessEmail(response, orderResponse.data.message.amount, token)
                //verify payment
                verifyPayment({...response, courses}, token, navigate, dispatch);
            }
        }
        //modal
        const paymentObject = new window.Razorpay(options)
        paymentObject.open();
        paymentObject.on("payment.failed", function(response) {
            toast.error("Oops, payment failed");
            console.log(response.error)
        })
        // console.log("Payment successfull...")
    } catch (error) {
        console.log("PAYMENT API ERROR............", error)
        toast.error("Payment Error")
    }
    toast.dismiss(toastId)
}

async function sendPaymentSuccessEmail(response, amount, token) {
    console.log("Oredrid:  ",response.razorpay_order_id,)
    console.log("pay id:...",response.razorpay_payment_id)
    try {
        const res = await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        },{
            Authorization: `Bearer ${token}`,
        })
    } catch (error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR......... ", error);
    }
}

async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment...");
    dispatch(setPaymentLoading(true));
    try {
        const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization: `Bearer ${token}`,
        })
    
    if(!response.data.success) {
        throw new Error(response.data.message)
    }
    toast.success("Payment Successful, you are added to the course");
    navigate("/dashboard/enrolled-courses");
    dispatch(ResetCart());
    } catch (error) {
        console.log("PAYMENT VERIFICATION FAILED ERROR......... ", error);
        toast.error("Could not verify payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}