const mongoose = require('mongoose');
const { Schema } = mongoose;

const MataDataSchema = new mongoose.Schema({
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
            'Pending Submission',
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
        ref: 'Customers'
    }
});
const PhoneSchema = new mongoose.Schema({
    countryCode: {
        type: String,
        required: false
    },
    dialCode: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: false
    },
    fullNumber: {
        type: String,
        required: false
    }
}, { _id: false });

const BusinessInfoSchema = new mongoose.Schema({
    adminDescription: {
        type: String,
        default: null
    },
    companyName: String,
    companyType: String,
    industryType: String,
    subIndustryType: String,
    similarCompany: String,
    companyAge: String,
    developmentStage: String,
    country: String,
    // currency: String,
    lastFinYrEnd: Number,
    earningTrend: String,
    scalable: String,
    description: String,
    contact: PhoneSchema, // Changed from String to PhoneSchema
    email: String,
    // currency: Number,
    FinYrEndDate: Number,
    FinYrEndMonth: String,
    FinYrEnd: Number,
    currency: String
});

const ContactInfoSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
});

const FinanceInfoSchema = new mongoose.Schema({
    valueType: String,
    dataYear: Number,
    unitOfNumber: String,
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
});

const ForcastIncomeStatmentInfoSchema = new mongoose.Schema({
    salesGrowthRate: Number,
    cogs: Number,
    ebitdaMargin: Number,
    interestRate: Number,
    depreciationRate: Number,
    netProfitMargin: Number,
});

const ForcastBalanceSheetSchema = new mongoose.Schema({
    fixedAssets: Number,
    debtLoan: Number,
});

const ForcastRIPDaysSchema = new mongoose.Schema({
    receivableDays: Number,
    inventoryDays: Number,
    payableDays: Number,
});

// Define the nested schemas for the calculations objects
const checkBoxValuesSchema = new Schema({
    checkBoxPE: Boolean,
    includeCheckBoxPE: Boolean,
    checkBoxPE_1: Boolean,
    includeCheckBoxPE_1: Boolean,
    checkBoxPS: Boolean,
    includeCheckBoxPS: Boolean,
    checkBoxPS_1: Boolean,
    includeCheckBoxPS_1: Boolean,
    checkBoxEV_SALES: Boolean,
    includeCheckBoxEV_SALES: Boolean,
    checkBoxEV_SALES_1: Boolean,
    includeCheckBoxEV_SALES_1: Boolean,
    checkBoxEV_EBITDA: Boolean,
    includeCheckBoxEV_EBITDA: Boolean,
    checkBoxEV_EBITDA_1: Boolean,
    includeCheckBoxEV_EBITDA_1: Boolean,
}, { _id: false });

const BackEndInputsSchema = new mongoose.Schema({
    cmpnyDiscFactorAge: Number,
    cmpnyDiscFactor: Number,
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
    currencyConversionRate: Number,
    sales: Number,
});

const DocumentSchema = new mongoose.Schema({
    name: String,
});

const PlanDataSchema = new mongoose.Schema({
    planId: {
        type: Schema.Types.ObjectId,
        ref: 'Plan'
    },
    planName: String,
    planType: String,
    planSequenceId: String,
    planOrderId: {
        type: Schema.Types.ObjectId,
        ref: 'PlanRecord'
    }
});

const OrderSchema = new mongoose.Schema(
    {
        matadata: MataDataSchema,
        business: BusinessInfoSchema,
        contact: ContactInfoSchema,
        finance: FinanceInfoSchema,
        plan: PlanDataSchema,
        forcast_inc_stmt: {
            type: [ForcastIncomeStatmentInfoSchema],
            default: undefined
        },
        forcast_bal_sheet: {
            type: [ForcastBalanceSheetSchema],
            default: undefined
        },
        forcast_rip_days: ForcastRIPDaysSchema,
        back_end_inputs: BackEndInputsSchema,
        back_end_table: {
            type: [],
            default: null
        },
        // Multiples data fields - use Schema.Types.Mixed for flexibility
        PE: { type: Schema.Types.Mixed, default: {} },
        PE_1: { type: Schema.Types.Mixed, default: {} },
        PS: { type: Schema.Types.Mixed, default: {} },
        PS_1: { type: Schema.Types.Mixed, default: {} },
        EV_SALES: { type: Schema.Types.Mixed, default: {} },
        EV_SALES_1: { type: Schema.Types.Mixed, default: {} },
        EV_EBITDA: { type: Schema.Types.Mixed, default: {} },
        EV_EBITDA_1: { type: Schema.Types.Mixed, default: {} },

        // Valuation summary fields
        netDebt: { type: Number, default: 0 },
        weightMinEquityValue: { type: Number, default: 0 },
        weightAvgEquityValue: { type: Number, default: 0 },
        weightMaxEquityValue: { type: Number, default: 0 },
        EnterpriseMinValue: { type: Number, default: 0 },
        EnterpriseAvgValue: { type: Number, default: 0 },
        EnterpriseMaxValue: { type: Number, default: 0 },

        orderId: Number,
        customerOrderSequence: { type: Number, default: 1 },
        last_submitted_date: Date,
        due_date: Date,
        submittedOn: Date,
        revisedSubmittedOn: Date,
        completedOn: Date,
        revisedCompletedOn: Date,
        revisedSubmittedBy: {
            type: Schema.Types.ObjectId,
            default: null
        },
        assigned_to: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        submittedBy: {
            type: Schema.Types.ObjectId,
        },
        submittedByRole: {
            type: String,
            enum: [
                'Admin',
                'User'
            ]
        },
        custody: {
            type: String,
            enum: [
                'Customer',
                'Company'
            ],
            default: null
        },
        valuationStatus: {
            type: String,
            enum: [
                '1',
                '0'
            ],
            default: 0
        },
        checkBoxesValues: checkBoxValuesSchema,
        documents: [DocumentSchema],
        remarks: {
            type: String,
            default: null
        },

        reportDocName: {
            type: String,
            default: null
        },
        initial_input: {
            type: Schema.Types.Mixed,  // This allows storing objects, arrays, or any type of data
            default: null
        },
    },
    { timestamps: true }
);

const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;
