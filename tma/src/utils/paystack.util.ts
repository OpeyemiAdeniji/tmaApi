import Axios from 'axios';

const config = {
    headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
    }
}

export const getTransactions = async (query: any): Promise<any> => {

    // status: 'failed', 'success', 'abandoned'

    let result, build;
    
    if(query){

        const { perPage, page, customer, status } = query;

        build = `?${perPage ? 'perPage=' + perPage : ''}&
        ${page ? 'page=' + page : ''}&
        ${customer ? 'customer=' + customer : ''}&
        ${status ? 'status=' + status : ''}`
    }

    await Axios.get(`${process.env.PAYSTACK_API_URL}/transaction${query ? build : ''}`, config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const getTransaction = async (id: any): Promise<any> => {

    let result;

    await Axios.get(`${process.env.PAYSTACK_API_URL}/transaction/${id}`, config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const initTxn = async (data: object | any): Promise<any> => {

    let result;

   // Add a custom_fields attribute which has an array of objects 
   // if you would like the fields to be added to your transaction 
   // when displayed on the dashboard.
   // txnCharge is for flat rate settlements

    const build = {
        email: data.email,
        amount: data.amount * 100,
        currency: data.currency || 'NGN',
        reference: data.reference,
        callback_url: data.callbackUrl || null,
        plan: data.planCode || null,
        invoice_limit: data.invoiceLimit || null,
        metadata: data.meta || null,
        subaccount: data.subaccountCode || null,
        transaction_charge: data.txnCharge || null,
        bearer: data.payBearer || null,
        channels: data.channels || null
    }

    await Axios.post(`${process.env.PAYSTACK_API_URL}/transaction/initialize`, {...build}, config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const verifyTransaction = async (ref: string): Promise<any> => {

    let result;

    await Axios.get(`${process.env.PAYSTACK_API_URL}/transaction/verify/${ref}` , config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const createCharge = async(data: object | any): Promise<any> => {

    let result;

    await Axios.post(`${process.env.PAYSTACK_API_URL}/charge`, {...data}, config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        // console.log(err)
        result = err.response.data;
    })

    return result;

} 

export const chargeAuth = async (data: object | any): Promise<any> => {

    let result;

    const build = {
        email: data.email,
        amount: data.amount * 100,
        currency: data.currency || 'NGN',
        reference: data.reference,
        callback_url: data.callbackUrl || null,
        plan: data.planCode || null,
        invoice_limit: data.invoiceLimit || null,
        metadata: data.meta || null,
        subaccount: data.subaccountCode || null,
        authorization_code: data.authCode,
        transaction_charge: data.txnCharge || null, // for flat fee
        bearer: data.payBearer || null,  // who bears the paystack fee
        channels: data.channels || null
    }

    await Axios.post(`${process.env.PAYSTACK_API_URL}/transaction/charge_authorization`, {...build}, config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const verifyAuth = async (ref: string): Promise<any> => {

    let result;

    await Axios.get(`${process.env.PAYSTACK_API_URL}/transaction/verify/${ref}` , config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const formatCharge = async (charge: object | any): Promise<any> => {

    let chargeResp = {
        nextStep: '',
        url: '',
        status: '',
        displayText: '',
        reference: '',
        type: '',
        meta: {}
    };

    const reference = charge.data.reference;
    const status = charge.data.status;
    
    if(status === 'open_url'){
        chargeResp.nextStep = 'redirect customer to the url provided';
        chargeResp.url = charge.data.url;
        chargeResp.status = 'pending';
        chargeResp.reference =  charge.data.reference;
        chargeResp.type = 'url'
    }

    if(status === 'send_pin'){
        chargeResp.nextStep = 'card pin is required';
        chargeResp.displayText = 'customer card pin is required';
        chargeResp.status = 'pending';
        chargeResp.reference =  charge.data.reference;
        chargeResp.type = 'pin'
    }

    if(status === 'send_otp'){
        chargeResp.nextStep = 'OTP is required';
        chargeResp.displayText = 'enter the otp sent to your phone number and/or email';
        chargeResp.status = 'pending';
        chargeResp.reference =  charge.data.reference;
        chargeResp.type = 'otp'
    }

    if(status === 'failed'){
        chargeResp.displayText = 'unable to process transaction. Contact support';
        chargeResp.status = 'failed';
        chargeResp.reference =  charge.data.reference;
        chargeResp.meta = charge.data;
    }

    if(status === 'send_birthday'){
        chargeResp.nextStep = 'customer birthday is required';
        chargeResp.displayText = 'supply customer birtday information';
        chargeResp.status = 'pending';
        chargeResp.reference =  charge.data.reference;
        chargeResp.type = 'birthday';
    }

    if(status === 'send_phone'){
        chargeResp.nextStep = 'Phone is required';
        chargeResp.displayText = 'supply customer phone number';
        chargeResp.status = 'pending';
        chargeResp.reference =  charge.data.reference;
        chargeResp.type = 'phone'
    }

    if(status === 'send_address'){
        chargeResp.nextStep = 'Address is required';
        chargeResp.displayText = 'supply customer address';
        chargeResp.status = 'pending';
        chargeResp.reference =  charge.data.reference;
        chargeResp.type = 'address'
    }

    if(status === 'success' && (charge.data.gateway_response === 'Successful' || charge.data.gateway_response === 'Approved')){

        chargeResp.displayText = 'transaction successful';
        chargeResp.status = 'success';
        chargeResp.reference =  charge.data.reference;

    }

    if(status === 'timeout'){
        chargeResp.displayText = 'transaction failed, try again.';
        chargeResp.status = 'failed';
        chargeResp.reference =  charge.data.reference;
    }

    if(status === 'pending'){
        chargeResp.displayText = 'transaction is being processed, check back for status';
        chargeResp.status = 'pending';
        chargeResp.reference =  charge.data.reference;
    }


    const result = {
        reference: reference,
        ps: status,
        status: chargeResp.status,
        data: chargeResp
    }

    return result ? result : null;

}

export const verifyNuban = async (data: object | any): Promise<any> => {

    let result;

    const query = `account_number=${data.accountNo}&bank_code=${data.bankCode}`

    await Axios.get(`${process.env.PAYSTACK_API_URL}/bank/resolve?${query}` , config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;


}

export const createRecipient = async (data: object | any): Promise<any> => {

    let result;

    const query = {
        type: 'nuban',
        name: data.merchantName,
        description: data.description,
        account_number: data.accountNo,
        bank_code: data.bankCode,
        currency: data.currency,
        metadata: data.meta ? data.meta : {}
    }

    await Axios.post(`${process.env.PAYSTACK_API_URL}/transferrecipient`, {...query} , config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;


}

export const transfer = async (data: object | any): Promise<any> => {

    let result;

    const query = {
        source: data.source,
        amount: (data.amount * 100),
        recipient: data.recipientCode,
        account_number: data.accountNo,
        reason: data.reason,
        currency: data.currency ? data.currency : 'NGN',
        reference: data.reference
    }

    await Axios.post(`${process.env.PAYSTACK_API_URL}/transfer`, {...query} , config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;


}

export const submitPay = async (data: object | any, type: string): Promise<any> => {

    let result, payData: object | any = {};

    if(type === 'pin'){
        
        payData.reference = data.reference,
        payData.pin = data.pin,
        payData.url = 'submit_pin'
    }
    
    if(type === 'otp'){
        payData.reference= data.reference,
        payData.otp = data.otp,
        payData.url = 'submit_otp'
    }
    
    if(type === 'phone'){
        payData.reference = data.reference,
        payData.phone = data.phone,
        payData.url = 'submit_phone'
    }
    
    if(type === 'birthday'){
        payData.reference = data.reference,
        payData.birthday = data.birthday, // YYYY-MM-DD
        payData.url = 'submit_birthday'
    }
    
    if(type === 'address'){
        payData.reference = data.reference,
        payData.address = data.address,
        payData.city = data.city,
        payData.state = data.state,
        payData.zip_code = data.zip_code,
        payData.url = 'submit_address'
    }

    await Axios.post(`${process.env.PAYSTACK_API_URL}/charge/${payData.url}`, {...payData} , config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const createSubaccount = async (data: object | any): Promise<any> => {

    let result;

    const build = {
        business_name: data.businessName,
        bank_code: data.bankCode,
        account_number: data.accountNo,
        percentage_charge: data.perCharge
    }

    await Axios.post(`${process.env.PAYSTACK_API_URL}/subaccount`, {...build} , config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const verifyBVN = async (data: object | any): Promise<any> => {

    let result;

    const build = {
        bvn: data.bvn,
        account_number: data.accountNo,
        bank_code: data.bankCode
    }

    await Axios.post(`${process.env.PAYSTACK_API_URL}/bvn/match`, {...build}, config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const verifyCard = async (bin: object | any): Promise<any> => {

    // bin is first 6 digits of card
    let result;

    await Axios.get(`${process.env.PAYSTACK_API_URL}/decision/bin/${bin}`, config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    // result.data equals 
    // "bin": "408408",
    // "brand": "visa",
    // "sub_brand": "",
    // "country_code": "NG",
    // "country_name": "Nigeria",
    // "card_type": "DEBIT",
    // "bank": "Test Bank",
    // "linked_bank_id": 24

    return result;

}

export const createRefund = async (data: object | any): Promise<any> => {

    let result;

    const build = {
        transaction: data.reference,
        amount: data.amount * 100,
        currency: data.currency || 'NGN',
        customer_note: data.customerReason,
        merchant_note: data.merchantReason
    }

    await Axios.post(`${process.env.PAYSTACK_API_URL}/refund`, {...build}, config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const getRefunds = async (data: object | any): Promise<any> => {

    let result;

    const build = `?${data.reference ? 'reference=' + data.reference : ''}&${data.currency ? 'currency=' + data.currency : ''}`

    await Axios.get(`${process.env.PAYSTACK_API_URL}/refund${build}`, config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const getRefund = async (data: object | any): Promise<any> => {

    let result;

    await Axios.get(`${process.env.PAYSTACK_API_URL}/refund/${data.reference ? data.reference : ''}`, config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const createPlan = async (data: object | any): Promise<any> => {

    let result;

    const build = {
        name: data.planName,
        interval: data.interval, // 'monthly', 'daily', 'weekly', 'monthly', 'quarterly', 'annually'
        amount: data.amount * 100,
        currency: data.currency || 'NGN',
        description: data.description,
        send_invoices: false,
        send_sms: false,
    }

    await Axios.post(`${process.env.PAYSTACK_API_URL}/plan`, {...build}, config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const getPlans = async (data: object | any): Promise<any> => {

    let result;

    const build = `?${data.perPage ? 'perPage=' + data.perPage : ''}&
    ${data.page ? 'page=' + data.page : ''}&${data.interval ? 'interval=' + data.interval : ''}&
    ${data.amount ? 'amount=' + data.amount * 100 : ''}`

    await Axios.get(`${process.env.PAYSTACK_API_URL}/plan${build}`, config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const getPlan = async (data: object | any): Promise<any> => {

    let result;

    const build = `${data.planId ? data.planId : data.planCode ? data.planCode : ''}`

    await Axios.get(`${process.env.PAYSTACK_API_URL}/plan/${build}`, config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const updatePlan = async (data: object | any): Promise<any> => {

    let result;

    const param = `${data.planId ? data.planId : data.planCode ? data.planCode : ''}`;

    const build = {
        name: data.planName,
        interval: data.interval, // 'monthly', 'daily', 'weekly', 'monthly', 'quarterly', 'annually'
        currency: data.currency || 'NGN',
        description: data.description,
        send_invoices: false,
        send_sms: false,
    }

    await Axios.put(`${process.env.PAYSTACK_API_URL}/plan/${param}`, {...build} , config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const createTxnSub = async (data: object | any): Promise<any> => {

    let result;

    const build = {
        email: data.email,
        amount: data.amount * 100,
        currency: data.currency || 'NGN',
        reference: data.reference,
        callback_url: data.callbackUrl || null,
        plan: data.planCode || null,
        invoice_limit: data.invoiceLimit || null,
        metadata: data.meta || null,
    }

    await Axios.post(`${process.env.PAYSTACK_API_URL}/transaction/initialize`, {...build}, config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const createSub = async (data: object | any): Promise<any> => {

    let result;

    const build = {
        customer: data.email ? data.email : data.customerCode,
        plan: data.planCode,
        start_date: data.startDate  // has to be ISO date format ://: e.g: 2017-05-16T00:30:13+01:00
    }

    await Axios.post(`${process.env.PAYSTACK_API_URL}/subscription`, {...build}, config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const getSubs = async (data: object | any): Promise<any> => {

    let result;

    const build = `?${data.perPage ? 'perPage=' + data.perPage : ''}&
    ${data.page ? 'page=' + data.page : ''}&${data.customer ? 'customer=' + data.customerId : ''}&
    ${data.plan ? 'plan=' + data.planId * 100 : ''}`

    await Axios.get(`${process.env.PAYSTACK_API_URL}/subscription${build}`, config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const getSub = async (data: object | any): Promise<any> => {

    let result;

    const build = `${data.subId ? data.subId : data.subCode ? data.subCode : ''}`

    await Axios.get(`${process.env.PAYSTACK_API_URL}/subscription/${build}`, config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const enableSub = async (data: object | any): Promise<any> => {

    let result;

    const build = {
        code: data.subCode,
        token: data.emailToken
    }

    await Axios.post(`${process.env.PAYSTACK_API_URL}/subscription/enable`, {...build}, config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}

export const disableSub = async (data: object | any): Promise<any> => {

    let result;

    const build = {
        code: data.subCode,
        token: data.emailToken
    }

    await Axios.post(`${process.env.PAYSTACK_API_URL}/subscription/disable`, {...build}, config)
    .then((resp) => {
        result = resp.data;
    }).catch((err) => {
        result = err.response.data;
    })

    return result;

}