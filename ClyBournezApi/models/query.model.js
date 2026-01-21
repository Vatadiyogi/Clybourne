const mongoose = require('mongoose');
const { Schema } = mongoose;

const MataData = new mongoose.Schema({
    state: {
        type: String,
        enum: [
            'Request Received',
            'Request Allocated',
            'Work Completed',
            'Work Checked',
            'Report Generated',
            'Report Submitted',
            'Request Reopened',
            'Closed',
            'Completed'
        ],
        default: 'Request Received'
    },
    status: {
        type: String,
        enum: [
            'Submitted',
            'Re-Submitted',
            'Help Requested',
            'Closed',
            'Completed'
        ],
        default: null
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    }
})

const BusinessInfo = new mongoose.Schema({
    companyName: String,
    companyType: String,
    industryType: String,
    companyAge: String,
    developmentStage: String,
    country: String,
    currency: String,
    lastFinYrEnd: Number,
    earningTrend: String,
    scalable: String,
    description: String,
    contact: Number,
    email: String,
    currency: Number
})

const ContactInfo = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
})

const FinanceInfo = new mongoose.Schema({
    dataYear: Number,
    unitOfNumber: Number,
    sales: Number,
    costOfSales: Number,
    ebitda: Number,
    depreciation: Number,
    interestExpense: Number,
    netProfit: Number,
    cashBalance: Number,
    debtLoan: Number,
    equity: Number,
    receivables: Number,
    inventories: Number,
    payables: Number,
    netFixedAssets: Number,
})

const ForcastIncomeStatmentInfo = new mongoose.Schema({
    salesGrowthRate: Number,
    cogs: Number,
    ebitdaMargin: Number,
    interestRate: Number,
    depreciationRate: Number,
    netProfitMargin: Number,
})

const ForcastBalanceSheet = new mongoose.Schema({
    fixedAssets: Number,
    debtLoan: Number,
})

const ForcastRIPDays = new mongoose.Schema({
    receivableDays: Number,
    inventoryDays: Number,
    payableDays: Number,
})

const BackEndInputs = new mongoose.Schema({
    cmpnyDiscFactorAge: Number,
    cmpnyDiscFactorProfiability: Number,
    cmpnyDiscFactorTurnover: Number,
    weightOfAdjBeta: Number,
    alpha: Number,
    perpetualGrowthRate: Number,
    pptlDelta: Number,
    waccDelta: Number,
    treasuryondRate: Number,
    equityRiskPremium: Number,
    cntryRiskPremium: Number,
    corpTaxRate: Number,
    dcfWeightPercentage: Number,
})

const QuerySchema = new mongoose.Schema(
    {
        matadata: MataData,
        business: BusinessInfo,
        contact: ContactInfo,
        finance: FinanceInfo,
        forcast_inc_stmt: {
            type: [ForcastIncomeStatmentInfo],
            default: undefined
        },
        forcast_bal_sheet: {
            type: [ForcastBalanceSheet],
            default: undefined
        },
        forcast_rip_days: ForcastRIPDays,
        back_end_inputs: BackEndInputs,
        back_end_table: {
            type: [],
            default: undefined
        },
        last_submitted_date: Date,
        due_date: Date,
        assigned_to :  {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        custody: {
            type: String,
            enum: [
                'Customer',
                'Company'
            ],
            default: null
        },
        orderId: Number,
    },
    { timestamps: true }
)


// Export this model to be used in other API,s
const QueryModel = mongoose.model('Query', QuerySchema);
module.exports = QueryModel;